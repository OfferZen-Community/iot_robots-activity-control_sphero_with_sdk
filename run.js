//
var sphero = require("sphero")
var spheroId = 'FD:94:C6:CA:0E:C0'
var orb = sphero(spheroId)

console.log('trying to connect to sphero...')

orb.connect(function () {
  console.log('connected to sphero')
  orb.color("green")
  //
  setTimeout(function(){
    orb.color("red")
  }, 2000)
})