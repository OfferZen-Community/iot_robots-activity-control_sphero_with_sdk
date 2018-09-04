const sphero = require("sphero");
const keypress = require("keypress");
const spheroId = 'E6:C9:53:A9:EA:41';

const orb = sphero(spheroId);
let heading = 0;
let currentSpeed = 50;

console.log('trying to connect to sphero...');

keypress(process.stdin);
	
orb.connect(function () {
	console.log('connected to sphero')
	orb.color("blue");

	process.stdin.on('keypress', (ch, key)=>{
	switch(key.name){
		case 'up':
		currentSpeed += 50;
		break;
	case 'down':
		currentSpeed -= 50;
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
	default:
		break;
	}
   
   
   if (heading < 0) heading = 360 + heading;
   if (heading >= 360) heading = heading - 360;
	if (currentSpeed < 0) currentSpeed = 0;
	if (currentSpeed > 500) currentSpeed = 500;
   
   if(key.name!=='space') moveOrb(direction = heading, speed = currentSpeed);
   
    if(key && key.ctrl && key.name == 'c'){
		process.stdin.pause();
		process.exit(0)
		
	}
  });
});

process.stdin.setRawMode(true);
process.stdin.resume();

const moveOrb = (direction = 0, speed = 50, color = 'green')=>{
	console.log(direction);
	orb.color(color)
	orb.roll(speed, direction)
}

const justWoah = ()=>{
	orb.color('red')
	//heading = 0;
	orb.stop()
}
