'use strict';

var GENERIC_COMMAND_TYPES = require('../index.js').constants.commandTypes;
var Command = require('../index.js').Command;

console.log('activateImmobilizer =>', new Command(GENERIC_COMMAND_TYPES.activateImmobilizer));
console.log('deactivateImmobilizer =>', new Command(GENERIC_COMMAND_TYPES.deactivateImmobilizer));
console.log('eraseLogMemory =>', new Command(GENERIC_COMMAND_TYPES.eraseLogMemory));
