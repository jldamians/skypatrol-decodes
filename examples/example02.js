'use strict';

var GENERIC_COMMAND_TYPES = require('../index.js').constants.commandTypes;
var commands = require('../index.js').commands();

console.log('activateImmobilizer =>', commands(GENERIC_COMMAND_TYPES.activateImmobilizer));
console.log('deactivateImmobilizer =>', commands(GENERIC_COMMAND_TYPES.deactivateImmobilizer));
console.log('eraseLogMemory =>', commands(GENERIC_COMMAND_TYPES.eraseLogMemory));
