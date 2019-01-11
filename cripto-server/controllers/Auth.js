'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/RegisterService');


module.exports.firstAuth = function firstAuth (req, res, next) {
  var deviceId = req.swagger.params['deviceId'].value;
  var P1 = req.body.P1
  var P2 = req.body.P2

  console.log("\n\n\n\n===========================================")
  console.log("El dispositivo [" + deviceId + "] ha iniciado el segundo paso de la autentificación.")
  console.log("Con la P1: " + JSON.stringify(P1))
  console.log("Con la P2: " + JSON.stringify(P2))
  console.log("===========================================\n")
  Auth.secondStep(deviceId, P1, P2)
    .then(function (response) {
      utils.writeJson(res, response);
     // utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
      //utils.writeJson(res, response);
    });
};

module.exports.secondAuth = function secondAuth (req, res, next) {
  var deviceId = req.swagger.params['deviceId'].value;
  var V = req.body.V
  console.log("\n\n\n\n===========================================")
  console.log("El dispositivo [" + deviceId + "] ha iniciado el segundo paso de la autentificación.")
  console.log("Con la V: " + V)
  console.log("===========================================\n")
  Auth.lastStep(deviceId, V)
    .then(function (response) {
      utils.writeJson(res, response);
     // utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
     // utils.writeJson(res, response);
    });
};
