const sphero = require("sphero");
const keypress = require("keypress");
const spheroId = 'E6:C9:53:A9:EA:41';

const orb = sphero(spheroId);

console.log('trying to connect to sphero...');

keypress(process.stdin);
	
orb.connect(function () {
  console.log('connected to sphero')
  orb.color("blue");

  process.stdin.on('keypress', (ch, key)=>{
   switch(key.name){
	   case 'up':
	    moveOrb();
	    break;
	   case 'down':
	    moveOrb(direction = 180);
	    break;
	   case 'left':
	    moveOrb(direction = 270);
	    break;
	   case 'right':
	    moveOrb(direction = 90);
	    break;
	   case 'space':
	    justWoah();
	    break;
	   default:
	    break;
   }
   
    if(key && key.ctrl && key.name == 'c'){
		process.stdin.pause();
		process.exit(0)
		
	}
  });
});

process.stdin.setRawMode(true);
process.stdin.resume();

const moveOrb = (direction = 0, speed = 50, color = 'green')=>{
	orb.color(color)
	orb.roll(speed, direction)
}

const justWoah = ()=>{
	orb.color('red')
	orb.stop()
}
