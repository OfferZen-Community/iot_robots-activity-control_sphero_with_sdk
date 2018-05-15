//
var sphero = require("sphero")
var spheroId = 'FD:94:C6:CA:0E:C0'
var orb = sphero(spheroId)

console.log('trying to connect to sphero...')

orb.connect(function () {
  console.log('connected to sphero')

  orb.color("red").delay(2000).then(() => {
    return orb.color("yellow")
  }).delay(2000).then(() => {
    return orb.color("green")
  })

  orb.roll(100,0).delay(1500).then(() => {
    orb.roll(0,0)
  })
  //
  
})