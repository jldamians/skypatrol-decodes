'use strict';

var GENERIC_COMMAND_TYPES = require('../index.js').constants.commandTypes;
var Commands = require('../index.js').commands;

console.log('activateImmobilizer =>', Commands(GENERIC_COMMAND_TYPES.activateImmobilizer));
console.log('deactivateImmobilizer =>', Commands(GENERIC_COMMAND_TYPES.deactivateImmobilizer));
console.log('eraseLogMemory =>', Commands(GENERIC_COMMAND_TYPES.eraseLogMemory));
