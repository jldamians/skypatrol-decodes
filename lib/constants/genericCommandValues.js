'use strict';

var TYPES = require('./genericCommandTypes');

var genericCommandValues = {};

genericCommandValues[TYPES.activateImmobilizer] = {
  commandLength: 24, commandAti: 'AT$TTTRGEV=18,0,2'
};
genericCommandValues[TYPES.deactivateImmobilizer] = {
  commandLength: 24, commandAti: 'AT$TTTRGEV=18,1,2'
};
genericCommandValues[TYPES.eraseLogMemory] = {
  commandLength: 21, commandAti: 'AT$TTLOGCL=0&W'
};

module.exports = genericCommandValues;
