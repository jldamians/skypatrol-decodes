'use strict';

var base = require('../utils/convertBase.js'),
    helper = require('../helpers/');

var COMMAND_VALUES = require('../constants/').commandValues;

var API_NUMBER = '0001',
    COMMAND_TYPE = '04',
    MSG_TYPE = '00',
    API_OPTIONAL_HEADER_SIZE = '00';

var Command = (function(){
  /*
  * Generar comando
  * @param {string} length: numero de bytes en hexadecimal, que tendra el comando
  * @param {string} command: comando ATI
  * @return {Buffer}
  */
	function _generic(length, command) {
		var sendCommand,
        data_length = helper.lpad(base.decToHex(length), 4),
        command_ati = base.asciiToHex(command);

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

  return function(type) {
    var command = {};

    if (typeof type === 'object') {
      command = type;
    } else {
      command = COMMAND_VALUES[type];
    }

    return _generic(command.commandLength, command.commandAti);
  };
})();

module.exports = Command;
