var sphero = require("sphero");
var spheroId = process.argv[2];
var orb = sphero(spheroId);

console.log('trying to connect to sphero...');

orb.connect(function () {
  console.log('connected to sphero')
  orb.setMotionTimeout(1000)
  orb.color("green");
  orb.roll(50,0)
});