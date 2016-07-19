'use strict';

var helper = require('../helpers'),
    constants = require('../constants'),
    base = require('../utils/convertBase');

var API_NUMBER = '0001',
    COMMAND_TYPE = '04',
    MSG_TYPE = '00',
    API_OPTIONAL_HEADER_SIZE = '00',
    COMMAND_VALUES = constants.commandValues;

function Command (command) {
  this.command = (typeof command === 'object') ? command : COMMAND_VALUES[command];
}

Command.prototype.getCommand = function() {
  var sendCommand,
      data_length,
      command_ati;

  data_length = helper.lpad(base.decToHex(this.command.commandLength), 4);
  command_ati = base.asciiToHex(this.command.commandAti);

  sendCommand = [
    data_length,
    API_NUMBER,
    COMMAND_TYPE,
    MSG_TYPE,
    API_OPTIONAL_HEADER_SIZE,
    command_ati
  ].join('');

  return new Buffer(sendCommand, 'hex');
}

module.exports = Command;
