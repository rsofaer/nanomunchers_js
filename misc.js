function case_i_equals(charCode, keycode){
  return (charCode === keycode || charCode - KEYCODES.CAPS_OFFSET === keycode);
}

function log(o){
  if(console !== undefined && console.log !== undefined){
    console.log(o);
  }
  return o;
}

function bindAllFunctions(obj){
  for(p in obj){
    if(obj.hasOwnProperty(p) && typeof p === "function"){
      obj[p] = p.bind(obj);
    }
  }
}

Array.min = function( array, f ){
    var index = 0;
    var runningMin = Number.MAX_VALUE;
    for(var i = 0; i < array.length; i++){
      
    }
    return Math.min.apply( Math, array );
};
