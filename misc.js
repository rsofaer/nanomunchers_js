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

/// <summary> Keep track of currently playing sounds. </summary>
SoundsPlaying = {fire: 0};

/// <summary> Play a sound. </summary>
function playSound(soundID){
  if(SoundsPlaying[soundID]){
    soundID +="_"
  }
  SoundsPlaying[soundID]++;
  var ele = $("#sounds #" + soundID)[0];
  try{
    ele.play();
  }catch(err){
    SoundsPlaying[soundID] = 0;
  }
  window.setTimeout(function(){
    SoundsPlaying[soundID]--;
  },1500);
}

////////////////////////////////////////////////////////////////////////////////
// Backports for IE compatibility.

/// <summary> Mozilla developer.mozilla.org bind() backport. </summary>
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/// <summary> Mozilla developer.mozilla.org some() backport. </summary>
if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisp, t[i], i, t))
        return true;
    }

    return false;
  };
}

/// <summary> Mozilla developer.mozilla.org filter() backport. </summary>
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

/// <summary> Mozilla developer.mozilla.org forEach() backport. </summary>
if ( !Array.prototype.forEach ) {

  Array.prototype.forEach = function( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( " this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

/// <summary> Mozilla developer.mozilla.org indexOf() backport. </summary>
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

