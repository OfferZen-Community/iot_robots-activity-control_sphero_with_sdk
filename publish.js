const awsIot = require('aws-iot-device-sdk');
const keypress = require("keypress");
const username = 'theclive' // TODO: replace this
let throttle = false;

const device = awsIot.device({
	   keyPath: 'certificates/private.pem.key',
	  certPath: 'certificates/certificate.pem.crt',
	    caPath: 'certificates/ca.pem',
	  clientId: `${username}-publish`,
	      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
	console.log('Publisher client connected to AWS IoT cloud.\n');

	keypress(process.stdin);
		
	process.stdin.on('keypress', (ch, key)=>{
		//if(throttle)
		switch(key.name){
			case 'up':
			case 'down':
			case 'left':
			case 'right':
			case 'c':
				publish('keypress', key.name);
				break;
			case 'space':
				publish('stop', key.name);
				break;
			case 'h':
				publish('home', key.name);
				break;
			default:
				break;
		}
	   
		if(key && key.ctrl && key.name == 'c'){
			process.stdin.pause();
			process.exit(0)
		}
	});

	process.stdin.setRawMode(true);
	process.stdin.resume();

	
});

const publish = (topicSuffix, keyName) => {
	//throttle = !throttle
	console.log(`Publishing Message: ${keyName} on ${topicSuffix}`);
	device.publish(`makers/${username}/${topicSuffix}`, JSON.stringify({
		key: {
			name: keyName
		}
	}));
	//setTimeout(()=>{
	//	throttle = !throttle
	//},500)
}
