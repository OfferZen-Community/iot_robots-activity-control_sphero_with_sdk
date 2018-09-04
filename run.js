const sphero = require("sphero");
const keypress = require("keypress");
const spheroId = 'E6:C9:53:A9:EA:41';

const orb = sphero(spheroId);
let heading = 0;

console.log('trying to connect to sphero...');

let x = 0;
let y = 0;
let halted = false
keypress(process.stdin);
process.stdin.on('keypress', (ch, key)=>{
   switch(key.name){
	   case 'down':
	   heading = 180
	    break;
	   case 'left':
	    heading -=10
	    break;
	   case 'right':
	    heading +=10
	    break;
	   case 'space':
	    justWoah();
	    break;
	    case 'c':
	    if (!key.ctrl) calibrate();
	    break;
	   default:
	    break;
   }
   
    if(key.name == 'o') console.log(x, y)
	if (heading < 0) heading = 360 + heading;
	if (heading >= 360) heading = heading - 360;
	if(key.name!=='space' && key.name!=='o' && key.name!=='c') moveOrb(direction = heading);
   
    if(key && key.ctrl && key.name == 'c'){
		process.stdin.pause();
		process.exit(0)
	}
});


orb.connect(function () {
  console.log('connected to sphero')
  orb.color("blue");
  
	orb.streamOdometer()
console.log(x,y)
	orb.on('odometer', (data)=>{
	  x = data.xOdometer.value[0]
	  y = data.yOdometer.value[0]
	   getDistance()
	})
});

process.stdin.setRawMode(true);
process.stdin.resume();

const moveOrb = (direction = 0, speed = 50, color = 'green', distance = 50)=>{
	halted = false
	orb.color(color)
	orb.roll(speed, direction)
}

const justWoah = ()=>{
	orb.color('red')
	heading = 0;
	orb.stop()
}

let randomColourOn = false;

const getDistance = () => {
 const distanceTravelled = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
 if(distanceTravelled > 300 && !halted) {
	justWoah()
	console.log('HALT!!!!!!!');
	halted = true
	}
 else if(distanceTravelled > 100 ) {
	 console.log(distanceTravelled)
 }
}

const calibrate = ()=>{
	console.log('Starting Calibration')
	orb.startCalibration();
  
	setTimeout(()=>{
	console.log('Finished Calibrating')
		orb.finishCalibration();
	},5000)
}
