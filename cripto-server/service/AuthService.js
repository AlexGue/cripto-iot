'use strict';


/**
 * Primer paso en la autenticacion
 * 
 *
 * deviceId FirstAuth 
 * returns String
 **/
exports.firstAuth = function(deviceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = { };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Segundo paso en la autenticacion
 * 
 *
 * deviceId SecondAuth 
 * returns String
 **/
exports.secondAuth = function(deviceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = { };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

