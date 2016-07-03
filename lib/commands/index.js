'use strict';

var helper = require('../helpers'),
    constants = require('../constants'),
    base = require('../utils/convertBase');

function Command (command) {
  this.command = (typeof command === 'object') ? command : this.COMMAND_VALUES[command];
}

Command.prototype.API_NUMBER = '0001',
Command.prototype.COMMAND_TYPE = '04',
Command.prototype.MSG_TYPE = '00',
Command.prototype.API_OPTIONAL_HEADER_SIZE = '00';
Command.prototype.COMMAND_VALUES = constants.commandValues;

Command.prototype.getCommand = function() {
  var sendCommand,
      data_length,
      command_ati;

  data_length = helper.lpad(base.decToHex(this.command.commandLength), 4);
  command_ati = base.asciiToHex(this.command.commandAti);

  sendCommand = [
    data_length,
    this.API_NUMBER,
    this.COMMAND_TYPE,
    this.MSG_TYPE,
    this.API_OPTIONAL_HEADER_SIZE,
    command_ati
  ].join('');

  return new Buffer(sendCommand, 'hex');
}

module.exports = Command;
