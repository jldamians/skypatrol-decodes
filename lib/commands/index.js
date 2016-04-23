'use strict';

var base = require('../utils/convertBase.js'),
    helper = require('../helpers/');

var COMMAND_TYPES = require('../constants/').commandTypes;

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

	return {
		/*
		* immobilizer
		* @return {Buffer}: 415424545454524745563D31382C302C32
		*/
		activateImmobilizer: function() {
			var command = COMMAND_TYPES.activateImmobilizer;
			return _generic(command.commandLength, command.commandAti);
		},
		/*
		* mobilizer
		* @return {Buffer}: 415424545454524745563D31382C312C32
		*/
		deactivateImmobilizer: function() {
			var command = COMMAND_TYPES.deactivateImmobilizer;
			return _generic(command.commandLength, command.commandAti);
		},
		/*
		* limpiar memoria
		* @return {Buffer}: 41542454544C4F47434C3D302657
		*/
		eraseLogMemory: function() {
			var command = COMMAND_TYPES.eraseLogMemory;
			return _generic(command.commandLength, command.commandAti);
		}
	}
})();

module.exports = Command;
