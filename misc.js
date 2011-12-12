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

Array.minIndex = function( array, toNumF ){
  toNumF = typeof(toNumF) != 'undefined' ? toNumF : function(e){ return e};

  var index = -1;
  var runningMin = Number.MAX_VALUE;
  array.forEach(function(ele, ind){
    if(toNumF(ele) < runningMin){
      index = ind;
      runningMin = toNumF(ele);
    }
  });
  return index;
};

Array.min = function(array, toNumF){
  var idx = Array.minIndex(array, toNumF);
  if(idx !== -1){
    return array[idx];
  }
}
Array.shuffle = function(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}

Array.prototype.detect = function(f){
  for(var i = 0; i < this.length; i++){
    if(f(this[i])){
      return this[i];
    }
  }
}
