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
// var str = number.toString();
// var sum = add(number)
// //console.log("sum: " + str.substr(0, sum));
// var result = str.substr(sum, str.length) + "" + str.substr(0, sum);
// var finalResult = result
// return finalResult;
// }

// function add(string) {
//     string = (string + "").split('');                
//     var sum = 0;                               
//     for (var i = 0; i < string.length; i++) {  
//      //   console.log(parseInt(string[i]))
//      if (string[i] == 1 || string[i] == "1")
//         sum++;
              
//     }
//     return sum;     
}  



exports.ellipticMult = function(x, point){
    return  { x: x*point.x, y: x*point.y }
}

exports.pointStr = function(point){
    return point.x + "" + point.y;
}