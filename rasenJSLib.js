var rjs = {
  startTime: getTime(),
  
  // rasenJS resources v1.0.2 real
  print: function(text, type){
    var cTime = getTime()-rjs.startTime;
    
    var totalSeconds = Math.floor(cTime / 1000);
    var m = Math.floor(totalSeconds / 60) || 0;
    var s = totalSeconds % 60 || 0;
    var ms = (cTime % 1000);
    
    var formatToReadable =
    (m<10?"0":"")+ m + ":" +
    (s<10?"0":"") + s + ":" +
    (ms<100?(ms<10?"00":"0"):"") + ms;
    
    var logType = (type?typeof type=="string"?type.toUpperCase():"INFO":"INFO");
    console.log("["+formatToReadable+"] "+"[script.js/"+logType+"]: "+text);
  },
  
  clamp: function(value,m,n){
    return Math.max(m,Math.min(n,value));
  },
  
  lerp: function(st,ed,a){
    return st+(ed-st)*a;
  },
  
  lerpRGB: function(rgb1,rgb2,a){
    var c = [rgb1.replace("rgb(", "").replace(")","").split(","),rgb2.replace("rgb(", "").replace(")","").split(",")];
    return rgb(
      rjs.lerp(parseFloat(c[0][0])||0,parseFloat(c[1][0])||0,a),
      rjs.lerp(parseFloat(c[0][1])||0,parseFloat(c[1][1])||0,a),
      rjs.lerp(parseFloat(c[0][2])||0,parseFloat(c[1][2])||0,a)
      );
  },
  
  lerpRGBA: function(rgba1,rgba2,a){
    var c = [rgba1.replace("rgba(", "").replace(")","").split(","),rgba2.replace("rgba(", "").replace(")","").split(",")];
    return rgb(
      rjs.lerp(parseFloat(c[0][0])||0,parseFloat(c[1][0])||0,a),
      rjs.lerp(parseFloat(c[0][1])||0,parseFloat(c[1][1])||0,a),
      rjs.lerp(parseFloat(c[0][2])||0,parseFloat(c[1][2])||0,a),
      rjs.lerp(parseFloat(c[0][3])||0,parseFloat(c[1][3])||0,a)
      );
  },
};
