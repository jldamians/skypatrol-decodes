'use strict';

var moment = require('moment');

var base = require('../utils/convertBase')();

var helper = require('../helpers/')();

var CUSTOM_DATE = require('../constants/').customDate,
    TIME_KEYS = require('../constants/').timeKeys;

var Decode = function(){
  moment.locale(CUSTOM_DATE.locale);

  /*
   * Seteo de variables privadas del modulo
   * @param {string} trama => datos enviados por el gps (hexadecimal)
   * @param {string} ip => ip del gps
   * @param {string} port => puerto del gps
   */

  function process(trama, ip, port) {
    var transmissionTrama = trama ? trama : '';
    var tramaAscii = trama ? base.hexToAscii(trama) : '';
    var transmissionIp = ip ? ip : '';
    var transmissionPort = port ? port : 0;
    var currentDateTime = moment();

    tramaAscii = tramaAscii ? tramaAscii.split(',') : [];

    return {
      database: function() {
        var rmuid = this.deviceIndicators().unitsId();
        var utctime = moment(this.date().toText() + ' ' + this.time().toText() , CUSTOM_DATE.dateTimeFormat);
            utctime = utctime.isValid() ? utctime.format(CUSTOM_DATE.dateTimeFormat) : null;
        var celldatetime = moment(utctime, CUSTOM_DATE.dateTimeFormat);
            celldatetime = celldatetime.isValid() ? celldatetime.subtract(CUSTOM_DATE.greenwich, TIME_KEYS.h).format(CUSTOM_DATE.dateTimeFormat) : null;
        var gpsx = this.latitude();
        var gpsy = this.longitude();
        var insertdate = currentDateTime;
            insertdate = insertdate.isValid() ? insertdate.format(CUSTOM_DATE.dateTimeFormat) : null;
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
        var ip = transmissionIp;
        var inputvoltage = this.vehicleIndicators().analogInput1value();
        var backbatvoltage = this.vehicleIndicators().analogInput2value();
        var gpspdop = -1;
        var gpsheight = -1;
        var networktypeid = -1;
        var driverid = -1;
        var txreasonid = this.deviceIndicators().transmissionReason();
        var alertreason = -1;
        var hibernation = -1;
        var hrnetwork = -1;
        var milecounter = this.vehicleIndicators().mileCounter();
        var gpsmode1 = -1;
        var gpsmode2 = -1;
        var outputa = -1;
        var outputb = -1;
        var outputc = 0; // inmobilizer(1 => on / 0 => off)
        var outputd = -1;
        var optionalinput = -1;
        var gpscommstatus = -1;
        var rawdata = transmissionTrama;
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
      },

      deviceIndicators: function() {
        var value = '' ;

        if (tramaAscii.length < 1 || !tramaAscii[0]) {
          return {};
        }

        value = helper.trim(tramaAscii[0]);

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
          unitsId: function() {
            var uid = helper.trim(value.substr(24, 15));
            return uid;
          },
          transmissionReason: function() {
            var reason = helper.trim(value.substr(16, 2));
            reason = Number(reason);
            return reason;
          }
        }
      },

      latitude: function() {
        var latitud = 0,
            grados = 0,
            minutos = 0;

        if (tramaAscii.length >= 4 && tramaAscii[3]) {
          latitud = helper.trim(tramaAscii[3]);
          latitud = Number(latitud) / 100;

          grados = Math.floor(latitud);
          minutos = (latitud - grados) * 100 / 60;

          latitud = grados + minutos;

          if (tramaAscii.length >= 5 && tramaAscii[4] && helper.trim(tramaAscii[4]) == 'S') {
            latitud = latitud * -1;
          }
        }

        return latitud;
      },

      longitude: function() {
        var longitud = 0,
            grados = 0,
            minutos = 0;

        if (tramaAscii.length >= 6 && tramaAscii[5]) {
          longitud = helper.trim(tramaAscii[5]);
          longitud = Number(longitud) / 100;

          grados = Math.floor(longitud);
          minutos = (longitud - grados) * 100 / 60;

          longitud = grados + minutos;

          if (tramaAscii.length >= 7 && tramaAscii[6] && helper.trim(tramaAscii[6]) == 'W') {
            longitud = longitud * -1;
          }
        }

        return longitud;
      },

      groundSpeed: function() {
        var value = 0;

        if (tramaAscii.length >= 8 && tramaAscii[7]) {
          value = helper.trim(tramaAscii[7]);
          value = Math.round(value);
        }

        return value;
      },

      speedDirection: function() {
        var value = 0;

        if (tramaAscii.length >= 9 && tramaAscii[8]) {
          value = helper.trim(tramaAscii[8]);
          value = Number(value);
        }

        return value;
      },

      date: function() {
        var value = '' ;

        if (tramaAscii.length < 10 || !tramaAscii[9]) {
          return {};
        }

        value = helper.trim(tramaAscii[9]);
        value = helper.lpad(value, 6);

        return {
          year: function() {
            var year = value.substr(4, 2);
            return year;
          },
          month: function() {
            var month = value.substr(2, 2);
            return month;
          },
          day: function() {
            var day = value.substr(0, 2);
            return day;
          },
          toText: function() {
            return this.year() + '-' + this.month() + '-' + this.day();
          },
          toFormat: function(format) {
            var value = moment(this.toText(), CUSTOM_DATE.dateFormatGps);

            return value.isValid() ? value.format(CUSTOM_DATE.dateFormatGps) : null;
          }
        }
      },

      time: function() {
        var value = '' ;

        if (tramaAscii.length < 2 || !tramaAscii[1]) {
          return {};
        }

        value = helper.trim(tramaAscii[1]);
        value = helper.lpad(value, 6);

        return {
          hour: function() {
            var hour = value.substr(0, 2);
            return hour;
          },
          minute: function() {
            var minute = value.substr(2, 2);
            return minute;
          },
          second: function() {
            var second = value.substr(4, 2);
            return second;
          },
          toText: function() {
            return this.hour() + ':' + this.minute() + ':' + this.second();
          },
          toFormat: function(format) {
            var value = moment(this.toText(), CUSTOM_DATE.timeFormatGps);

            return value.isValid() ? value.format(CUSTOM_DATE.timeFormatGps) : null;
          }
        }
      },

      vehicleIndicators: function() {
        var value = '' ;

        if (tramaAscii.length < 13 || !tramaAscii[12]) {
          return {};
        }

        value = helper.trim(tramaAscii[12]);

        return {
          analogInput1value: function() {
            var input1 = helper.trim(value.substr(16, 12));
            input1 = Number(input1);
            return input1;
          },

          analogInput2value: function() {
            var input2 = helper.trim(value.substr(28, 6));
            input2 = Number(input2);
            return input2;
          },

          mileCounter: function() {
            var counter = helper.trim(value.substr(4, 12));
            counter = Number(counter);
            return counter;
          },
        }
      },

      validator: function() {
        var value = '';

        if (tramaAscii.length >= 3 && tramaAscii[2]) {
          value = helper.trim(tramaAscii[2]);
        }

        return value;
      }
    }
  }

  return process;
};

module.exports = Decode;
