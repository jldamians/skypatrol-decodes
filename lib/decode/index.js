'use strict';

var moment = require('moment'),
    helper = require('../helpers'),
    constants = require('../constants'),
    base = require('../utils/convertBase');

function Decode (trama, ip, port) {
  this.transmissionTrama = trama ? trama : '';
  this.tramaAscii = base.hexToAscii(this.transmissionTrama).split(',');
  this.socketIp = ip ? ip : '0.0.0.0';
  this.socketPort = port ? port : 0;
  this.currentDateTime = moment();

  moment.locale(this.CUSTOM_DATE.locale);
}

Decode.prototype.CUSTOM_DATE = constants.customDate;
Decode.prototype.TIME_KEYS = constants.timeKeys;

Decode.prototype.database = function() {
  var rmuid = this.deviceIndicators().unitsId;
  var utctime = moment(this.date().toText + ' ' + this.time().toText , this.CUSTOM_DATE.dateTimeFormat);
      utctime = utctime.isValid() ? utctime.format(this.CUSTOM_DATE.dateTimeFormat) : null;
  var celldatetime = moment(utctime, this.CUSTOM_DATE.dateTimeFormat);
      celldatetime = celldatetime.isValid() ? celldatetime.subtract(this.CUSTOM_DATE.greenwich, this.TIME_KEYS.h).format(this.CUSTOM_DATE.dateTimeFormat) : null;
  var gpsx = this.latitude();
  var gpsy = this.longitude();
  var insertdate = this.currentDateTime;
      insertdate = insertdate.isValid() ? insertdate.format(this.CUSTOM_DATE.dateTimeFormat) : null;
  var gpsdatetime = utctime;
  var speed = this.groundSpeed();
  var direction = this.speedDirection();
  var numofsat = -1;
  var locquality = -1;
  var engineon = 0; // ignicion(1 => on / 0 => off)
  var extinputa = -1;
  var extinputb = -1;
  var extinputc = 0; // ignicion(1 => on / 0 => off)
  var extinputd = -1;
  var extinpute = -1;
  var extinputf = 0; // panic(1 => on / 0 => off)
  var versionnum = '-1';
  var ip = this.socketIp;
  var inputvoltage = this.vehicleIndicators().analogInput1value;
  var backbatvoltage = this.vehicleIndicators().analogInput2value;
  var gpspdop = -1;
  var gpsheight = -1;
  var networktypeid = -1;
  var driverid = -1;
  var txreasonid = this.deviceIndicators().transmissionReason;
  var alertreason = -1;
  var hibernation = -1;
  var hrnetwork = -1;
  var milecounter = this.vehicleIndicators().mileCounter;
  var gpsmode1 = -1;
  var gpsmode2 = -1;
  var outputa = -1;
  var outputb = -1;
  var outputc = 0; // inmobilizer(1 => on / 0 => off)
  var outputd = -1;
  var optionalinput = -1;
  var gpscommstatus = -1;
  var rawdata = this.transmissionTrama;
  var plmn = -1;
  var sn = -1;
  var messagetype = -1;
  var msgprotocol = -1;
  var tripid = -1;
  var maneuverid = -1;
  var manueverusage = -1;
  var accidentbuffer = -1;
  var itemid = '-1';

  return {
    RMUId: rmuid, // Integer
    CellDateTime: celldatetime, // DateTime
    GPSX: gpsx, // Integer
    GPSY: gpsy, // Integer
    GPSDateTime: gpsdatetime, // DateTime
    Speed: speed, // Integer
    Direction: direction, // Integer
    NumOfSat: numofsat, // Integer
    LocQuality: locquality, // Integer
    EngineOn: engineon, // Integer
    ExtInputA: extinputa, // Integer
    ExtInputB: extinputb, // Integer
    ExtInputC: extinputc, // Integer
    ExtInputD: extinputd, // Integer
    ExtInputE: extinpute, // Integer
    ExtInputF: extinputf, // Integer
    VersionNum: versionnum, // Varchar(25)
    IP: ip, // Char(15)
    InputVoltage: inputvoltage, // Integer
    BackBatVoltage: backbatvoltage, // Integer
    GPSPDOP: gpspdop, // Small Integer(2 bytes)
    GPSHEIGHT: gpsheight, // Integer
    NetworkTypeId: networktypeid, // Small Integer(2 bytes)
    InsertDate: insertdate, // DateTime
    UTCTime: utctime, // DateTime
    DriverId: driverid, // Long(8 bytes)
    TxReasonId: txreasonid, // Integer
    AlertReason: alertreason, // Integer
    Hibernation: hibernation, // Integer
    HRNetwork: hrnetwork, // Integer
    MileCounter: milecounter, // Integer
    GPSMode1: gpsmode1, // Integer
    GPSMode2: gpsmode2, // Integer
    OutputA: outputa, // Integer
    OutputB: outputb, // Integer
    OutputC: outputc, // Integer
    OutputD: outputd, // Integer
    OptionalInput: optionalinput, // Integer
    GPSCommStatus: gpscommstatus, // Integer
    RawData: rawdata, // Varchar(2000)
    PLMN: plmn, // Integer
    SN: sn, // Integer
    MessageType: messagetype, // Integer
    MsgProtocol: msgprotocol, // Small Integer(2 bytes)
    TripId: tripid, // Integer
    ManeuverId: maneuverid, // Integer
    ManeuverUsage: manueverusage, // Small Integer(2 bytes)
    AccidentBuffer: accidentbuffer, // Small Integer(2 bytes)
    ItemId: itemid // Long
  }
}

Decode.prototype.deviceIndicators = function() {
  var value = '' ;

  if (this.tramaAscii.length < 1 || !this.tramaAscii[0]) {
    return {};
  }

  value = helper.trim(this.tramaAscii[0]);

  /*
    <NUL>.<NUL><LF><BS><DLE><NUL>         13
    0  => <NUL>
    1  => .
    2  => <NUL>
    3  => <LF>
    4  => <BS>
    5  => <DLE>
    6  => <NULL>
    7  =>
    8  =>
    9  =>
    10 =>
    11 =>
    12 =>
    13 =>
    14 =>
    15 =>
    16 => 1
    17 => 3
    ...
  */

  return {
    unitsId: helper.trim(value.substr(24, 15)),
    transmissionReason: Number(helper.trim(value.substr(16, 2)))
  }
}

Decode.prototype.latitude = function() {
  var latitud = 0,
      grados = 0,
      minutos = 0;

  if (this.tramaAscii.length >= 4 && this.tramaAscii[3]) {
    latitud = helper.trim(this.tramaAscii[3]);
    latitud = Number(latitud) / 100;

    grados = Math.floor(latitud);
    minutos = (latitud - grados) * 100 / 60;

    latitud = grados + minutos;

    if (this.tramaAscii.length >= 5 && this.tramaAscii[4] && helper.trim(this.tramaAscii[4]) == 'S') {
      latitud = latitud * -1;
    }
  }

  return latitud;
}

Decode.prototype.longitude = function() {
  var longitud = 0,
      grados = 0,
      minutos = 0;

  if (this.tramaAscii.length >= 6 && this.tramaAscii[5]) {
    longitud = helper.trim(this.tramaAscii[5]);
    longitud = Number(longitud) / 100;

    grados = Math.floor(longitud);
    minutos = (longitud - grados) * 100 / 60;

    longitud = grados + minutos;

    if (this.tramaAscii.length >= 7 && this.tramaAscii[6] && helper.trim(this.tramaAscii[6]) == 'W') {
      longitud = longitud * -1;
    }
  }

  return longitud;
}

Decode.prototype.groundSpeed = function() {
  var value = 0;

  if (this.tramaAscii.length >= 8 && this.tramaAscii[7]) {
    value = helper.trim(this.tramaAscii[7]);
    value = Math.round(value);
  }

  return value;
},

Decode.prototype.speedDirection = function() {
  var value = 0;

  if (this.tramaAscii.length >= 9 && this.tramaAscii[8]) {
    value = helper.trim(this.tramaAscii[8]);
    value = Number(value);
  }

  return value;
}

Decode.prototype.date = function() {
  var value = '';

  if (this.tramaAscii.length < 10 || !this.tramaAscii[9]) {
    return {};
  }

  value = helper.trim(this.tramaAscii[9]);
  value = helper.lpad(value, 6);

  return {
    year: value.substr(4, 2),
    month: value.substr(2, 2),
    day: value.substr(0, 2),
    toText: value.substr(4, 2) + '-' + value.substr(2, 2) + '-' + value.substr(0, 2)
  }
}

Decode.prototype.time = function() {
  var value = '';

  if (this.tramaAscii.length < 2 || !this.tramaAscii[1]) {
    return {};
  }

  value = helper.trim(this.tramaAscii[1]);
  value = helper.lpad(value, 6);

  return {
    hour: value.substr(0, 2),
    minute: value.substr(2, 2),
    second: value.substr(4, 2),
    toText: value.substr(0, 2) + ':' + value.substr(2, 2) + ':' + value.substr(4, 2)
  }
}

Decode.prototype.vehicleIndicators = function() {
  var value = '';

  if (this.tramaAscii.length < 13 || !this.tramaAscii[12]) {
    return {};
  }

  value = helper.trim(this.tramaAscii[12]);

  return {
    analogInput1value: Number(helper.trim(value.substr(16, 12))),
    analogInput2value: Number(helper.trim(value.substr(28, 6))),
    mileCounter: Number(helper.trim(value.substr(4, 12))),
  }
}

Decode.prototype.validator = function() {
  var value = '';

  if (this.tramaAscii.length >= 3 && this.tramaAscii[2]) {
    value = helper.trim(this.tramaAscii[2]);
  }

  return value;
}

module.exports = Decode;
