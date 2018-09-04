const sphero = require("sphero");
const keypress = require("keypress");
const awsIot = require('aws-iot-device-sdk');
//const moment = require('moment'); // for DateTime formatting

// IOT STUFF!!!!
const username = 'theclive'

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');
  
  device.subscribe('makers/' + username + '/keypress');
  device.subscribe('makers/' + username + '/stop');
  device.subscribe('makers/' + username + '/home');
});


device.on('message', (topic, payload) => {

	let message = JSON.parse(payload.toString());
	const { key } = message;
	
	console.log(`Received Message: ${key.name} from ${topic}`);
	
	switch (topic) {
		case 'makers/' + username + '/keypress':
			if (!ignoreKeys) {
				switch(key.name){
					case 'up':
						keyUp();
						break;
					case 'down':
						keyDown();
						break;
					case 'left':
						keyLeft();
						break;
					case 'right':
						keyRight();
						break;
					case 'c':
						if (!key.ctrl) calibrate();
						break;
					default:
						break;
				}
			}
			break;
		case 'makers/' + username + '/stop':
			justWoah();
			break;
		case 'makers/' + username + '/home':
			goHome();
			break;
		default:
			console.log(`Message received on topic "${topic}"\n`)
	}
});

// SPHERO STUFF!!!!!
const spheroId = 'E6:C9:53:A9:EA:41';
const orb = sphero(spheroId);
let heading = 0;
let currentSpeed = 0;
let ignoreKeys = false;

console.log('trying to connect to sphero...');

orb.connect(function () {
	console.log('connected to sphero')
	orb.color("blue");
});

const keyUp = () => {
	currentSpeed += 50;
	verifyValues();
	startEms();
	moveOrb(direction = heading, speed = currentSpeed);
};

const keyDown = () => {
	currentSpeed -= 50;
	verifyValues();
	startEms();
	moveOrb(direction = heading, speed = currentSpeed);
};

const keyLeft = () => {
	heading -= 45;
	verifyValues();
	startEms();
	moveOrb(direction = heading, speed = currentSpeed);
};

const keyRight = () => {
	heading += 45;
	verifyValues();
	startEms();
	moveOrb(direction = heading, speed = currentSpeed);
};

const verifyValues = () => {
	if (heading < 0) heading = 360 + heading;
	if (heading >= 360) heading = heading - 360;
	if (currentSpeed < 0) currentSpeed = 0;
	if (currentSpeed > 500) currentSpeed = 500;
}

let emsHandle = undefined;
let nowBlue = false;

const startEms = () => {
	if (!emsHandle) {
		emsHandle = setInterval(() => {
			if (nowBlue) {
				orb.color('red');
			} else {
				orb.color('blue');
			}
			nowBlue = !nowBlue;
		}, 500);
		
	}
}

const stopEms = () => {
	clearInterval(emsHandle);
	emsHandle = 0;
}

const moveOrb = (direction = 0, speed = 50, color = 'green')=>{
	orb.roll(speed, direction)
}

const justWoah = ()=>{
	stopEms();
	console.log('WOAH!');
	orb.color('red')
	heading = 0;
	currentSpeed = 0;
	orb.stop()
	console.log('STOPPED!');
}

const calibrate = ()=>{
	console.log('Starting Calibration')
	orb.stop();
	orb.startCalibration();
  
	setTimeout(()=>{
	console.log('Finished Calibrating')
		orb.finishCalibration();
	},5000)
}
const goHome =async ()=>{
	const homeX = 0;
	const homeY = 0;
	ignoreKeys = true;
	
	let isHomeY = false;
	let isHomeX = false;

	if (ignoreKeys) {
		orb.stop();
		stopEms();
		
		console.log('connected to sphero')
		orb.color("green");
		await orb.streamOdometer()
		
		orb.on('odometer', (data)=>{
			x = data.xOdometer.value[0]
			y = data.yOdometer.value[0]
			
			let speedY = 100;
			if (y > -10 && y < 10) {
				speedY = 5;
			} else if (y > -100 && y < 100) {
				speedY = 15;
			} else if (y > -200 && y < 200) {
				speedY = 50;
			}
			let speedX = 100;
			if (x > -10 && x < 10) {
				speedX = 5;
			} else if (x > -100 && x < 100) {
				speedX = 15;
			} else if (x > -200 && x < 200) {
				speedX = 50;
			}
			
			if(!isHomeY) {
				if(y > 2){
					moveOrb( direction = 180, speed = speedY)
				}else if(y < -2){
					moveOrb( direction = 0, speed = speedY)
				}else if(y >= -2 || y<= 2){
					isHomeY = true
					orb.stop()
				}
			} else {
				if(!isHomeX) {
					if(x > 2){
						moveOrb( direction = 270, speed = speedX)
					}else if(x < -2){
						moveOrb( direction = 90, speed = speedX)
					}else if(x >= -2 || x<= 2){
						isHomeX = true;
						orb.stop()
						setTimeout(() => {
							if (!(y > -2 && y < 2 && x > -2 && x < 2)) {
								console.log('We\'re not home yet!')
								isHomeY = false;
								isHomeX = false;
							} else {
								console.log('Welcome Home')
								orb.color('yellow')
								ignoreKeys = true;
								currentSpeed = 0;
								heading = 0;
							}
						}, 5000);
					}
				}
			}
		})
	}
}
