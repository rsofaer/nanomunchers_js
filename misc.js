/// <summary> Keyboard code case insensitivity. </summary>
function case_i_equals(charCode, keycode){
  return (charCode === keycode || charCode - KEYCODES.CAPS_OFFSET === keycode);
}

/// <summary> Log to console if logging is supported. </summary>
/// <remarks>
///   <para> Logging is for debugging only. </summary>
/// </remarks>
function log(o){
  if(console !== undefined && console.log !== undefined){
    console.log(o);
  }
  return o;
}

/// <summary> Iterate the members of a class and bind them if they
///   are functions that are not contained in the prototype.
/// </summary>
function bindAllFunctions(obj){
  for(p in obj){
    if(obj.hasOwnProperty(p) && typeof p === "function"){
      obj[p] = p.bind(obj);
    }
  }
}

/// <summary> Find the index of the item whose execution with toNumF is
///   the miniumum.
/// </summary>
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

/// <summary> Find the array item whote execution with toNumF is
///   the minimum.
/// </summary>
Array.min = function(array, toNumF){
  var idx = Array.minIndex(array, toNumF);
  if(idx !== -1){
    return array[idx];
  }
}

/// <summary> Shuffle the array. </summary>
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

/// <summary> Find the first item in the array where the predicate
///   function returns true.
/// </summary>
Array.prototype.detect = function(f){
  for(var i = 0; i < this.length; i++){
    if(f(this[i])){
      return this[i];
    }
  }
}

// An object to keep track of what sounds are
// currently being played.
SoundsPlaying = {};

/// <summary> Play a sound. </summary>
function playSound(soundID){
  if(SoundsPlaying[soundID]){
    soundID +="_"
  }
  SoundsPlaying[soundID] = true;
  var ele = $("#sounds #" + soundID)[0];
  ele.Play();
  window.setTimeout(function(){
    SoundsPlaying[soundID] = false;
  },Number(ele.name)*1000);
}

