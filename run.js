//
var sphero = require("sphero")
var spheroId = 'FD:94:C6:CA:0E:C0'
var orb = sphero(spheroId)
const turn = 90

console.log('trying to connect to sphero...')

orb.connect(function () {
  console.log('connected to sphero')

  orb.color("red").delay(2000).then(() => {
    return orb.color("yellow")
  }).delay(2000).then(() => {
    return orb.color("green")
  })

  orb.roll(100,0).delay(1000).then(() => {
    return orb.roll(100,turn)
  }).delay(1000).then(() => {
    return orb.roll(100, 2*turn)
  }).delay(1000).then(() => {
    return orb.roll(100, 3*turn)
  }).delay(100).then(() => {
    return orb.roll(100, 4*turn)
  }).delay(1000).then(() => {
    return orb.roll(0,0)
  })
  //
  
})