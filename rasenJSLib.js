function print(text, type) {
  var cTime = getTime()-startTime;
  var totalSeconds = Math.round(cTime / 1000);
  
  var formatToReadable =
  ("0" + Math.floor(totalSeconds / 60)).slice(-2) + ":" +
  ("0" + totalSeconds % 60).slice(-2) + ":" +
  ("0" + Math.floor((cTime % 1000))).slice(-3);
  
  if (!type || typeof type != "string") {
    console.log("["+formatToReadable+"] "+"[script.js/INFO]: "+text);
  } else {
    console.log("["+formatToReadable+"] "+"[script.js/"+type.toUpperCase()+"]: "+text);
  }
}
