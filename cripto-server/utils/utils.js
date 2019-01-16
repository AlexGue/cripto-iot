var md5 = require('js-md5');

exports.randomBits = function(bitsNeeded){
    var bits = "";
    while (bits.length-2 < bitsNeeded){
      bits+=  (Math.random()).toString(2);
    }
    bits =  bits.substr(2, bitsNeeded);
    return bits;
}

exports.getBits = function(CK){
    var CKbit =""
    for (var i = 0; i < CK.length; i++) {
        CKbit += CK[i].charCodeAt(0).toString(2) + "";
      }
      return CKbit;
}

exports.randomSecret = function(bitsNeeded){
    var bits = "";
    while (bits.length-2 < bitsNeeded){
      bits+=  (Math.random()).toString(2);
    }
    bits =  bits.substr(2, bitsNeeded);
    return bits;
}

exports.hfunction = function(number){
    return md5(number) 
}  

exports.ellipticMult = function(x, point){
    //Esto debe implementar la multiplicación eliptica para hacer el sistema seguro
    return  { x: x*point.x, y: x*point.y }
}

exports.pointStr = function(point){
    return point.x + "" + point.y;
}
