'use strict';

module.exports = {
	// immobilizer
	activateImmobilizer: {commandLength: 24, commandAti: 'AT$TTTRGEV=18,0,2'},
	// mobilizer
	deactivateImmobilizer: {commandLength: 24, commandAti: 'AT$TTTRGEV=18,1,2'},
	// limpiar memoria
	eraseLogMemory: {commandLength: 21, commandAti: 'AT$TTLOGCL=0&W'}
}
