'use strict';

var utils = require('../utils/writer.js');
var Register = require('../service/RegisterService');

module.exports.registerDevice = function registerDevice (req, res, next) {
  var deviceId = req.swagger.params['deviceId'].value;
  console.log("\n\n\n===========================================")
  console.log("El dispositivo [" + deviceId + "] ha iniciado el registro.")
  console.log("===========================================\n")


  Register.registerDevice(deviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
