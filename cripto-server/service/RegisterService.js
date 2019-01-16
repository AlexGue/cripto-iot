'use strict';
var utils = require('../utils/utils.js');
var sha1 = require('js-sha1');
var devices = [];
var l_H = 10;
var timeout = 10000;

const G = { x: 5, y: 1 }

var serverDB = {};
var deviceDB = {};
/**
 * Registra un nuevo dispositivo
 * 
 *
 * deviceId String ID of pet that needs to be updated
 * no response value expected for this operation
 **/
exports.registerDevice = function(deviceId) {
  return new Promise(function(resolve, reject) {

    serverDB[deviceId] = {}

  if (devices.includes(deviceId)){
    resolve("ERROR: Ese dispositivo ya está registrado.")
  }
  devices.push(deviceId);
  var R = utils.randomBits(l_H);
  logItem("R", R)
  var X = utils.randomSecret(l_H); //Esto de momento se genera igual que el randomBits, es asi?
  logItem("X", X)
  var CK = utils.hfunction(R  + "" + X  + "" + timeout.toString(2) + "" + deviceId.toString(2));
  logItem("CK", CK)
  var CKbit = utils.getBits(CK);
 
  logItem("CKbit", CKbit)
  

  var CK2 = utils.ellipticMult(CKbit, G)
  logItem("CK2", CK2)
  var T = R^sha1(X);
  logItem("T", T)
  var A = utils.hfunction(T + "" + utils.pointStr(CK2))
  logItem("A", A)
  var A2 = utils.ellipticMult(utils.getBits(A), G)
  logItem("A2", A2)
  
  serverDB[deviceId]["id"] = deviceId;
  serverDB[deviceId]["A2"] = A2;
  serverDB[deviceId]["T"] = T;
  serverDB[deviceId]["CK"] = CK;



  var text = "El valor de CK' es: " + JSON.stringify(CK2) + "\n\n\n\n\n"
  text += "==========================================\n"
  text += "Calculos del dispositivo iOT (Siguiente paso):\n"
  text += step2(CK2) + "\n"
  text += "=========================================="
  resolve(text);
  })
}



// Debe sacar CK Y A2 Y T de lo guardado
exports.secondStep = function(deviceId, P1, P2) {
  return new Promise(function(resolve, reject) {

    if (!devices.includes(deviceId)){
      resolve("ERROR: Ese dispositivo no existe.")
    }
  var CK = serverDB[deviceId]["CK"]
  var A2 = serverDB[deviceId]["A2"]
  var T = serverDB[deviceId]["T"]

  var N2 = utils.randomBits(l_H);
  serverDB[deviceId]["N2"] = N2;
  serverDB[deviceId]["P1"] = P1;
  var P22 = sha1(utils.pointStr(P1) + "" + utils.pointStr(utils.ellipticMult(utils.getBits(CK), P1)))
  logItem("P22", P22)
  if (P22 != P2){
    console.log("Error en la autentificación : " + P22  + " -> NO COINCIDE -> " + P2) 
    //FIN - Los valores deben coincidir
  } else{
    console.log("Dispositivo [" +  deviceId + "] - Primer paso autentificación completada.")
  }
    var P3 = utils.ellipticMult(N2,G)
    var P4 = sha1(P22 + "" + utils.pointStr(utils.ellipticMult(N2, A2)))
    serverDB[deviceId]["P3"] = P3;
    serverDB[deviceId]["P4"] = P4;
  //}
  var text = "El valor de T' es: " + JSON.stringify(T) + "\n"
  text += "El valor de P3 es: " + JSON.stringify(P3) + "\n"
  text += "El valor de P4 es: " + JSON.stringify(P4) + "\n\n\n\n"
  text += "==========================================\n"
  text += "Calculos del dispositivo iOT (Siguiente paso):\n"
  text += step3(T, P3, P4) + "\n"
  text += "=========================================="
  resolve(text);
  })
}


exports.lastStep = function(deviceId, V){
  return new Promise(function(resolve, reject) {

    if (!devices.includes(deviceId)){
      resolve("ERROR: Ese dispositivo no existe.")
    }


  var P3 = serverDB[deviceId]["P3"] ;
  var P4 = serverDB[deviceId]["P4"];
  var N2 = serverDB[deviceId]["N2"];
  var P1 = serverDB[deviceId]["P1"];

 var V2 = sha1(P4 + "" + utils.pointStr(utils.ellipticMult(N2,P1)));
 logItem("V2", V2)
 if (V2 != V){
  console.log("Error en la autentificación : " + V2  + " -> NO COINCIDE -> " + V) 
  //FIN - Los valores deben coincidir
} else{
  console.log("Autentificación del dispositivo[" + deviceId +"] finalizada")
}
  var SK = sha1(utils.pointStr(P3) + "" + utils.pointStr(utils.ellipticMult(N2,P1)));
  console.log("\n====================================")
  console.log("Clave compartida: " + SK)
  console.log("====================================")
  resolve("Autentificación completada.")

  })

}







// DEVICE - SIMULATION


function step2(CK2){
  deviceDB["CK2"] = CK2;
  //var id = 155;
  var N1 = utils.randomBits(l_H);
  logItem("N1", N1)
  deviceDB["N1"] = N1;
  var P1 = utils.ellipticMult(N1, G);
  logItem("P1", P1)
  logItem("CK2", CK2)
  console.log(utils.pointStr(utils.ellipticMult(N1,CK2)))
  var P2 = sha1(utils.pointStr(P1) + "" + utils.pointStr(utils.ellipticMult(N1,CK2)));
  logItem("P2", P2)
  deviceDB["P2"] = P2;
  return "P1: " + JSON.stringify(P1) + "\nP2:"+ JSON.stringify(P2)
}

//Tiene que sacar CK2 que lo guardo antes
function step3(T, P3, P4){
  var CK2 = deviceDB["CK2"];
  var P2 = deviceDB["P2"];
  var N1 = deviceDB["N1"];

  var A = utils.hfunction(T + "" + utils.pointStr(CK2))
  var P42 = sha1(P2 + "" + utils.pointStr(utils.ellipticMult(utils.getBits(A), P3)))
  // if (P42 != P4){
  //   console.log("ERROR EN LA AUTENTIFICACIÓN " + P42 +  + " - " + P4) 
  //   //FIN - Los valores deben coincidir
  // } else{
  //   console.log("Primer paso de la autentificación completado.")
  // }
    var V = sha1(P42 + "" + utils.pointStr(utils.ellipticMult(N1, P3)))
    var SK = sha1(utils.pointStr(P3) + "" + utils.pointStr(utils.ellipticMult(N1, P3)))

    return "A: " + JSON.stringify(A) + "\nP4':"+ JSON.stringify(P4) + "\nV':"+ JSON.stringify(V) + "\nCLAVE COMPARTIDA':"+ JSON.stringify(SK)
}



function logItem(str, item){
  console.log("El valor de '" + str + "' es: " + JSON.stringify(item))
}
