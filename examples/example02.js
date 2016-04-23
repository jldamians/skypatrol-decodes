'use strict';

var Commands = require('../index.js').commands;

console.log('activateImmobilizer =>', Commands.activateImmobilizer());
console.log('deactivateImmobilizer =>', Commands.deactivateImmobilizer());
console.log('eraseLogMemory =>', Commands.eraseLogMemory());