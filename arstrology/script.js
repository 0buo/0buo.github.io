const $root = $(document.documentElement);
const $document = $(document);
const $htmlAndBody = $("html, body");
const $window = $(window);

/***change pseudo prop */
var UID = {
	_current: 0,
  getNew: function(){ this._current++; return this._current; },
  _props: {},
  addProp: function(id, prop, value) {
    this._props[id] = {
      prop : prop,
      value: value
    };
  },
  isPropExist: function(prop, value) {
    for (const id in this._props) {
      if (this._props.hasOwnProperty(id)) {
        const element = this._props[id];
        if (element.prop == prop && element.value == value) {
          return id;
        }
      }
    }
    return false;
  }
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = 'pseudoStyles';
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
      _sheet.id = _sheetId;

  var regx = new RegExp('\\b' + 'pseudoStyle' + '.*?\\b', 'g');
  _this.className = _this.className.replace(regx, '');

  var currentID = UID.isPropExist(prop, value);
  if (currentID != false) {
    _this.className +=  ' ' + 'pseudoStyle' + currentID; 
  }
  else { 
    var newID = UID.getNew();
    UID.addProp(newID, prop, value);
    
    _this.className  += '  ' + 'pseudoStyle' + newID; 
    _sheet.innerHTML += ' .' + 'pseudoStyle' + newID + ':' + element + '{' + prop + ':' + value + '}';
    _head.appendChild(_sheet);
  }
  
  return this;
};

//vector class
/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
from https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
*/

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};
//vector class end
//other useful func
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const lerp = function (value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

function addEvent(obj, evt, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + evt, fn);
  }
}

/*******************************request time out***************************************** */
// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.requestTimeout = function(fn, delay) {
	if( !window.requestAnimationFrame      	&& 
		!window.webkitRequestAnimationFrame && 
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame      && 
		!window.msRequestAnimationFrame)
			return window.setTimeout(fn, delay);
			
	var start = new Date().getTime(),
		handle = new Object();
		
	function loop(){
		var current = new Date().getTime(),
			delta = current - start;
			
		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};
	
	handle.value = requestAnimFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
  if(handle === undefined){handle = {value: undefined};}
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
  window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
  window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
  window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
  window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
  window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
  clearTimeout(handle);
};

/****************************check tab or window out of focus******************************** */
var vis = (function(){
  var stateKey, 
      eventKey, 
      keys = {
              hidden: "visibilitychange",
              webkitHidden: "webkitvisibilitychange",
              mozHidden: "mozvisibilitychange",
              msHidden: "msvisibilitychange"
  };
  for (stateKey in keys) {
      if (stateKey in document) {
          eventKey = keys[stateKey];
          break;
      }
  }
  return function(c) {
      if (c) document.addEventListener(eventKey, c);
      return !document[stateKey];
  }
})();
// check if current tab is active or not
vis(function(){
  // if(vis()){                   
  // } 
  if(vis() == false) {
  // tab not focused
    lastNOWfollow = undefined;
    lastNOWslr1 = undefined;
    lastNOWslr2 = undefined;
    lastNOWslr3 = undefined;
    lastNOWincE = undefined;
    lastNOWincE2 = undefined;
    lastNOWdecE = undefined;
    lastNOWecA = undefined;

    lastNOWref = undefined;
    //cancelTwinkle(openingTextStart, openingTextEnd);
  }
});

var notIE = (document.documentMode === undefined),
    isChromium = window.chrome;
if (notIE && !isChromium) {
    // checks for Firefox and other  NON IE Chrome versions
    $window.on("focusout", function () {
      // blur
      lastNOWfollow = undefined;
      lastNOWslr1 = undefined;
      lastNOWslr2 = undefined;
      lastNOWslr3 = undefined;
      lastNOWincE = undefined;
      lastNOWincE2 = undefined;
      lastNOWdecE = undefined;
      lastNOWecA = undefined;

      lastNOWref = undefined;
    });
} 
else {
    // checks for IE and Chromium versions
    // bind blur event
    addEvent(window, "blur", function () {
      // blur
      lastNOWfollow = undefined;
      lastNOWslr1 = undefined;
      lastNOWslr2 = undefined;
      lastNOWslr3 = undefined;
      lastNOWincE = undefined;
      lastNOWincE2 = undefined;
      lastNOWdecE = undefined;
      lastNOWecA = undefined;

      lastNOWref = undefined;
    });
}

// function getWidth() {
//   return Math.max(
//     document.body.scrollWidth,
//     document.documentElement.scrollWidth,
//     document.body.offsetWidth,
//     document.documentElement.offsetWidth,
//     document.documentElement.clientWidth
//   );
// }

// function getHeight() {
//   return Math.max(
//     document.body.scrollHeight,
//     document.documentElement.scrollHeight,
//     document.body.offsetHeight,
//     document.documentElement.offsetHeight,
//     document.documentElement.clientHeight
//   );
// }

/*********************** on resize ************************ */
$(function(){
  let left = 0.15 * window.innerWidth;
  if (left > 150){left = 150;}
  timeContainer.style.setProperty("--timeContainerLeft", left + "px");
});
$window.resize(function(){
  maxDistToLightCenter =
    window.innerWidth >= window.innerHeight
    ? Math.pow(window.innerWidth * maxToLightDistIndex, 2)
    : Math.pow(window.innerHeight * maxToLightDistIndex, 2);

  screenMax = -1*window.innerWidth/2 + 0.75 * window.innerWidth;
  screenMin = -1*window.innerWidth/2 + 0.04 * window.innerWidth;

  let left = 0.15 * window.innerWidth;
  if (left > 150){left = 150;}
  timeContainer.style.setProperty("--timeContainerLeft", left + "px");
  });


/**************************************************************************** */
//spotlight funcs
let lightV;
const lightMass = 15;//15, 50
const shadeMass = 1; //5, 1
const G = 2; //0.2, 10
let velocity = new Vector(0, 0);
let acceleration = new Vector(0, 0);
//let accModifier = 1;
let shadeX = 0;
let shadeY = 0;
let shadeV = new Vector(shadeX, shadeY);
//let canChangeAlpha = 0;
//let eclipseSpeed = 0.125;

//variables for function update
let mouseX = 0.5 * window.innerWidth,
    mouseY = 1.5 * window.innerHeight;
let LdestX = 0.5*window.innerWidth,
    LdestY = 2*window.innerHeight;

let maxToLightDistIndex = 0.9;
let maxDistToLightCenter =
  window.innerWidth >= window.innerHeight
    ? Math.pow(window.innerWidth * maxToLightDistIndex, 2)
    : Math.pow(window.innerHeight * maxToLightDistIndex, 2);
//let alphaBias = 0.2;
let randNum = 0;


let cursorLerpX = 0.9;
let cursorLerpY = 0.35;

let finishLerpCursorLerpX = false;
let finishLerpCursorLerpY = false;

let lastNOWfollow;
function followCursor(timestamp) {
  cancelAnimationFrame(IDfollowCursor);
  IDfollowCursor = requestAnimationFrame(followCursor);

  if(lastNOWfollow === undefined){
    lastNOWfollow = timestamp;
  }
  NOWfollow = timestamp;
  let dt = (NOWfollow - lastNOWfollow)/1000;
  lastNOWfollow = NOWfollow;

  //draw code
  if(start == false){
    if(Math.abs(cursorLerpX - 0.2) >= 0.0005){cursorLerpX = lerp(cursorLerpX, 0.2, 1-Math.pow(0.85, dt));}
    else{cursorLerpX = 0.2;}
    if(Math.abs(cursorLerpY - 0.2) >= 0.0005){cursorLerpY = lerp(cursorLerpY, 0.2, 1-Math.pow(0.85, dt));}
    else{cursorLerpY = 0.2;}
    LdestX = lerp(LdestX, mouseX, 1-Math.pow(cursorLerpX, dt)); 
  }
  LdestY = lerp(LdestY, mouseY, 1-Math.pow(cursorLerpY, dt)); 
  document.documentElement.style.setProperty("--cursorY", LdestY + "px");
  document.documentElement.style.setProperty("--cursorX", LdestX + "px");
  

  lightV = new Vector(LdestX, LdestY); //lightV is the attracting gravity
  acceleration.multiply(0);
  shadeX = shadeV.x;
  shadeY = shadeV.y;

  if (mouseState != 1) {
    let force = Vector.subtract(lightV, shadeV); //get direction
    let d = force.length(); //get distance between the 2
    //constrain d
    if (d > 25) {
      d = 25;
    } else if (d < 10) {
      d = 10;
    }
    force.normalize(); //distance doesn't matter here, we just want this vector for direction
    let strength = (G * lightMass * shadeMass) / (d * d);
    force.multiply(strength);
    force.multiply(dt);

    //apply force
    let f = Vector.divide(force, shadeMass);
    acceleration.add(f);
    velocity.add(acceleration);
    shadeV.add(velocity);

    //change alpha and acc modifier
    let distanceToLightCenter =
      Math.pow(shadeX - LdestX, 2) + Math.pow(shadeY - LdestY, 2);

    //let aBias = Math.pow(document.body.clientWidth * alphaBias, 2);
    let d2 = distanceToLightCenter; //+ aBias;
    //if (d2 > maxDistToLightCenter) {d2 = maxDistToLightCenter;}

    let A1 = scale(d2, 10000, maxDistToLightCenter, 0.04, 0.98);
    let A2 = scale(d2, 10000, maxDistToLightCenter, 0.14, 1);
    //eclipseA1 = lerp(eclipseA1, A1, 0.4);
    //eclipseA2 = lerp(eclipseA2, A2, 0.4);
    eclipseA1 = 1 - A1;
    eclipseA2 = 1 - A2;

    document.documentElement.style.setProperty("--eclipseA1", eclipseA1);
    document.documentElement.style.setProperty("--eclipseA2", eclipseA2);
    //fadeInEcA1 = eclipseA1;
    //fadeInEcA2 = eclipseA2;
  } 
  else if (mouseState == 1 && eclipseR <= 0 && (nameInputSubmitted == 1 || timeInputSubmitted)) {
    if(nameInputSubmitted == 1){
      randNum = Math.random() * (2.4 - 1.4) + 1.4;
      maxToLightDistIndex = 0.9;
      maxDistToLightCenter =
        window.innerWidth >= window.innerHeight
        ? Math.pow(window.innerWidth * maxToLightDistIndex, 2)
        : Math.pow(window.innerHeight * maxToLightDistIndex, 2);
    }
    else if(timeInputSubmitted){
      randNum = Math.random() * (1.7 - 0.7) + 0.7;
      maxToLightDistIndex = 0.5;
      maxDistToLightCenter =
        window.innerWidth >= window.innerHeight
        ? Math.pow(window.innerWidth * maxToLightDistIndex, 2)
        : Math.pow(window.innerHeight * maxToLightDistIndex, 2);
    }
    let randSign = Math.random() * (0.1 + 0.1) - 0.1;
    randNum = randSign > 0 ? randNum : -1 * randNum;
    shadeV = new Vector(
      mouseX + document.body.clientWidth * randNum,
      mouseY + document.body.clientHeight * randNum
    );
  }
  document.documentElement.style.setProperty("--eclipseX", shadeX + "px");
  document.documentElement.style.setProperty("--eclipseY", shadeY + "px");
}


//let followInterv = 0;

let IDfollowCursor;
let mouseFollowing = true;
let limitedCursor = false;

let NOWfollow;
function update(e) {
  if(mouseFollowing){
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(limitedCursor){
      if(mouseX < 0.45*window.innerWidth){mouseX = 0.45*window.innerWidth;}
      else if(mouseX > 0.55*window.innerWidth){mouseX = 0.55*window.innerWidth;}
      if(mouseY < 0.4*window.innerHeight){mouseY = 0.4*window.innerHeight;}
      else if(mouseY > 0.6*window.innerHeight){mouseY = 0.6*window.innerHeight;}
    }
  }
  //clearInterval(followInterv);
  //followInterv = setInterval(followCursor, 1000 / frameRate, mouseX, mouseY);
  cancelAnimationFrame(IDfollowCursor);
  IDfollowCursor = requestAnimationFrame(followCursor);
}

//let mouseStateUpdated = 0;
let NOWslr1, lastNOWslr1;
function SLR1(timestamp) {
  cancelAnimationFrame(IDSLR);
  IDSLR = requestAnimationFrame(SLR1);

  if(lastNOWslr1 === undefined){
    lastNOWslr1 = timestamp;
  }
  NOWslr1 = timestamp;
  let dt = (NOWslr1 - lastNOWslr1)/1000;
  lastNOWslr1 = NOWslr1;
  lastNOWslr2 = timestamp;
  lastNOWslr3 = timestamp;

  if (spotLightRadius < 39) {
    //canChange = 0;
    spotLightRadius += 3.788 * dt; //0.125
    if (spotLightRadius > 39) {
      spotLightRadius = 39;
    }
  } 
  else if(spotLightRadius > 39){
    //canChange = 0;
    spotLightRadius -= 3.788 * dt;
    if (spotLightRadius < 39) {
      spotLightRadius = 39;
    }
  }
  // else {
  //   canChange = 1;
  //   //mouseStateUpdated = 0;
  // }
  
  document.documentElement.style.setProperty("--radius", spotLightRadius + "vmax");
}

let NOWslr2, lastNOWslr2;
function SLR2(timestamp) {
  cancelAnimationFrame(IDSLR);
  IDSLR = requestAnimationFrame(SLR2);

  if(lastNOWslr2 === undefined){
    lastNOWslr2 = timestamp;
  }
  NOWslr2 = timestamp;
  let dt = (NOWslr2 - lastNOWslr2)/1000;
  lastNOWslr2 = NOWslr2;
  lastNOWslr1 = timestamp;
  lastNOWslr3 = timestamp;

  if (spotLightRadius < 47) {
    //canChange = 0;
    spotLightRadius += 3.788 * dt;
    if (spotLightRadius > 47) {
      spotLightRadius = 47;
    }
  }
  else if(spotLightRadius > 47){
    //canChange = 0;
    spotLightRadius -= 3.788 * dt;
    if (spotLightRadius < 47) {
      spotLightRadius = 47;
    }
  } 
  // else {
  //   canChange = 1;
  //   //mouseStateUpdated = 0;
  // }
  document.documentElement.style.setProperty("--radius", spotLightRadius + "vmax");
}

let NOWslr3, lastNOWslr3;
function SLR3(timestamp) {
  cancelAnimationFrame(IDSLR);
  IDSLR = requestAnimationFrame(SLR3);

  if(lastNOWslr3 === undefined){
    lastNOWslr3 = timestamp;
  }
  NOWslr3 = timestamp;
  let dt = (NOWslr3 - lastNOWslr3)/1000;
  lastNOWslr3 = NOWslr3;
  lastNOWslr2 = timestamp;
  lastNOWslr1 = timestamp;

  if (spotLightRadius > 31) {
    //canChange = 0;
    spotLightRadius -= 3.788 * dt;
    if (spotLightRadius < 31) {
      spotLightRadius = 31;
    }
  } 
  else if(spotLightRadius < 31){
    //canChange = 0;
    spotLightRadius += 3.788 * dt;
    if (spotLightRadius > 31) {
      spotLightRadius = 31;
    }
  }
  // else {
  //   canChange = 1;
  //   //mouseStateUpdated = 0;
  // }
  
  document.documentElement.style.setProperty("--radius", spotLightRadius + "vmax");
}

let NOWincE, lastNOWincE;
function incEclipseR(timestamp) {
  cancelAnimationFrame(IDECR);
  IDECR = requestAnimationFrame(incEclipseR);

  if(lastNOWincE === undefined){
    lastNOWincE = timestamp;
  }
  NOWincE = timestamp;
  let dt = (NOWincE - lastNOWincE)/1000;
  lastNOWincE = NOWincE;
  lastNOWincE2 = timestamp;
  lastNOWdecE = timestamp;
  lastNOWecA = timestamp;

  if (eclipseR < 32.5) {
    //canChangeEclipse = 0;
    eclipseR += 2.4 * dt; //0.08

    if (eclipseR > 32.5) {
      eclipseR = 32.5;
    }
  }
  else if(eclipseR > 32.5){
    eclipseR -= 2.4 * dt;

    if (eclipseR < 32.5) {
      eclipseR = 32.5;
    }
  }
  // else {
  //   canChangeEclipse = 1;
  // }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

let NOWincE2, lastNOWincE2;
function incEclipseR2(timestamp) {
  cancelAnimationFrame(IDECR);
  IDECR = requestAnimationFrame(incEclipseR2);

  if(lastNOWincE2 === undefined){
    lastNOWincE2 = timestamp;
  }
  NOWincE2 = timestamp;
  let dt = (NOWincE2 - lastNOWincE2)/1000;
  lastNOWincE2 = NOWincE2;
  lastNOWincE = timestamp;
  lastNOWdecE = timestamp;
  lastNOWecA = timestamp;

  if (eclipseR < 48.5) {
    //canChangeEclipse = 0;
    eclipseR += 1.82 * dt; //0.06
  } 
  // else {
  //   canChangeEclipse = 1;
  // }
  if (eclipseR > 48.5) {
    eclipseR = 48.5;
  }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

let NOWdecE, lastNOWdecE;
function decEclipseR(timestamp) {
  cancelAnimationFrame(IDECR);
  IDECR = requestAnimationFrame(decEclipseR);
  
  if(lastNOWdecE === undefined){
    lastNOWdecE = timestamp;
  }
  NOWdecE = timestamp;
  let dt = (NOWdecE - lastNOWdecE)/1000;
  lastNOWdecE = NOWdecE;
  lastNOWincE = timestamp;
  lastNOWincE2 = timestamp;

  if (eclipseR > 0) {
    //canChangeEclipse = 0;
    eclipseR -= 7.5 * dt; //0.25
    if (eclipseR < 0) {
      eclipseR = 0;
    }
  } 
  // else {
  //   canChangeEclipse = 1;
  // }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

let NOWecA, lastNOWecA;
function eclipseFadeout(timestamp) {
  cancelAnimationFrame(IDECA);
  IDECA = requestAnimationFrame(eclipseFadeout);

  if(lastNOWecA === undefined){
    lastNOWecA = timestamp;
  }
  NOWecA = timestamp;
  let dt = (NOWecA - lastNOWecA)/1000;
  lastNOWecA = NOWecA;

  if (eclipseA1 > 0.1 || eclipseA2 > 0.06) {
    //canChangeAlpha = 0;
    if (eclipseA1 > 0.02) {
      eclipseA1 -= 0.85 * dt; //0.03125
    } else if (eclipseA1 < 0.02) {
      eclipseA1 = 0.02;
    }
    if (eclipseA2 > 0.01) {
      eclipseA2 -= 0.85 * dt;
    } else if (eclipseA2 < 0.01) {
      eclipseA2 = 0.01;
    }
  }

  if (eclipseA1 < 0.02) {
    eclipseA1 = 0.02;
  }
  if (eclipseA2 < 0.01) {
    eclipseA2 = 0.01;
  }
  document.documentElement.style.setProperty("--eclipseA1", eclipseA1);
  document.documentElement.style.setProperty("--eclipseA2", eclipseA2);
}

let IDSLR,
    IDECA,
    IDECR;
function updateR() {
  cancelAnimationFrame(IDSLR);
  cancelAnimationFrame(IDECA);
  cancelAnimationFrame(IDECR);
  if (mouseState == 1) {
    velocity.multiply(0); //reset eclipse velocity

    IDSLR = requestAnimationFrame(SLR1);
    IDECA = requestAnimationFrame(eclipseFadeout);
    IDECR = requestAnimationFrame(decEclipseR);
  } 
  else if (mouseState == 2) {
    IDSLR = requestAnimationFrame(SLR3);
    IDECR = requestAnimationFrame(incEclipseR);
  } 
  else if (mouseState == 0) {
    IDSLR = requestAnimationFrame(SLR2);
    IDECR = requestAnimationFrame(incEclipseR2);
  }
}

/*******************************setting scroll***********************************/
let scrollinstance;
let $scrollContainer = $("#scrollContainer");
//let scrollContainer = document.getElementById("scrollContainer");
$(function() {
  scrollinstance = $("#scrollContainer").overlayScrollbars({
    className : "os-theme-round-dark body-scroll-bar",
    paddingAbsolute : true,
    overflowBehavior : {
      x : "scroll",
      y : "scroll"
    },
    scrollbars : {
      visibility: "hidden",
      autoHide: "scroll",
      autoHideDelay: 800
    },
    callbacks : {
      onScroll: adjustBodyRotateOrigin
    }
  }).overlayScrollbars();
});

/*****************************filter setting*************************** */
let setting = false;
let $settingClass = $(".setting");
let $settingText = $(".settingText");
let $smallerST = $("#smallerST");

let $settingButton = $(".settingButton");
let $filterOn = $("#filterOn");
let $filterOff = $("#filterOff");
let $filterOnText = $("#filterOnText");
let $filterOffText = $("#filterOffText");

let settingDOM = document.getElementsByClassName("setting")[0];
let settingFontSize = 59;
let settingFontOpacity = 0;
let buttonFontSize = 55;

$document.ready(()=>{
  if(!can_answer){
    $settingText.html(today_aphorism);
    $settingButton.css(`display`, `none`);
  }
})

//adjust font on window size
function adjustSettingFont(event){
  if(setting == false){
    let modifiedBlur;
    let modifiedButtonFontSize;

    if(window.innerHeight < 1000){settingFontSize = Math.round(window.innerWidth * 0.024);}
    else{settingFontSize = Math.round(window.innerWidth * 0.025);}
    if(settingFontSize < 35){settingFontSize = 35;}
    else if(settingFontSize > 50){settingFontSize = 50;}
    settingDOM.style.setProperty("--settingFontSize", settingFontSize + "px");
    let smaller = Math.round(settingFontSize*0.75)
    settingDOM.style.setProperty("--smallerSettingFontSize", smaller + "px");
    
    if(window.innerWidth < 1960 && window.innerWidth > 1700){
      settingFontOpacity = 0.75 + ((1960 - window.innerWidth)/200) * 0.1;
      settingFontOpacity.toFixed(2);
    }
    else if(window.innerWidth < 1700){
      settingFontOpacity = 0.75 + ((1960 - window.innerWidth)/200) * 0.1;
      settingFontOpacity.toFixed(2);
    }
    else{
      settingFontOpacity = 0.75;
    }
    if(settingFontOpacity > 1){settingFontOpacity = 1;}
    else if(settingFontOpacity < 0.75){settingFontOpacity = 0.75;}

    if(window.innerWidth < 800 && window.innerWidth >= 700){
      buttonFontSize = 50; 
      modifiedButtonFontSize = buttonFontSize; 
      //scrollinstance.options("overflowBehavior.x", "h");
    }
    else if(window.innerWidth < 700 && window.innerWidth >= 540){
      buttonFontSize = 45; 
      modifiedButtonFontSize = buttonFontSize; 
      //scrollinstance.options("overflowBehavior.x", "s");
    }
    else if(window.innerWidth < 540 && window.innerWidth >= 470){
      buttonFontSize = 40; 
      modifiedButtonFontSize = buttonFontSize; 
      //scrollinstance.options("overflowBehavior.x", "s");
    }
    else if(window.innerWidth < 470 && window.innerWidth >= 400){
      buttonFontSize = 34; 
      modifiedButtonFontSize = buttonFontSize; 
      //scrollinstance.options("overflowBehavior.x", "s");
    }
    else if(window.innerWidth < 400){
      buttonFontSize = 28; 
      modifiedButtonFontSize = buttonFontSize; 
      //scrollinstance.options("overflowBehavior.x", "s");
    }
    else{
      //scrollinstance.options("overflowBehavior.x", "h");
    }

    if(window.innerHeight < 600){
      if(window.innerWidth < 700){buttonFontSize = Math.round(window.innerHeight * 0.1);}
      if(modifiedButtonFontSize < buttonFontSize){buttonFontSize = modifiedButtonFontSize;}
    }

    if(window.innerHeight >= 600 && window.innerWidth >= 1024){buttonFontSize = 55;}
    

    $settingText.css("opacity", settingFontOpacity);
    $settingButton.css("font-size", buttonFontSize + "px");
  }
  else{$(this).off(event);}
}

//events
$document.ready(adjustSettingFont);
$window.resize(adjustSettingFont);

//hover button
let settingButtonCanClick = false;
$settingButton.one("mouseover", settingButtonUnfold);

function settingButtonUnfold(){
  requestTimeout(function(){
    if(setting == false){
      $filterOnText.html('yy<br class="default-font">yy<br class="default-font">yy');
      requestTimeout(function(){
        $filterOnText.html('ya<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 120);
      requestTimeout(function(){
        $filterOnText.html('yep<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 240);
      requestTimeout(function(){
        $filterOnText.html('yeah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 360);
      requestTimeout(function(){
        $filterOnText.html('yeaa<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 480);
      requestTimeout(function(){
        $filterOnText.html('yeaah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 600);
      requestTimeout(function(){
        $filterOnText.html('yeah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 720);    
      requestTimeout(function(){
        $filterOnText.html('yea<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 840);      
      requestTimeout(function(){
        $filterOnText.html('yup<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 960);    
      requestTimeout(function(){
        $filterOnText.html('yep<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 1080);
      requestTimeout(function(){
        $filterOnText.html('yes<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
      }, 1200);      

      
      $filterOffText.html('nn<br class="default-font">nn<br class="default-font">nn');
      requestTimeout(function(){
        $filterOffText.html('na<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 120);    
      requestTimeout(function(){
        $filterOffText.html('nay<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 240);    
      requestTimeout(function(){
        $filterOffText.html('nope<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 360);    
      requestTimeout(function(){
        $filterOffText.html('nopee<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 480);    
      requestTimeout(function(){
        $filterOffText.html('nahh<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 600);    
      requestTimeout(function(){
        $filterOffText.html('nah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 720);    
      requestTimeout(function(){
        $filterOffText.html('meh<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 840);    
      requestTimeout(function(){
        $filterOffText.html('not<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 960);    
      requestTimeout(function(){
        $filterOffText.html('na<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
      }, 1080);     
      requestTimeout(function(){
        $filterOffText.html('n o<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
        settingButtonCanClick = true;
        $filterOn.css("cursor", "grab");
        $filterOff.css("cursor", "grab");
      }, 1250);    
    } 
  }, 500);
}

function settingButtonFold(){
  $filterOnText.html('yes<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  requestTimeout(function(){
    $filterOnText.html('yeah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 150);
  requestTimeout(function(){
    $filterOnText.html('yeaa<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 300);
  requestTimeout(function(){
    $filterOnText.html('yeaah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 450);
  requestTimeout(function(){
    $filterOnText.html('yepp<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 600);
  requestTimeout(function(){
    $filterOnText.html('yup<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 750);
  requestTimeout(function(){
    $filterOnText.html('yay<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 900);
  requestTimeout(function(){
    $filterOnText.html('ya<br class="default-font"><span class="letterToL">!</span><span class="letterToR">i</span><br class="default-font"><span class="letterToL">d</span><span class="letterToR">o</span>');
  }, 1050);
  requestTimeout(function(){
    $filterOnText.html('yy<br class="default-font"><span class="letterToL">y</span><span class="letterToR">y</span><br class="default-font"><span class="letterToL">y</span><span class="letterToR">y</span>');
  }, 1200);

  $filterOffText.html('n o<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  requestTimeout(function(){
    $filterOffText.html('nah<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 150);    
  requestTimeout(function(){
    $filterOffText.html('nope<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 300);
  requestTimeout(function(){
    $filterOffText.html('nayy<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 450);
  requestTimeout(function(){
    $filterOffText.html('nopee<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 600);
  requestTimeout(function(){
    $filterOffText.html('nay<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 750);
  requestTimeout(function(){
    $filterOffText.html('not<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 900);
  requestTimeout(function(){
    $filterOffText.html('no<br class="default-font"><span class="letterToL">!</span><span class="letterToR">t</span><br class="default-font"><span class="letterToL">h</span><span class="letterToR">x</span>');
  }, 1050);
  requestTimeout(function(){
    $filterOffText.html('nn<br class="default-font"><span class="letterToL">n</span><span class="letterToR">n</span><br class="default-font"><span class="letterToL">n</span><span class="letterToR">n</span>');
  }, 1200);    
}

let $filtered = $(".filtered");
let cloudOn = false;
//click button
$filterOn.on("click", function(){
  if(setting == false && settingButtonCanClick){
    settingButtonCanClick = false;
    setting = true;
    if(!isFirefox) cloudOn = true;
    settingButtonFold();
    $settingText.css("opacity", "0");
    $settingButton.css("filter", "blur(6px)");
    $settingButton.css("opacity", "0");

    requestTimeout(function(){
      $filtered.css("display", "initial");
      if(!isFirefox) $filtered.addClass("svgFilter");

      requestTimeout(function(){
        document.documentElement.pseudoStyle('before', 'z-index','3');
        $settingClass.css("opacity", "0");
      }, 1100);
      requestTimeout(function(){
        $scrollContainer.css("background", "var(--reflectionBG)");
        $bodyRotate.css("display", "initial");
      }, 1800);
      requestTimeout(function(){
        $settingClass.css("display", "none");
        $settingClass.children().prop("disabled", true);
      }, 2500);
      
      /*setting for heavy filter*/
      if(!isFirefox){
        filterState = 2;
        $filterSwitchButton.removeClass("light");
        $filterSwitchButton.addClass("heavy");
        $filterSwitchText.text("heavy filter");
      }
      else if(isFirefox){
        filterState = 0
        cloudRequestAnimBool = false;
        cancelCloudRequestAnim();

        $filterSwitchButton.removeClass("light");
        $filterSwitchButton.removeClass("heavy");
        $filterSwitchText.text("no filter");

        $filtered.removeClass("svgFilter");
        $filtered.removeClass("offFilter");

        twinkleBrighterOpa = 1;
        twinkleBrightDimOpa = 0.9;
        defaultTwinklwOpa1 = 0.5;
        defaultTwinklwOpa2 = 0.65;
        defaultTwinklwOpa3 = 0.75;
        if(twinkleOpaState == 1){twinkleOpa = defaultTwinklwOpa1;}
        else if(twinkleOpaState == 2){twinkleOpa = defaultTwinklwOpa2;}
        else if(twinkleOpaState == 3){twinkleOpa = defaultTwinklwOpa3;}
        $(".plaintext").css("font-weight", "1000");
      }
  
      $filterOn.off();
      $filterOff.off();
    }, 500);
  }
});
$filterOn.mousedown(function(){
  if(settingButtonCanClick){$filterOn.css("cursor", "grabbing");}
});
$filterOn.mouseover(function(){
  if(settingButtonCanClick){$filterOn.css("cursor", "grab");}
});


$filterOff.on("click", function(){
  if(setting == false && settingButtonCanClick){
    settingButtonCanClick = false;
    // setting = true;
    // cloudOn = true;
    settingButtonFold();
    //$settingText.css("opacity", "0");
  
    //~~~~~~~
    cloudRequestAnimBool = false;
    delete_setting_text();
    requestTimeout(()=>{
      $settingButton.css("filter", "blur(6px)");
      $settingButton.css("opacity", "0");
    }, 1500);

    // requestTimeout(function(){
    //   $filtered.css("display", "initial");
    //   $filtered.addClass("offFilter");
  
    //   requestTimeout(function(){
    //     document.documentElement.pseudoStyle('before', 'z-index','3');
    //     $settingClass.css("opacity", "0");
    //   }, 1100);
    //   requestTimeout(function(){
    //     $scrollContainer.css("background", "var(--reflectionBG)");
    //     $bodyRotate.css("display", "initial");
    //   }, 1800);
    //   requestTimeout(function(){
    //     $settingClass.css("display", "none");
    //     $settingClass.children().prop("disabled", true);
    //   }, 2500);
  
    //   /*setting for light filter*/
    //   $filterSwitchButton.removeClass("heavy");
    //   $filterSwitchButton.addClass("light");
    //   $filterSwitchText.text("light filter");
    //   filterState = 1;
    //   twinkleBrighterOpa = 1;
    //   twinkleBrightDimOpa = 0.65;
    //   defaultTwinklwOpa1 = 0.29;
    //   defaultTwinklwOpa2 = 0.35;
    //   defaultTwinklwOpa3 = 0.4;
    //   twinkleOpa = defaultTwinklwOpa1;
  
    //   $filterOn.off();
    //   $filterOff.off();
    // }, 500);
    
  }
});
$filterOff.mousedown(function(){
  if(settingButtonCanClick){$filterOff.css("cursor", "grabbing");} 
});
$filterOff.mouseover(function(){
  if(settingButtonCanClick){$filterOff.css("cursor", "grab");}
});

/*****************************Aphorism************************************* */
function generate_wbw_deletion(cur_text){
  let cur_text_arr = cur_text.split(' ');
  let output = [];
  while (cur_text_arr.length != 0){
    let popped = cur_text_arr.pop();
    if (popped.includes(`>`)){
      let p = cur_text_arr.pop();
      while (!p.includes(`<`)){
        p = cur_text_arr.pop();
      }
      p = cur_text_arr.pop();
    }

    while (cur_text_arr.length > 0 && cur_text_arr[cur_text_arr.length-1] == ' '){
      cur_text_arr.pop();
    }
    
    let toPush = cur_text_arr.join(' ');
    if(toPush.replace(/[\s\n\r\f\t\v]/g, '').length){output.push(toPush);}
  }
  output.push(``);
  return output;
}

function generate_wbw_typing(target_text){
  let target_text_arr = target_text.split(' ');
  let output = [];
  while (target_text_arr.length != 0){
    output.unshift(target_text_arr.join(' '));
    let popped = target_text_arr.pop();

    if (popped.includes(`>`) && !popped.includes(`<`)){
      let p = target_text_arr.pop();
      while (!p.includes(`<`)){
        p = target_text_arr.pop();
      }
      p = target_text_arr.pop();
    }
  }
  //console.log(output);
  return output;
}

function delete_setting_text(){
  let text_arr = generate_wbw_deletion($settingText.html());
  text_arr.forEach((text, index)=>{
    requestTimeout(()=>{
      $settingText.html(text);
    }, index * 120);
    if(index == text_arr.length -1){
      requestTimeout(type_out_aphorism, index*150 + 800);
    }
  });
}

function type_out_aphorism(){
  let text_arr = generate_wbw_typing(today_aphorism);
  text_arr.forEach((text, index)=>{
    requestTimeout(()=>{
      $settingText.html(text);
      if(index == text_arr.length-1){
        $settingText.children('.cited').removeClass('cited').addClass('citation');
      }
    }, index * 200);
  });
}

/**********************************filter switch*************************** */
let $filterSwitch = $(".filterSwitch");
let $filterSwitchText = $(".filterSwitchText");
let $filterSwitchButton = $(".filterButton");
let $filterSwitchIntro = $(`.filter-switch-intro`);
let duringFilterIntro = false;
let filterState = 0;

$filterSwitch.mouseover(function(){
  if(!duringFilterIntro){
    $filterSwitchText.css("opacity", "1");
  }
});
$filterSwitch.mouseleave(function(){
  $filterSwitchText.css("opacity", "0");
});

$settingButton.on("click", function(){
  if(setting){
    duringFilterIntro = true;
    $filterSwitchText.css("opacity", "0");
    requestTimeout(function(){
      $filterSwitchIntro.css(`opacity`, `1`);
      requestTimeout(function(){
        $filterSwitchIntro.css(`opacity`, `0`);
        duringFilterIntro = false;
      }, 10000);
    }, 200);
  }
});

$filterSwitchButton.click(function(){
  if(!start){
    filterState = (filterState + 1) % 3;
    if(filterState == 0){
      cloudRequestAnimBool = false;
      cancelCloudRequestAnim();

      $filterSwitchButton.removeClass("light");
      $filterSwitchButton.removeClass("heavy");
      $filterSwitchText.text("no filter");

      $filtered.removeClass("svgFilter");
      $filtered.removeClass("offFilter");

      twinkleBrighterOpa = 1;
      twinkleBrightDimOpa = 0.9;
      defaultTwinklwOpa1 = 0.5;
      defaultTwinklwOpa2 = 0.65;
      defaultTwinklwOpa3 = 0.75;
      if(twinkleOpaState == 1){twinkleOpa = defaultTwinklwOpa1;}
      else if(twinkleOpaState == 2){twinkleOpa = defaultTwinklwOpa2;}
      else if(twinkleOpaState == 3){twinkleOpa = defaultTwinklwOpa3;}
      $(".plaintext").css("font-weight", "1000");
    }
    else if(filterState == 1){
      cloudRequestAnimBool = false;
      cancelCloudRequestAnim();

      $filterSwitchButton.removeClass("heavy");
      $filterSwitchButton.addClass("light");
      $filterSwitchText.text("light filter");

      $filtered.removeClass("svgFilter");
      $filtered.addClass("offFilter");
      twinkleBrighterOpa = 1;
      twinkleBrightDimOpa = 0.65;
      defaultTwinklwOpa1 = 0.29;
      defaultTwinklwOpa2 = 0.35;
      defaultTwinklwOpa3 = 0.4;
      if(twinkleOpaState == 1){twinkleOpa = defaultTwinklwOpa1;}
      else if(twinkleOpaState == 2){twinkleOpa = defaultTwinklwOpa2;}
      else if(twinkleOpaState == 3){twinkleOpa = defaultTwinklwOpa3;}
      $(".plaintext").css("font-weight", "600");
    }
    else{
      cloudRequestAnimBool = true;
      restartCloudRequestAnim();

      $filterSwitchButton.removeClass("light");
      $filterSwitchButton.addClass("heavy");
      $filterSwitchText.text("heavy filter");

      $filtered.removeClass("offFilter");
      $filtered.addClass("svgFilter");
      twinkleBrighterOpa = 0.75;
      twinkleBrightDimOpa = 0.55;
      defaultTwinklwOpa1 = 0.27;
      defaultTwinklwOpa2 = 0.32;
      defaultTwinklwOpa3 = 0.4;
      if(twinkleOpaState == 1){twinkleOpa = defaultTwinklwOpa1;}
      else if(twinkleOpaState == 2){twinkleOpa = defaultTwinklwOpa2;}
      else if(twinkleOpaState == 3){twinkleOpa = defaultTwinklwOpa3;}
      $(".plaintext").css("font-weight", "600");
    }
  }
});

$filterSwitchButton.mousedown(function(){
  if(!start){$filterSwitchButton.css("cursor", "grabbing");}
});
$filterSwitchButton.mouseup(function(){
  if(!start){$filterSwitchButton.css("cursor", "grab");}
});

/******************************* scrollBar *****************************/
$settingButton.on("click", function(){
  if(setting){
    scrollinstance.scroll({x:0, y:0}, 1000, "easeInOutSine");
    scrollinstance.options("overflowBehavior.x", "hidden");
    scrollinstance.options("overflowBehavior.y", "hidden");
    scrollinstance.options("scrollbars.visibility", "auto");
  }
});

//adjust body rotate transform origin when scrolling
function adjustBodyRotateOrigin(){
  let originY = 100 * (0.5 * window.innerHeight + scrollinstance.scroll().position.y) / $bodyRotate.outerHeight();
  $bodyRotate.css("transform-origin", "50% " + originY + "% " + "0");
}

$(() => {window.addEventListener(`mousemove`, adjustBodyRotateOrigin, true);});
// let IDscrollRAF;
// $document.scroll(function(){
//   adjustBodyRotateOrigin();

// })

/******************************spotlight*********************************/
let mouseState = 1;
//let frameRate = 75;
//let canChange = 1;
//let canChangeEclipse = 1;

let spotLightRadius = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--radius"),
  10
);
let eclipseR = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseR"),
  10
);
let eclipseA1 = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseA1"),
  10
);
let eclipseA2 = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseA2"),
  10
);
let fadeInEcA1 = eclipseA1;
let fadeInEcA2 = eclipseA2;
//let interv = 0;
//let eclipseInterv = 0;
//let eclipseFadeInterv = 0;

function startAnim(){
  if(start){
    $filterSwitchButton.css("cursor", "wait");
    requestTimeout(function(){
      mouseY = 0.2 * window.innerHeight;
      cancelAnimationFrame(IDfollowCursor);
      IDfollowCursor = requestAnimationFrame(followCursor);
    }, 4500);
    requestTimeout(function(){
      start = false;
      cursorLerpY = 0.9;

      window.addEventListener("mousemove", update, true);
      scrollinstance.options("overflowBehavior.x", "s");
      scrollinstance.options("overflowBehavior.y", "s");
      $filterSwitchButton.css("cursor", "grab");
      $filterSwitchText.css("color", "black");
    }, 9000);
  }
}
function darknessStartAnim(){
  let curDarkness = darkness;
  $("#darkness").velocity("stop").velocity({
    tween: [0.94, curDarkness]
  },{ 
      duration: 12000,
      easing: "easeInOutQuad",
      progress: function(_, _, _, tweenValue){
        darkness = tweenValue;
        document.documentElement.style.setProperty("--darkness", darkness);
    }
  });
}

let start = true;
let darkness = 1;
$settingButton.on("click", function(){
  if(setting){
    requestTimeout(function(){
      mouseX = 0.5 * window.innerWidth;
      mouseY = 1.5 * window.innerHeight;
      LdestX = mouseX;
      LdestY = mouseY;
      IDfollowCursor = requestAnimationFrame(followCursor);
      startAnim();
      darknessStartAnim();
      updateR();
      IDreflection = requestAnimationFrame(BGreflection);
    }, 250);
  }
});

/********************spotlight change******************* */
let SLCtimer;
let sunsetStart = false;
let backtoSpotLight = false;
let nightStart = false;
let LR1 = {elem: $("#R1"), val: 0, ID: undefined},
    LG1 = {elem: $("#G1"), val: 0, ID: undefined},
    LB1 = {elem: $("#B1"), val: 0, ID: undefined},
    LR2 = {elem: $("#R2"), val: 0, ID: undefined},
    LG2 = {elem: $("#G2"), val: 0, ID: undefined},
    LB2 = {elem: $("#B2"), val: 0, ID: undefined},
    LA037 = {elem: $("#A037"), val: 0.37, ID: undefined};
let sunsetR1 = 112, //61
    sunsetG1 = 47, //34
    sunsetB1 = 35, //35
    sunsetR2= 76,
    sunsetG2 = 17,
    sunsetB2 = 6,
    sunsetA037 = 0.65;

let nightR1 = 34,
    nightG1 = 34,
    nightB1 = 52,
    nightR2= 23,
    nightG2 = 30,
    nightB2 = 48,
    nightA037 = 0.65;

function cancelSLCid(){
  cancelAnimationFrame(LR1.ID);
  cancelAnimationFrame(LR2.ID);
  cancelAnimationFrame(LG1.ID);
  cancelAnimationFrame(LG2.ID);
  cancelAnimationFrame(LB1.ID);
  cancelAnimationFrame(LB2.ID);
  cancelAnimationFrame(LA037.ID);
}

function sunsetColor(src, dst, varString, time=8000){
  if(src.val == dst){ return; }
  let curColor = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curColor] }, {
    duration: time,
    easing: [0.34, 1.56, 0.64, 1], 
    progress: function(_, _, _, tweenValue) {
      if(backtoSpotLight){src.elem.velocity("stop", true); return;}
      if(nightStart){src.elem.velocity("stop", true); return;}
      src.val = Math.round(tweenValue);
      if(src.val > 255){src.val = 255;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){ 
      cancelAnimationFrame(src.ID);
    }
  });
}
function sunsetAlpha(src, dst, varString, time=5000){
  if(src.val == dst){ return; }
  let curAlpha = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curAlpha] }, {
    duration: time,
    easing: [0.68, -0.6, 0.32, 1.6], 
    progress: function(_, _, _, tweenValue) {
      if(backtoSpotLight){src.elem.velocity("stop", true); return;}
      if(nightStart){src.elem.velocity("stop", true); return;}
      src.val = tweenValue;
      if(src.val > 1){src.val = 1;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){

      cancelAnimationFrame(src.ID);
    }
  });
}

function nightColor(src, dst, varString, time=8000){
  if(src.val == dst){ return; }
  let curColor = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curColor] }, {
    duration: time,
    easing: [0.34, 1.56, 0.64, 1], 
    progress: function(_, _, _, tweenValue) {
      if(backtoSpotLight){src.elem.velocity("stop", true); return;}
      if(sunsetStart){src.elem.velocity("stop", true); return;}
      src.val = Math.round(tweenValue);
      if(src.val > 255){src.val = 255;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){ 
      cancelAnimationFrame(src.ID);
    }
  });
}
function nightAlpha(src, dst, varString, time=5000){
  if(src.val == dst){ return; }
  let curAlpha = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curAlpha] }, {
    duration: time,
    easing: [0.68, -0.6, 0.32, 1.6], 
    progress: function(_, _, _, tweenValue) {
      if(backtoSpotLight){src.elem.velocity("stop", true); return;}
      if(sunsetStart){src.elem.velocity("stop", true); return;}
      src.val = tweenValue;
      if(src.val > 1){src.val = 1;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){ 
      cancelAnimationFrame(src.ID);
    }
  });
}

function spotlightColor(src, dst, varString, time=8000){
  if(src.val == dst){ return; }
  let curColor = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curColor] }, {
    duration: time,
    easing: [0.36, 0, 0.66, -0.56],
    progress: function(_, _, _, tweenValue) {
      if(sunsetStart){src.elem.velocity("stop", true); return;}
      if(nightStart){src.elem.velocity("stop", true); return;}
      src.val = Math.round(tweenValue);
      if(src.val > 255){src.val = 255;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){ 
      cancelAnimationFrame(src.ID);
    }
  });
}
function spotlightAlpha(src, dst, varString, time=5000){
  if(src.val == dst){ return; }
  let curAlpha = src.val;

  src.elem.velocity("stop").velocity({ tween: [dst, curAlpha] }, {
    duration: time,
    easing: [0.68, -0.6, 0.32, 1.6], 
    progress: function(_, _, _, tweenValue) {
      if(sunsetStart){src.elem.velocity("stop", true); return;}
      if(nightStart){src.elem.velocity("stop", true); return;}
      src.val = tweenValue;
      if(src.val > 1){src.val = 1;}
      else if(src.val < 0){src.val = 0;}
      document.documentElement.style.setProperty(varString, src.val);
    },
    complete: function(){ 
      cancelAnimationFrame(src.ID);
    }
  });
}

/******************************header blur ************************/
let hopacity = 0.85;
let hblur = 4.5;
let $h1 = $("h1");
let h1 = document.getElementsByTagName("h1")[0];
let hblurDir = -1;
let IDhblur;

$settingButton.on("click", function(){
  if(setting){
    requestTimeout(function(){
      IDhblur = requestAnimationFrame(hblurAnim);
    }, 500);
  }
});
function hblurAnim(){
  requestTimeout(function(){
    if(hblurDir == -1){
      hopacity = 0.9;
      hblur = 1.25;
    }
    else{
      hopacity = 0.8;
      hblur = 5;
    }
    hblurDir *= -1;
    h1.style.setProperty("opacity", hopacity);
    h1.style.setProperty("--hblur", hblur+"px");
    cancelAnimationFrame(IDhblur);
    IDhblur = requestAnimationFrame(hblurAnim);
  }, 7000);
}

/*************************body roate********************************/
let bodyRY = parseInt(getComputedStyle(document.body).getPropertyValue("--bodyRotateY"),10);
$bodyRotate = $("#bodyRotate");
let screenMax = -1*window.innerWidth/2 + 0.85 * window.innerWidth;
let screenMin = -1*window.innerWidth/2 + 0.04 * window.innerWidth;
let leftDeg = -6;
let rightDeg = 12;
function bodyRotate(e){
  let sx = e.screenX - window.innerWidth/2;
  if(sx > screenMax){sx = screenMax;}
  else if (sx < screenMin){sx = screenMin;}

  if(setting){leftDeg = -10; rightDeg = 12;} 
  bodyRY = Math.round(scale(sx, screenMin, screenMax, leftDeg, rightDeg));
  document.body.style.setProperty("--bodyRotateY", bodyRY+"deg");
}

window.addEventListener("mousemove", bodyRotate);
// addEvent(document, "mousemove", bodyRotate);

/**************************reflection*********************************** */
let brightRef = 48;
let brightRef2 = 52;
let darkRef = 33;
let darkRef2 = 67;
let lastNOWref;
let NOWref;
let IDreflection;

let destBrightRef,
    destBrightRef2, 
    destDarkRef,
    destDarkRef2;

function BGreflection(timestamp){
  cancelAnimationFrame(IDreflection);
  IDreflection = requestAnimationFrame(BGreflection);

  let smx = mouseX;
  if(limitedCursor){
    if(smx < 0.45*window.innerWidth){smx = 0.45*window.innerWidth;}
    else if(smx > 0.55*window.innerWidth){smx = 0.55*window.innerWidth;}
  }

  if(limitedCursor){
    if(mouseState == 0){
      destBrightRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 40, 50));
      destBrightRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 50, 60));
      destDarkRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 20, 36));
      destDarkRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 70, 80));
    }
    else if(mouseState == 2){
      destBrightRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 45, 53));
      destBrightRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 47, 55));
      destDarkRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 33, 41));
      destDarkRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 59, 67));
    }
    else{
      destBrightRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 45, 51));
      destBrightRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 49, 55));
      destDarkRef = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 30, 46));
      destDarkRef2 = Math.round(scale(smx, 0.45*window.innerWidth, 0.55*window.innerWidth, 64, 70));
    }
  }
  else{
    if(mouseState == 0){
      destBrightRef = Math.round(scale(smx, 0, window.innerWidth, 17, 75));
      destBrightRef2 = Math.round(scale(smx, 0, window.innerWidth, 25, 83));
      destDarkRef = Math.round(scale(smx, 0, window.innerWidth, 0, 58));
      destDarkRef2 = Math.round(scale(smx, 0, window.innerWidth, 42, 100));
    }
    else if(mouseState == 1){
      destBrightRef = Math.round(scale(smx, 0, window.innerWidth, 12, 86));
      destBrightRef2 = Math.round(scale(smx, 0, window.innerWidth, 14, 88));
      destDarkRef = Math.round(scale(smx, 0, window.innerWidth, 0, 74));
      destDarkRef2 = Math.round(scale(smx, 0, window.innerWidth, 26, 100));
    }
    else{
      destBrightRef = Math.round(scale(smx, 0, window.innerWidth, 15, 81));
      destBrightRef2 = Math.round(scale(smx, 0, window.innerWidth, 19, 85));
      destDarkRef = Math.round(scale(smx, 0, window.innerWidth, 0, 66));
      destDarkRef2 = Math.round(scale(smx, 0, window.innerWidth, 34, 100));
    }
  }
  

  if(lastNOWref === undefined){
    lastNOWref = timestamp;
  }
  NOWref = timestamp;
  let dt = (NOWref - lastNOWref)/1000;
  lastNOWref = NOWref;

  brightRef = lerp(brightRef, destBrightRef, 1-Math.pow(0.35, dt));
  brightRef2 = lerp(brightRef2, destBrightRef2, 1-Math.pow(0.35, dt));
  darkRef = lerp(darkRef, destDarkRef, 1-Math.pow(0.45, dt));
  darkRef2 = lerp(darkRef2, destDarkRef2, 1-Math.pow(0.45, dt));

  $scrollContainer.css("--brightReflectionPos", brightRef+"%");
  $scrollContainer.css("--brightReflectionPos2", brightRef2+"%");
  $scrollContainer.css("--darkReflectionPos", darkRef+"%");
  $scrollContainer.css("--darkReflectionPos2", darkRef2+"%");
}

window.addEventListener("mousemove", function(){
  if(start == false){
    cancelAnimationFrame(IDreflection);
    IDreflection = requestAnimationFrame(BGreflection);
  }
}, true);

// addEvent(document, "mousemove", function(){
//   if(start == false){
//     cancelAnimationFrame(IDreflection);
//     IDreflection = requestAnimationFrame(BGreflection);
//   }
// });
/*********************cloud displacement map*****************************/
let $bf = $("#bf");
let $sc = $("#sc");
let cloudFilter = document.getElementById("cloud-filter");
let cloudDisp = document.getElementById("cloud-disp");
//let $cloudFilter = $("#cloud-filter");
//let $cloudDisp = $("#cloud-disp");
let IDbf;
//let IDoc;
let IDsc;

let baseFrequency = 0.055;
//let octave = 1;
let cloudScale = 80;

let bfMax = 0.015;
let bfMin = 0.006;
let scaleMiddle = 90;
let scaleMin = 37;
// let ocMax = 15;
// let ocMiddle = 10;
// let ocMin = 1;

let bfDir = -1;
let scDir = -1;
//let ocDir = 1;

let cloudFlounderBf = false;
let cloudFlounderSc = false;
//let cloudFlounderOc = false;

let cloudStarted = false;
$settingButton.on("click", function(){
  requestTimeout(function(){
    if(setting && cloudOn){
      if(start && cloudStarted == false && cloudRequestAnimBool){
        cloudStarted = true;
        IDbf = requestAnimationFrame(cloudBfStart);
        IDsc = requestAnimationFrame(cloudScStart);
        //IDoc = requestAnimationFrame(cloudOcStart);
      }
    }
  }, 600);
});

let curBf,
    curSc;
    //curOc;

//start
let bfStartEnd = false,
    scStartEnd = false;
    //ocStartEnd = false;
function cloudBfStart(){
  curBf = baseFrequency;
  $bf.velocity({ tween: [bfMin, curBf] }, {
    duration: 11000,
    easing: "easeOutQuad", 
    progress: function(_, _, _, tweenValue) {
      if(!cloudRequestAnimBool){
        $bf.velocity("stop", true);
        bfStartEnd = true;
        curBf = baseFrequency;
        bfDir = 1; 
        return;
      }

      baseFrequency = tweenValue;
      cloudFilter.setAttribute("baseFrequency", baseFrequency);
    },
    complete: function(){
      if(!bfStartEnd){
        bfStartEnd = true;
        curBf = baseFrequency;
        bfDir = 1;
        cancelAnimationFrame(IDbf);
        IDbf = requestAnimationFrame(cloudBfDrift);
      }
    }
  });
}
function cloudScStart(){
  curSc = cloudScale;
  $sc.velocity({ tween: [scaleMin, curSc] }, {
    duration: 19500,
    easing: "easeOutQuad",
    progress: function(_, _, _, tweenValue) {
      if(!cloudRequestAnimBool){
        $sc.velocity("stop", true); 
        scStartEnd = true;
        curSc = cloudScale;
        ScDir = 1;
        return;
      }
      
      cloudScale = tweenValue;
      cloudDisp.setAttribute("scale", cloudScale);
    },
    complete: function(){
      if(!scStartEnd){
        scStartEnd = true;
        curSc = cloudScale;
        ScDir = 1;
        cancelAnimationFrame(IDsc);
        IDsc = requestAnimationFrame(cloudScDrift);
      }
    }
  });
}
// function cloudOcStart(){
//   curOc = octave;
//   $({ oc: curOc }).animate({ oc: ocMax }, {
//     duration: 14500,
//     easing: "easeOutQuad",
//     step: function(now) {
//       octave = Math.round(now);
//       cloudFilter.setAttribute("numOctaves", octave);
//     },
//     complete: function(){
//       if(!ocStartEnd){
//         curOc = octave;
//         OcDir = -1;
//         cancelAnimationFrame(IDoc);
//         IDoc = requestAnimationFrame(cloudOcDrift);  
//       }
//     }
//   });
// }
let cloudRequestAnimBool = true;
function cancelCloudRequestAnim(){
  cloudRequestAnimBool = false;
  cancelAnimationFrame(IDbf);
  cancelAnimationFrame(IDsc);
}
function restartCloudRequestAnim(){
  cloudRequestAnimBool = true;
  IDbf = requestAnimationFrame(cloudBfDrift);
  IDsc = requestAnimationFrame(cloudScDrift);
}


//drift
let curBfSet1 = false,
    curBfSet2 = false;

//let backToDriftBf;
function cloudBfDrift(){
  if(!cloudFlounderBf){
    if(bfDir == -1){
      if(!curBfSet1){curBf = baseFrequency; curBfSet1 = true;}
      $bf.velocity("stop").velocity({ tween: [bfMin, curBf] }, {
        duration: 35000,
        easing: "easeInOutSine",
        progress: function(_, _, _, tweenValue) {
          if(cloudFlounderBf){$bf.velocity("stop", true); return;}
          if(bfDir == 1){$bf.velocity("stop", true); return;}
          if(!cloudRequestAnimBool){$bf.velocity("stop", true); return;}

          baseFrequency = tweenValue;
          cloudFilter.setAttribute("baseFrequency", baseFrequency);
        },
        complete: function(){
          curBfSet1 = false;
          curBf = baseFrequency;
          //backToDriftBf = baseFrequency;
          bfDir = 1;
          cancelAnimationFrame(IDbf);
          if(!cloudFlounderBf){IDbf = requestAnimationFrame(cloudBfDrift);}
        }
      });
    }
    else{
      if(!curBfSet2){curBf = baseFrequency; curBfSet2 = true;}
      $bf.velocity("stop").velocity({ tween: [bfMax, curBf] }, {
        duration: 35000,
        easing: "easeOutSine",
        progress: function(_, _, _, tweenValue) {
          if(cloudFlounderBf){$bf.velocity("stop", true); return;}
          if(bfDir == -1){$bf.velocity("stop", true); return;}
          if(!cloudRequestAnimBool){$bf.velocity("stop", true); return;}

          baseFrequency = tweenValue;
          cloudFilter.setAttribute("baseFrequency", baseFrequency);
        },
        complete: function(){
          curBfSet2 = false;
          curBf = baseFrequency;
          bfDir = -1;
          cancelAnimationFrame(IDbf);
          if(!cloudFlounderBf){IDbf = requestAnimationFrame(cloudBfDrift);}
        }
      });
    }
  }
}

let curScSet1 = false,
    curScSet2 = false;
function cloudScDrift(){
  if(!cloudFlounderSc){
    if(scDir == -1){
      if(!curScSet1){curSc = cloudScale; curScSet1 = true;}
      $sc.velocity("stop").velocity({ tween: [scaleMin, curSc] }, {
        duration: 25000,
        easing: "easeOutSine",
        progress: function(_, _, _, tweenValue) {
          if(cloudFlounderSc){$sc.velocity("stop", true); return;}
          if(scDir == 1){$sc.velocity("stop", true); return;}
          if(!cloudRequestAnimBool){$sc.velocity("stop", true); return;}

          cloudScale = tweenValue;
          cloudDisp.setAttribute("scale", cloudScale);
        },
        complete: function(){
          curScSet1 = false;
          curSc = cloudScale;
          ScDir = 1;
          cancelAnimationFrame(IDsc);
          if(!cloudFlounderSc){IDsc = requestAnimationFrame(cloudScDrift);}
        }
      });
    }
    else{
      if(!curScSet2){curSc = cloudScale; curScSet2 = true;}
      $sc.velocity("stop").velocity({ tween: [scaleMiddle, curSc] }, {
        duration: 25000,
        easing: "easeOutSine",
        progress: function(_, _, _, tweenValue) {
          if(cloudFlounderSc){$sc.velocity("stop", true); return;}
          if(scDir == -1){$sc.velocity("stop", true); return;}
          if(!cloudRequestAnimBool){$sc.velocity("stop", true); return;}

          cloudScale = tweenValue;
          cloudDisp.setAttribute("scale", cloudScale);
        },
        complete: function(){
          curScSet2 = false;
          curSc = cloudScale;
          ScDir = -1;
          cancelAnimationFrame(IDsc);
          if(!cloudFlounderSc){IDsc = requestAnimationFrame(cloudScDrift);}
        }
      });
    }
  }
}

// let curOcSet1 = false,
//     curOcSet2 = false;
// function cloudOcDrift(){
//   if(!cloudFlounderOc){
//     if(ocDir == -1){
//       if(!curOcSet1){curOc = octave; curOcSet1 = true;}
//       $({ oc: curOc }).stop().animate({ oc: ocMiddle }, {
//         duration: 20000,
//         easing: "easeOutSine",
//         step: function(now, fx) {
//           if(cloudFlounderOc){$(fx.elem).stop(true); return;}
//           if(ocDir == 1){$(fx.elem).stop(true); return;}
//           octave = Math.round(now);
//           cloudFilter.setAttribute("numOctaves", octave);
//         },
//         complete: function(){
//           curOcSet1 = false;
//           OcDir = 1;
//           curOc = octave;
//           cancelAnimationFrame(IDoc);
//           if(!cloudFlounderOc){IDoc = requestAnimationFrame(cloudOcDrift);}
//         }
//       });
//     }
//     else{
//       if(!curOcSet2){curOc = octave; curOcSet2 = true;}
//       $({ oc: curOc }).stop().animate({ oc: ocMax }, {
//         duration: 20000,
//         easing: "easeOutSine",
//         step: function(now, fx) {
//           if(cloudFlounderOc){$(fx.elem).stop(true); return;}
//           if(ocDir == -1){$(fx.elem).stop(true); return;}
//           octave = Math.round(now);
//           cloudFilter.setAttribute("numOctaves", octave);
//         },
//         complete: function(){
//           curOcSet2 = false;
//           OcDir = -1;
//           curOc = octave;
//           cancelAnimationFrame(IDoc);
//           if(!cloudFlounderOc){IDoc = requestAnimationFrame(cloudOcDrift);}
//         }
//       });
//     }
//   }
// }

//flounder
let bfFlounderEnd = false,
    scFlounderEnd = false;
    //ocFlounderEnd = false;

function setCloudFlounder(){
  cloudFlounderBf = true;
  cloudFlounderSc = true;
  //cloudFlounderOc = true;
  bfFlounderEnd = false,
  scFlounderEnd = false,
  //ocFlounderEnd = false;
  cancelAnimationFrame(IDbf);
  cancelAnimationFrame(IDsc);
  //cancelAnimationFrame(IDoc);
  IDbf = requestAnimationFrame(cloudBfFlounder);
  IDsc = requestAnimationFrame(cloudScFlounder);
  //IDoc = requestAnimationFrame(cloudOcFlounder);
}

let bfFlounderSet = false,
    scFlounderSet = false;
    //ocFlounderSet = false;
let destBfFlounder, destScFlounder; 
    //destOcFlounder;
function cloudBfFlounder(){
  if(cloudFlounderBf){
    if(!bfFlounderSet){
      curBf = baseFrequency; 
      destBfFlounder = Math.abs(baseFrequency - bfMax) >= Math.abs(baseFrequency - bfMin) ? bfMax + 0.009 - Math.abs(baseFrequency - bfMax) : bfMin - (0.007 - Math.abs(baseFrequency - bfMin));
      if(destBfFlounder < 0.001){destBfFlounder == 0.001;} 
      bfFlounderSet = true;
    }
    $bf.velocity("stop").velocity({ tween: [destBfFlounder, curBf] }, {
      duration: 3500,
      easing: "easeOutQuad", 
      progress: function(_, _, _, tweenValue) {
        if(!cloudFlounderBf){$bf.velocity("stop", true); return;}
        if(!cloudRequestAnimBool){
          $bf.velocity("stop", true);
          bfFlounderEnd = true;
          bfFlounderSet = false;
          bfDir = Math.abs(destBfFlounder - bfMax) <= Math.abs(destBfFlounder - bfMin) ? -1 : 1;
          cloudFlounderBf = false;
          curBf = baseFrequency; 
          return;
        }

        baseFrequency = tweenValue;
        cloudFilter.setAttribute("baseFrequency", baseFrequency);
      },
      complete: function(){
        if(!bfFlounderEnd){
          bfFlounderEnd = true;
          bfFlounderSet = false;
          bfDir = Math.abs(destBfFlounder - bfMax) <= Math.abs(destBfFlounder - bfMin) ? -1 : 1;
          cloudFlounderBf = false;
          curBf = baseFrequency;
          cancelAnimationFrame(IDbf);
          IDbf = requestAnimationFrame(cloudBfDrift);  
        }
      }
    });
  }
}
function cloudScFlounder(){
  if(cloudFlounderSc){
    if(!scFlounderSet){
      curSc = cloudScale; 
      destScFlounder = Math.abs(cloudScale - scaleMiddle) >= Math.abs(cloudScale - scaleMin) ? scaleMiddle + 50 - Math.abs(cloudScale - scaleMiddle) : scaleMin - (40 - Math.abs(cloudScale - scaleMin));
      if(destScFlounder < 10){destBfFlounder == 10;}
      scFlounderSet = true;
    }
    $sc.velocity("stop").velocity({ tween: [destScFlounder, curSc] }, {
      duration: 3500,
      easing: "easeOutQuad",
      progress: function(_, _, _, tweenValue) {
        if(!cloudFlounderSc){$sc.velocity("stop", true); return;}
        if(!cloudRequestAnimBool){
          $sc.velocity("stop", true);
          scFlounderEnd = true;
          scFlounderSet = false;
          ScDir = Math.abs(destScFlounder - scaleMiddle) <= Math.abs(destScFlounder - scaleMin) ? -1 : 1;
          cloudFlounderSc = false;
          curSc = cloudScale; 
          return;
        }

        cloudScale = tweenValue;
        cloudDisp.setAttribute("scale", cloudScale);
      },
      complete: function(){
        if(!scFlounderEnd){
          scFlounderEnd = true;
          scFlounderSet = false;
          ScDir = Math.abs(destScFlounder - scaleMiddle) <= Math.abs(destScFlounder - scaleMin) ? -1 : 1;
          cloudFlounderSc = false;
          curSc = cloudScale;
          cancelAnimationFrame(IDsc);
          IDsc = requestAnimationFrame(cloudScDrift);
        }
      }
    });
  }
}
// function cloudOcFlounder(){
//   if(cloudFlounderOc){
//     if(!ocFlounderSet){
//       curOc = octave;
//       destOcFlounder = Math.abs(octave - ocMax) >= Math.abs(octave - ocMiddle) ? ocMax + 4 - Math.abs(octave - ocMax) : scaleMin - (4 - Math.abs(octave - ocMiddle));
//       if(destOcFlounder < 3){destBfFlounder == 3;}
//       ocFlounderSet = true;
//     }
//     $({ oc: curOc }).stop().animate({ oc: destOcFlounder }, {
//       duration: 3500,
//       easing: "easeOutQuad",
//       step: function(now, fx) {
//         if(!cloudFlounderOc){$(fx.elem).stop(true); return;}
//         octave = Math.round(now);
//         cloudFilter.setAttribute("numOctaves", octave);
//       },
//       complete: function(){
//         if(!ocFlounderEnd){
//           ocFlounderEnd = true;
//           ocFlounderSet = false;
//           OcDir = Math.abs(destOcFlounder - ocMax) <= Math.abs(destOcFlounder - ocMiddle) ? -1 : 1;
//           cloudFlounderOc = false;
//           curOc = octave;
//           cancelAnimationFrame(IDoc);
//           IDoc = requestAnimationFrame(cloudOcDrift);  
//         }
//       }
//     });
//   }
// }


/*******************plaintext font size******************************** */
let $rotateTextOne = $(".rotateTextOne");
let $rotateTextTwo = $(".rotateTextTwo");
let $plaintext = $(".plaintext");
let $timeInput = $("#timeInput");

let plaintextFontSize = 30;
let moonMarginL = 6;
let hMarginL = 5;
let hFontSize = 72;
let bodyBlur = 0.85;
function adjustElementSize(){
  if(window.innerWidth < 2600 && window.innerWidth >= 2000){
    plaintextFontSize = 27; 
    moonScale = 1; 
    moonMarginL = 7; 
    hMarginL = 5; 
    hFontSize = 80;
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "9%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.65;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 2000 && window.innerWidth >= 1700){
    plaintextFontSize = 26; 
    moonScale = 1; 
    moonMarginL = 7; 
    hMarginL = 5; 
    hFontSize = 80;
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "9%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.65;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 2000 && window.innerWidth >= 1500){
    plaintextFontSize = 25; 
    moonScale = 1; 
    moonMarginL = 7; 
    hMarginL = 5; 
    hFontSize = 80;
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "9%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.65;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 1500 && window.innerWidth >= 1200){
    plaintextFontSize = 24; 
    moonScale = 1; 
    moonMarginL = 7; 
    hMarginL = 5; 
    hFontSize = 80;
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "9%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.65;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 1200 && window.innerWidth >= 1000){
    plaintextFontSize = 24; 
    moonMarginL = 7; 
    hFontSize = 72;
    hMarginL = 5; 
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "6%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.6;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 1000 && window.innerWidth >= 800){
    plaintextFontSize = 23; 
    moonMarginL = 6; 
    hFontSize = 72;
    hMarginL = 5; 
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "6%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.6;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 800 && window.innerWidth >= 700){
    plaintextFontSize = 22; 
    moonMarginL = 6; 
    hFontSize = 66;
    hMarginL = 5; 
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "3%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.55;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 700 && window.innerWidth >= 600){
    plaintextFontSize = 21;
    moonMarginL = 25;
    hMarginL = 4;
    hFontSize = 60; 
    $rotateTextOne.css("display", "none");
    $rotateTextTwo.css("display", "none");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "initial");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "25px");
    $timeInput.css("width", "100%");
    bodyBlur = 0.5;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  else if(window.innerWidth < 600 && window.innerWidth >= 500){
    plaintextFontSize = 20;
    moonMarginL = 20;
    hMarginL = 3;
    hFontSize = 57; 
    $rotateTextOne.css("display", "none");
    $rotateTextTwo.css("display", "none");
    $h1.text("Self-Help Guide : Ars-trology");
    $yearMonthButton.css("display", "initial");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "25px");
    $timeInput.css("width", "100%");
    bodyBlur = 0.4;
    //scrollinstance.options("overflowBehavior.x", "s");
  }
  else if(window.innerWidth < 500 && window.innerWidth >= 400){
    plaintextFontSize = 20;
    moonMarginL = 20;
    hMarginL = 3;
    hFontSize = 53; 
    $rotateTextOne.css("display", "none");
    $rotateTextTwo.css("display", "none");
    $h1.text("Self-Help Guide : Ars-trology");
    $yearMonthButton.css("display", "initial");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "25px");
    $timeInput.css("width", "100%");
    bodyBlur = 0.35;
    //scrollinstance.options("overflowBehavior.x", "s");
  }
  else if(window.innerWidth <400){
    plaintextFontSize = 20; 
    moonMarginL = 20; 
    hMarginL = 3; 
    hFontSize = 50;
    $rotateTextOne.css("display", "none");
    $rotateTextTwo.css("display", "none");
    $h1.text("Self-Help Guide : Ars-trology");
    $yearMonthButton.css("display", "initial");
    timeButtonMouseOverFunc = 1;
    $plaintext.css("margin-right", "25px");
    $timeInput.css("width", "100%");
    bodyBlur = 0.25;
    //scrollinstance.options("overflowBehavior.x", "s");
  }
  else{
    plaintextFontSize = 30; 
    moonScale = 1; 
    moonMarginL = 7; 
    hMarginL = 5; 
    hFontSize = 85;
    $rotateTextOne.css("display", "inline-block");
    $rotateTextTwo.css("display", "inline-block");
    $h1.text("Self-Help Guide : Arstrology");
    $yearMonthButton.css("display", "inline-block");
    timeButtonMouseOverFunc = 0;
    $plaintext.css("margin-right", "12%");
    $timeInput.css("width", "55%");
    bodyBlur = 0.85;
    //scrollinstance.options("overflowBehavior.x", "h");
  }
  document.documentElement.style.setProperty("--plaintextFontSize", plaintextFontSize + "px");
  document.documentElement.style.setProperty("--moonMarginL", moonMarginL + "vw");
  document.documentElement.style.setProperty("--hMoonMarginL", hMarginL + "vw");
  document.documentElement.style.setProperty("--hFontSize", hFontSize + "px");
  document.documentElement.style.setProperty("--bodyBlur", bodyBlur + "px");
}
$document.ready(adjustElementSize);
$window.resize(adjustElementSize);


/********************twinkle plain text***********************************/
let plaintexts = document.getElementsByClassName("plaintext");
//let twinkleIntervs = new Array(plaintexts.length);
let twinkleIDs = new Array(plaintexts.length);
let twinkleDirects = new Array(plaintexts.length);

let defaultTwinklwOpa1 = 0.27;
let defaultTwinklwOpa2 = 0.32;
let defaultTwinklwOpa3 = 0.4;
let twinkleOpa = defaultTwinklwOpa1;
let twinkleOpaState = 1;

function textTwinkle($this, index){
  twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($this, index);});
  $this.css("transition", "all 3s ease-in-out");
  if($this.css("opacity") < twinkleOpa && twinkleDirects[index] == 1){ 
    $this.css("opacity", twinkleOpa);
    $this.css("--glowPix1", "4px");
    $this.css("--glowPix2", "-4px");
    $this.css("--glowColor2", "#363246");
    if(Math.abs($this.css("opacity")-twinkleOpa) <= 0.005){twinkleDirects[index] = -1;}
  }
  else if ($this.css("opacity") > 0.05 && twinkleDirects[index] == -1){
    $this.css("opacity", 0.05);
    $this.css("--glowPix1", "1px");
    $this.css("--glowPix2", "-1px");
    $this.css("--glowColor2", "#363246");
    if(Math.abs($this.css("opacity")-0.05) <= 0.005){twinkleDirects[index] = 1;}
  }
  else if($this.css("opacity") >= twinkleOpa && twinkleDirects[index] == 1){twinkleDirects[index] = -1;}
  else if($this.css("opacity") <= 0.05 && twinkleDirects[index] == -1){twinkleDirects[index] = 1;}
}

let twinkleBrighterOpa = 0.75;
let twinkleBrightDimOpa = 0.55;
function textTwinkleBright($this, index){ 
  twinkleIDs[index] = requestAnimationFrame(function(){textTwinkleBright($this, index);});
  $this.css("transition", "all 7s ease-in-out");
  if($this.css("opacity") < twinkleBrighterOpa && twinkleDirects[index] == 1){ 
    $this.css("opacity", twinkleBrighterOpa);
    $this.css("--glowPix1", "-3px");
    $this.css("--glowPix2", "3px");
    $this.css("--glowColor2", "#77798f");
    if(Math.abs(parseFloat($this.css("opacity"))-twinkleBrighterOpa) <= 0.005){twinkleDirects[index] = -1;}
  }
  else if ($this.css("opacity") > twinkleBrightDimOpa && twinkleDirects[index] == -1){
    $this.css("opacity", twinkleBrightDimOpa);
    $this.css("--glowPix1", "4px");
    $this.css("--glowPix2", "-4px");
    $this.css("--glowColor2", "#363246");
    if(Math.abs(parseFloat($this.css("opacity"))-twinkleBrightDimOpa) <= 0.005){twinkleDirects[index] = 1;}
  }
  else if($this.css("opacity") >= twinkleBrighterOpa && twinkleDirects[index] == 1){twinkleDirects[index] = -1;}
  else if($this.css("opacity") <= twinkleBrightDimOpa && twinkleDirects[index] == -1){twinkleDirects[index] = 1;}
}

let j;
for (j = 0; j < plaintexts.length; j++){
  twinkleIDs[j] = undefined;
  cancelAnimationFrame(twinkleIDs[j]);
  twinkleDirects[j] = 1;
}

const openingTextStart = 0;
const openingTextEnd = 3;
function selfTwinkle(start, end){
  let k;
  for (k = start; k < end+1; k++){
    let $argThis = $(plaintexts[k]);
    let index = parseInt($argThis.attr("id"), 10);
    twinkleDirects[index] = -1;
    twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
  }//of for loop
}
function cancelTwinkle(start, end){
  let k;
  for (k = start; k < end+1; k++){
    let $argThis = $(plaintexts[k]);
    let index = parseInt($argThis.attr("id"), 10);
    cancelAnimationFrame(twinkleIDs[index]);
  }//of for loop
}
$document.ready(function(){selfTwinkle(openingTextStart, openingTextEnd);});
//$window.focus(selfTwinkle);


let i;
for(i = 0; i < plaintexts.length; i++){
  addEvent(plaintexts[i], "mouseover", function(){
    if(parseFloat($(this).parent().css("opacity")) > 0 && parseFloat($(this).parent().parent().css("opacity")) > 0 && start == false){
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearRequestTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', requestTimeout(function() {
        // mouseover over ms
        //clearInterval(twinkleIntervs[index]);
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = 1;
        //twinkleIntervs[index] = setInterval(textTwinkleBright, 1000/frameRate, $argThis, index);
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkleBright($argThis, index);});
      }, 2500));
    }
  });
  
  addEvent(plaintexts[i], "mouseleave", function(){
    if(parseFloat($(this).parent().css("opacity")) > 0 && parseFloat($(this).parent().parent().css("opacity")) > 0 && start == false){
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearRequestTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', requestTimeout(function() {
        // mouseover over ms
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = -1;
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
      }, 10000));
    }
  })
}//of for loop

/**********************************rotation*************************************/
let moonCount = 0;
let $selectionDiv = $(".SelectionDiv")
let $rotateBackCircle = $(".rotateBackCircle");
let $rotate = $(".rotate");

let $timesDiv = $("#timesDiv");
let $namesDiv = $("#namesDiv");

let moonCountTimeOut;
let moonCanSwitch0 = false;
let moonCanSwitch1 = true;
let moonCanSwitch2 = false;
let nameTextStart = 4;
let nameTextEnd = 13;
let timeTextStart = 14;
let timeTextEnd = 23;

let moonRotateWillChangeTO;
//let signTextWillChangeTO;
//let moonClickTimeOut;
function moonClickCallBack() {
                      //&& canChange == 1 ){
  if(start == false){ 
    //moonCount = (moonCount + 1) % 3;
    if(moonCanSwitch0){moonCount = 0; moonCanSwitch0 = false;}
    else if(moonCanSwitch1){moonCount = 1; moonCanSwitch1 = false;}
    else if(moonCanSwitch2){moonCount = 2; moonCanSwitch2 = false;}
    // else{moonCount = -1;}

    clearRequestTimeout(moonRotateWillChangeTO);
    //clearRequestTimeout(signTextWillChangeTO);

    $timesDiv.css("will-change", "transform, opacity");
    $namesDiv.css("will-change", "transform, opacity");
    // $nameSignText.css("will-change", "transform, opacity");
    // $timeSignText.css("will-change", "transform, opacity");
    cancelTwinkle(timeTextStart, timeTextEnd);
    cancelTwinkle(nameTextStart, nameTextEnd);
    requestTimeout(function(){
      if (moonCount == 1) {
        //$selectionDiv.removeClass("bottom");
        //$namesDiv.addClass("bottom");
        $namesDiv.css("display", "initial");
        
  
        requestTimeout(function(){
          $rotate.toggleClass("one");
          $rotateTextTwo.removeClass("hide");
          $rotateTextOne.toggleClass("up");
          $timesDiv.removeClass("hideRotateLeft");
          $namesDiv.toggleClass("showRotateLeft");
  
          // let height = window.innerHeight + $namesDiv.outerHeight(true);
          // $bodyRotate.css("height", height + "px");
          requestTimeout(function(){
            //if(parseFloat($namesDiv.css("opacity")) > 0.95){
            selfTwinkle(nameTextStart, nameTextEnd);
            moonCanSwitch0 = false;
            moonCanSwitch1 = false;
            moonCanSwitch2 = true;
            moonCanClick = true;
            //}
            adjustBodyRotateOrigin();
          }, 1100);
        }, 250);
  
        if(0.65 * window.innerHeight - $nameInput.offset().top > 0){
          let sd = {x: scrollinstance.scroll().position.x,
                    y: scrollinstance.scroll().position.y - (0.65 * window.innerHeight - $nameInput.offset().top)};
          if(sd.y < 0){sd.y = 0};
          scrollinstance.scroll(sd, 1000, "easeInOutQuad");
        }
      } 
      else if (moonCount == 2) {
        //$namesDiv.removeClass("bottom");
        //$timesDiv.addClass("bottom");
        $timesDiv.css("display", "initial");
  
        requestTimeout(function(){
          $rotate.removeClass("one");
          $rotate.toggleClass("two");
          $rotateTextOne.removeClass("up");
          $rotateTextOne.toggleClass("hide");
          $rotateTextTwo.toggleClass("down");
          $namesDiv.removeClass("showRotateLeft");
          $namesDiv.toggleClass("hideRotateLeft");
          $timesDiv.toggleClass("showRotateLeft");
  
          // let height = window.innerHeight + $timesDiv.outerHeight(true);
          // $bodyRotate.css("height", height + "px");
          requestTimeout(function(){
            //if(parseFloat($namesDiv.css("opacity")) < 0.05){
            selfTwinkle(timeTextStart, timeTextEnd);
            $namesDiv.css("display", "none"); 
            moonCanSwitch0 = true;
            moonCanSwitch1 = false;
            moonCanSwitch2 = false;
            moonCanClick = true;
            //}
            adjustBodyRotateOrigin();
          }, 1100);
        }, 250);
  
        if(0.65 * window.innerHeight - $timeInput.offset().top > 0){
          let sd = {x: scrollinstance.scroll().position.x,
                    y: scrollinstance.scroll().position.y - (0.65 * window.innerHeight - $timeInput.offset().top)};
          if(sd.y < 0){sd.y = 0};
          scrollinstance.scroll(sd, 1000, "easeInOutQuad");
        }
      } 
      else if(moonCount == 0) {
        //$timesDiv.removeClass("bottom");
        //$selectionDiv.addClass("bottom");

        $rotate.removeClass("two");
        $rotateTextTwo.removeClass("down");
        $rotateTextOne.removeClass("hide");
        $rotateTextTwo.toggleClass("hide");
  
        $namesDiv.removeClass("hideRotateLeft");
        $timesDiv.removeClass("showRotateLeft");
        $timesDiv.toggleClass("hideRotateLeft");
        
        let scrollDest = scrollinstance.scroll().position.y + 300 - (window.innerHeight - $selectionDiv.offset().top);
        if (scrollDest < 0){scrollDest = 0;}
        else if(scrollDest > document.documentElement.scrollHeight){scrollDest = document.documentElement.scrollHeight;}
        scrollinstance.scroll({x: 0, y: scrollDest}, 1000, "easeInOutQuad");
  
        moonCountTimeOut = requestTimeout(function(){
          //if(parseFloat($timesDiv.css("opacity")) < 0.05){
            $timesDiv.css("display", "none"); 
            moonCanSwitch1 = true;
            moonCanSwitch0 = false;
            moonCanSwitch2 = false;
            moonCanClick = true;

            adjustBodyRotateOrigin();
          //}
        }, 1100);
      }

      //sign text
      if(moonCount == 1){$nameSignText.removeClass("appear");}
      else if(moonCount == 2){$timeSignText.removeClass("appear");}
      requestTimeout(function(){
        if(moonCount == 1){
          $nameSignPlainTexts.html("");
          $nameSignHeader.html("");
        }
        else if(moonCount == 2){
          $timeSignPlainTexts.html("");
          $timeSignHeader.html("");
        }
      }, 1800);

      moonRotateWillChangeTO = requestTimeout(function(){
        $timesDiv.css("will-change", "auto");
        $namesDiv.css("will-change", "auto");
      }, 1450);
      // signTextWillChangeTO = requestTimeout(function(){
      //   $nameSignText.css("will-change", "auto");
      //   $timeSignText.css("will-change", "auto");
      // }, 1600);
    }, 210);

    nameInputSubmitted = 0;
    timeInputSubmitted = false;

    //spotlight color
    sunsetStart = false;
    nightStart = false;
    backtoSpotLight = true;

    clearRequestTimeout(SLCtimer);
    SLCtimer = requestTimeout(function() {
      mouseState = 1;
      updateR();
      cancelSLCid();
      LR1.ID = requestAnimationFrame(function(){spotlightColor(LR1, 0, "--LR1");});
      LG1.ID = requestAnimationFrame(function(){spotlightColor(LG1, 0, "--LG1");});
      LB1.ID = requestAnimationFrame(function(){spotlightColor(LB1, 0, "--LB1");});
      LR2.ID = requestAnimationFrame(function(){spotlightColor(LR2, 0, "--LR2");});
      LG2.ID = requestAnimationFrame(function(){spotlightColor(LG2, 0, "--LG2");});
      LB2.ID = requestAnimationFrame(function(){spotlightColor(LB2, 0, "--LB2");});
      LA037.ID = requestAnimationFrame(function(){spotlightAlpha(LA037, 0.37, "--LA0-37");});
    }, 500);
  }
}

let moonCanClick = true;
$rotate.mousedown(function(){
  $rotate.css("cursor", "grabbing");
});
$rotate.mouseup(function(){
  $rotate.css("cursor", "grab");
  if(moonCanClick){
    moonCanClick = false;
    moonClickCallBack();
  }
})

let rotateGlowColor = "#c5c6cfab";
let rotateBG = "rgba(190, 190, 190, 0.5)";
let rotateMouseOver = false;
//$document..
$window.mousemove(function(e){
  if(setting){
    let d = Math.pow(e.pageX - $rotate.offset().left, 2) + Math.pow(e.pageY - $rotate.offset().top, 2)
    if(d < 35000){
      rotateGlowColor = "#d5d9d9c2";
    }
    else{
      if(mouseState == 0){rotateGlowColor = "#c49f999d";}
      else if(mouseState == 2){rotateGlowColor = "#a9b3cf9d";}
      else{rotateGlowColor = "#c5c6cf9a"; }
    }
    if(mouseState == 0){rotateBG = "rgba(181, 117, 107, 0.6)";}
    else if(mouseState == 2){rotateBG = "rgba(135, 144, 201, 0.6)";}
    else{rotateBG = "rgba(190, 190, 190, 0.5)";}
  
    $rotate.css("--rotateGlow", rotateGlowColor);
    $rotate.css("--rotateBGcolor", rotateBG);
  }
})

$selectionDiv.mouseover(function(){
  $rotateBackCircle.css("box-shadow", "0px 0px 10px #232323, 0px 0px 10px #3f3d52, 0px 0px 10px #3f3d52, 0px 0px 10px #232323")
  $rotate.css("box-shadow", "8px 8px 10px var(--rotateGlow), -8px -8px 10px var(--rotateGlow), 8px -8px 10px var(--rotateGlow), -8px 8px 10px var(--rotateGlow)");
  $rotateTextOne.css("color", "#13131c");
  $rotateTextTwo.css("color", "#13131c");
  document.getElementsByClassName("SelectionDiv")[0].style.setProperty("--blurPx", "1px");
});
$selectionDiv.mouseleave(function(){
  $rotateBackCircle.css("box-shadow", "8px -8px 10px #232323, -8px 8px 10px #3f3d52, 8px 8px 10px #3f3d52, -8px -8px 10px #232323")
  $rotate.css("box-shadow", "8px 8px 10px var(--rotateGlow), -8px -8px 10px var(--rotateGlow), 8px -8px 10px var(--rotateGlow), -8px 8px 10px var(--rotateGlow)");
  $rotateTextOne.css("color", "#1b1b24");
  $rotateTextOne.css("color", "#1b1b24");
  document.getElementsByClassName("SelectionDiv")[0].style.setProperty("--blurPx", "3px");
});

/*****************************input box line*************************************/
let $nameInput = $("#nameInput");

//detect which animation event and change check's transition delay accordingly
function whichAnimationEndEvent() {
  var t,
    el = document.createElement("fakeelement");

  var animations = {
    animation: "animationend",
    OAnimation: "oAnimationEnd",
    MozAnimation: "animationend",
    WebkitAnimation: "webkitAnimationEnd"
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

function whichAnimationStartEvent() {
  var t,
    el = document.createElement("fakeelement");

  var animations = {
    animation: "animationstart",
    OAnimation: "oAnimationStart",
    MozAnimation: "animationstart",
    WebkitAnimation: "webkitAnimationStart"
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

let animationEndEvent = whichAnimationEndEvent();
let animationStartEvent = whichAnimationStartEvent();

let validAnimationEnd = 0;

let borderName = document.getElementById("borderName");
let canFlash = 0;
//animation event name
addEvent(borderName, animationStartEvent, function (e) {
  canFlash = 1;
  if (e.animationName == "inputFormButton") {
    borderName.nextElementSibling.style.setProperty("transition-delay", "0s");
    validAnimationEnd = 0;
  } 
  else if (e.animationName == "inputBackToLine") {
    borderName.nextElementSibling.style.setProperty("transition-delay", "1s");
  }
});

addEvent(borderName, animationEndEvent, function (e) {
  canFlash = 0;
  if (e.animationName == "inputFormButton") {
    validAnimationEnd = 1;
    if (bufferRevealBarCode == 1) {
      let checkName = document.getElementsByClassName("check")[0];
      if (inputFocused == 1 && nameInputSubmitted == 0) {
        checkName.style.setProperty("opacity", "1");
        let border = checkName.previousElementSibling;
        border.style.setProperty("opacity", "0");
      } 
      else {
        checkName.style.setProperty("opacity", "0");
        let border = checkName.previousElementSibling;
        border.style.setProperty("opacity", "1");
      }
    }
  }
  else{
    nameInputCanFocus = true;
  }
});

let validity = false;
let JQinput = $("#inp");
let JQborder = $(".border");
JQinput.on("input", function () {
  if (validity != this.checkValidity()) {
    validity = this.checkValidity();
    if (canFlash == 1) {
      JQborder.fadeOut(250).fadeIn(260);
    }
  }
});

//check if focus and blur if focused
let inputFocused = 0;
let nameInputSubmitted = 0;

let $allNotNameInput = $("* :not(.switchDiv):not(#namesDiv):not(#nameInput):not(.inp):not(#inp):not(.border):not(.check)\
:not(#scanArea):not(#redLine):not(#redLightArea):not(#barCodeToScan):not(#barCodeToScan2)\
:not(.paperContainer):not(.paper):not(.segment):not(.segment2):not(.icon)\
:not(.dummy)\
:not(#bodyRotate):not(.filtered):not(#scrollContainer):not(body):not(html)");
// let JQbodyNswitch = $("body > *:not(.switchDiv)");
// let JQswitchNinp = $(".switchDiv > *:not(#nameInput)");
let $inp = $(".inp");
function inputFocusIn() {
  if(nameInputCanFocus && canStartScan){
    inputFocused = 1;
    nameInputSubmitted = 0;
    $allNotNameInput.addClass("inputFocused");
    twinkleOpa = defaultTwinklwOpa2;
    twinkleOpaState = 2;
  }
  else{
    JSinput.blur();
  }
}
function inputFocusOut() {
  inputFocused = 0;
  $allNotNameInput.removeClass("inputFocused");
  twinkleOpa = defaultTwinklwOpa1;
  twinkleOpaState = 1;
}

let JSinput = document.getElementById("inp");
JSinput.addEventListener("focusin", inputFocusIn);
JSinput.addEventListener("focusout", inputFocusOut);

//check hover and click
let JQcheck = $(".check");
let bufferRevealBarCode = 0;
JQcheck.mouseover(function () {
  if (validAnimationEnd == 1) {
    bufferRevealBarCode = 0;
    if (inputFocused == 1 && nameInputSubmitted == 0) {
      this.style.setProperty("opacity", "1");
      let border = this.previousElementSibling;
      border.style.setProperty("opacity", "0");
    } else {
      this.style.setProperty("opacity", "0");
      let border = this.previousElementSibling;
      border.style.setProperty("opacity", "1");
    }
  } else {
    bufferRevealBarCode = 1;
  }
});

JQcheck.mouseleave(function () {
  this.style.setProperty("opacity", "0");
  let border = this.previousElementSibling;
  border.style.setProperty("opacity", "1");
  bufferRevealBarCode = 0;
});

addEvent(JSinput, "invalid", function () {
  JQcheck.css("opacity", "0");
  let border = this.nextElementSibling;
  border.style.setProperty("opacity", "1");
  //bufferRevealBarCode = 0;
});

let nameData = "";
let nameInputCanFocus = true;
JQcheck.mousedown(function () {
                                                    //&& canChange == 1) {
  if (inputFocused == 1 && JSinput.checkValidity()){ 
    let input = this.previousElementSibling.previousElementSibling;
    this.style.setProperty("opacity", "0");
    let border = this.previousElementSibling;
    border.style.setProperty("opacity", "1");

    validity = false;
    nameData = input.value; //get val
    input.value = "";
    nameInputSubmitted = 1;
    input.blur();
    nameInputCanFocus = false;

    //change spotlight state
    sunsetStart = true;
    nightStart = false;
    backtoSpotLight = false;

    clearRequestTimeout(SLCtimer);
    SLCtimer = requestTimeout(function(){
      mouseState = 0;
      updateR();
      cancelSLCid();
      LR1.ID = requestAnimationFrame(function(){sunsetColor(LR1, sunsetR1, "--LR1", 9500);});
      LG1.ID = requestAnimationFrame(function(){sunsetColor(LG1, sunsetG1, "--LG1");});
      LB1.ID = requestAnimationFrame(function(){sunsetColor(LB1, sunsetB1, "--LB1", 7500);});
      LR2.ID = requestAnimationFrame(function(){sunsetColor(LR2, sunsetR2, "--LR2", 9000);});
      LG2.ID = requestAnimationFrame(function(){sunsetColor(LG2, sunsetG2, "--LG2");});
      LB2.ID = requestAnimationFrame(function(){sunsetColor(LB2, sunsetB2, "--LB2", 7500);});
      LA037.ID = requestAnimationFrame(function(){sunsetAlpha(LA037, sunsetA037, "--LA0-37");});
    }, 500);

    setCloudFlounder();

    //scan
    getSignName();
  }
});

function getSignName(){
  nameData = parseInt(nameData, 10);

  let thetaL = Math.atan(nameData);
  let epsilon = Math.atan((nameData % 11) * 11);

  let midhv = Math.atan(Math.tan(thetaL) / Math.cos(epsilon));
  midhv *= (nameData*nameData*57*4)%(57*11);
  curSign = Math.round(midhv) % 11;

  //reset barcode start, finish, condition
  curBarCodeNum = (curSign + Math.floor(Math.random() * Math.floor(4)) + 1) % 11;
  barcodeFinish = (curBarCodeNum + 10) % 11;
  codeAlreadyScanned = 0;
  if(curBarCodeNum > barcodeFinish){largerCodeNum = true;}
  else{largerCodeNum = false;}

  scanAnim();
}


/************ ***********time input******************************/

let frameRate = 60;

let $TIcircle = $("#circle");
let $TIslider = $("#slider");
let $TIcontainer = $("#TIcontainer");
let timeContainer = document.getElementById("timeContainer");
let $yearMonthButton = $("#yearMonthButton");
let IDsliderRotate,
    IDcircleRotate;
//slider vars    
const sliderW2 = $TIslider.width() / 2;
const sliderH2 = $TIslider.height() / 2;
const sliderRadius = 30;
let elPos = { x: $("#TIcontainer").offset().left, y: $("#TIcontainer").offset().top };
let sliderPos = {x: $TIslider.offset().left, y:$TIslider.offset().top};
let TIsliderX = 0,
    TIsliderY = 0;
let sliderMdown = false;
//circle vars
const circleW2 = $TIcircle.width() / 2;
const circleH2 = $TIcircle.height() / 2;
const circleRdius = 50;
let circlePos = {x: $TIcircle.offset().left, y: $TIcircle.offset().top};
let TIcircleX = 0.
    TIcircleY = 0;
let circleMdown = false;

let yearSubmitted = "";
let monthSubmitted = "";

//time input funcs
let curYear = new Date().getFullYear();
let yearVal = curYear;
let curMonth = new Date().getMonth() + 1;
let monthVal = curMonth;
let lastMonthVal = curMonth;
let lap = 0;
let direction = 0;
let changeVal = 1;
let monthPadding = monthVal >= 10 ? "" : "0";
let degIncrement = 30;

let sliderTimeBool = false;
let circleTimeBool = false;

function rotateSlider(deg){
  if(sliderMdown){
    let curDeg = deg;
    let destDeg = curDeg + degIncrement;
    //destDeg = destDeg > 360 ? destDeg - 360 : destDeg;
    $TIslider.velocity({tween: [destDeg, curDeg]},{
      duration: 600,
      easing: [0.68, -0.6, 0.32, 1.6],
      progress: function(_, _, _, tweenValue){
        sliderDeg = tweenValue % 360;
        TIsliderX = sliderRadius * Math.sin((sliderDeg * Math.PI) / 180);
        TIsliderY = sliderRadius * -Math.cos((sliderDeg * Math.PI) / 180);
        //console.log((TIsliderX + sliderRadius - sliderW2) + " ; " + (TIsliderY + sliderRadius - sliderH2));
        $TIslider.css("left", TIsliderX + sliderRadius - sliderW2); 
        $TIslider.css("top", TIsliderY + sliderRadius - sliderH2);
        //$TIslider.css("transform", "rotateZ(" + sliderDeg + "deg");
      },
      complete: function(){
        destMonth = monthVal + Math.ceil(degIncrement/30);
        destMonth = destMonth > 12 ? destMonth - 12 : destMonth;

        sliderTimeBool = true;
        calculateTime(sliderDeg);

        cancelAnimationFrame(IDsliderRotate);
        if(sliderMdown == false){$TIslider.velocity("stop", true); return;}

        IDsliderRotate = requestAnimationFrame(function(){rotateSlider(sliderDeg);});
      }
    });
  }
}
function rotateCircle(deg){
  if(circleMdown){
    let curDeg = deg;
    let destDeg = curDeg - degIncrement;
    //destDeg = destDeg < 0 ? destDeg + 360 : destDeg;
    $({Deg: curDeg}).animate({Deg: destDeg},{
      duration: 600,
      easing: `easeInOutBack`,
      step: function(now){
        circleDeg = (360 + now) % 360;
        TIcircleX = circleRdius * Math.sin((circleDeg * Math.PI) / 180);
        TIcircleY = circleRdius * -Math.cos((circleDeg * Math.PI) / 180);
        //console.log((TIcircleX + circleRdius - circleW2) + " ; " + (TIcircleY + circleRdius - circleH2));
        $TIcircle.css("left", TIcircleX + circleRdius - circleW2); 
        $TIcircle.css("top", TIcircleY + circleRdius - circleH2);
        //$TIcircle.css("transform", "rotateZ(" + circleDeg + "deg");
      },
      complete: function(){
        destMonth = monthVal - Math.round(degIncrement/30);
        destMonth = destMonth <= 0 ? destMonth + 12 : destMonth;

        circleTimeBool = true;
        calculateTime(circleDeg);
        
        cancelAnimationFrame(IDcircleRotate);
        if(circleMdown == false){$(this).stop(true); return;}

        IDcircleRotate = requestAnimationFrame(function(){rotateCircle(circleDeg);});
      }
    });
  }
}

let destMonth = curMonth;
$document.ready(function(){$yearMonthButton.text(yearVal + " . " + monthPadding + monthVal);})
function calculateTime(deg){
  let degMonth = Math.ceil(deg / 30) % 12;
  let monthDiff = destMonth - degMonth;
  monthVal = degMonth + monthDiff;

  if(sliderTimeBool && circleTimeBool == false){
    if(lastMonthVal > monthVal){
      yearVal += changeVal;
      lap += 1
      //if(direction == -1){ lap = 0; changeVal = 1; degIncrement = 30;}
      if(degIncrement <= 180){
        if(lap == 3) { degIncrement += 30;}
        if(lap == 6) { degIncrement += 30;}
        if(lap == 9) { degIncrement += 30;}
      }
      if(lap == 9){  changeVal += 1; lap = 0; }
      //direction = 1;
    }
  }
  else if(sliderTimeBool == false && circleTimeBool){
    if(lastMonthVal < monthVal){
      yearVal -= changeVal; 
      lap += 1;
      //if(direction == 1){ lap = 0; changeVal = 1; degIncrement = 30;}
      if(degIncrement <= 180){
        if(lap == 3) { degIncrement += 30;}
        if(lap == 6) { degIncrement += 30;}
        if(lap == 9) { degIncrement += 30;}
      }
      if(lap == 9){  changeVal += 1; lap = 0; }
      //direction = -1;
    }
  }
  lastMonthVal = monthVal;
  
  if(monthVal < 10){monthPadding = "0";}
  else{monthPadding = "";}
  if(timeButtonMouseOverFunc == 0){$yearMonthButton.text(yearVal + " . " + monthPadding + monthVal);}
  else{$yearMonthButton.text(yearVal + "." + monthPadding + monthVal);}
}

//events
//mouse up window
let TIcircle = document.getElementById("circle"),
    TIslider = document.getElementById("slider");
let TIMdown = false;

$window.mouseup(function () {
  if(moonCount == 2){
    clearRequestTimeout(sliderTimeOut);
    clearRequestTimeout(circleTimeOut);
    sliderMdown = false;
    circleMdown = false;
    cancelAnimationFrame(IDsliderRotate);
    cancelAnimationFrame(IDcircleRotate);

    lap = 0;
    changeVal = 1;
    degIncrement = 30;
    TIMdown = false;
    TIcircle.style.setProperty("--circleBlur", "4.5px");
    TIslider.style.setProperty("--sliderBlur", "4.5px");
    //timeContainer.style.setProperty("--timeContainerBlur", "3px");

    $(document.body).css("cursor", "auto"); //was pointer
    $TIslider.css("cursor", "grab");
    $TIcircle.css("cursor", "grab");
  }
});
//slider mouse down

let sliderMDPos = { x: sliderPos.x - elPos.x, y: sliderPos.y - elPos.y };
let sliderAtan = Math.atan2(sliderMDPos.x - sliderRadius, sliderMDPos.y - sliderRadius);
let sliderDeg = -sliderAtan / (Math.PI / 180) + 180;
let sliderTimeOut;

$TIslider.mousedown(function () {
  clearRequestTimeout(RTOsliderTimeBlur);
  clearRequestTimeout(sliderTimeOut);
  sliderTimeOut = requestTimeout(function(){
    TIMdown = true;
    sliderMdown = true;

    sliderTimeBool = false;
    circleTimeBool = false;

    timeInputSubmitted = false;
    TIslider.style.setProperty("--sliderBlur", "1.25px");
    timeContainer.style.setProperty("--timeContainerBlur", "1px");
    IDsliderRotate = requestAnimationFrame(function(){rotateSlider(sliderDeg);});

    $(document.body).css("cursor", "grabbing");
    $TIslider.css("cursor", "grabbing");
  }, 400);
});
//circle mouse down
let circleMDPos = { x: circlePos.x - elPos.x, y: circlePos.y - elPos.y };
let circleAtan = Math.atan2(circleMDPos.x - circleRdius, circleMDPos.y - circleRdius);
let circleDeg = -circleAtan / (Math.PI / 180) + 180;
let circleTimeOut;

$TIcircle.mousedown(function () {
  clearRequestTimeout(RTOcircleTimeBlur);
  clearRequestTimeout(circleTimeOut);   
  circleTimeOut = requestTimeout(function(){
    circleMdown = true;

    sliderTimeBool = false;
    circleTimeBool = false;

    TIMdown = true;
    timeInputSubmitted = false;
    TIcircle.style.setProperty("--circleBlur", "1.25px");
    timeContainer.style.setProperty("--timeContainerBlur", "1px");
    IDcircleRotate = requestAnimationFrame(function(){rotateCircle(circleDeg);});

    $(document.body).css("cursor", "grabbing");
    $TIcircle.css("cursor", "grabbing");
  }, 400);
});

let RTOcircleTimeBlur;
let RTOsliderTimeBlur;
$TIcircle.mouseover(function(){
  clearRequestTimeout(RTOcircleTimeBlur);
  if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "1px");}
})
$TIcircle.mouseleave(function(){
  clearRequestTimeout(RTOcircleTimeBlur);
  RTOcircleTimeBlur = requestTimeout(function(){
    if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "3px");}
  }, 1200);
})
$TIslider.mouseover(function(){
  clearRequestTimeout(RTOsliderTimeBlur);
  if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "1px");}
})
$TIslider.mouseleave(function(){
  clearRequestTimeout(RTOsliderTimeBlur);
  RTOsliderTimeBlur = requestTimeout(function(){
    if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "3px");}
  }, 1200);
})

//let timeContainerTimeOut;
let timeButtonMouseOverFunc = 0;
addEvent(timeContainer, "mouseover", function(){
  if(!TIMdown){
    //clearRequestTimeout(timeContainerTimeOut);
    //timeContainerTimeOut = requestTimeout(function(){
      if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "1px");}
        let yearStr = yearVal.toString();
        $yearMonthButton.text(yearStr.charAt(2) + yearStr.charAt(3) + "." + monthVal);
    //}, 100);
  }
});
addEvent(timeContainer, "mouseleave", function(){
  if(!TIMdown){
    //clearRequestTimeout(timeContainerTimeOut);
    //timeContainerTimeOut = requestTimeout(function(){
      if(TIMdown == false){timeContainer.style.setProperty("--timeContainerBlur", "3px");}
      $yearMonthButton.css("color", "#2a2835");
      $yearMonthButton.text(yearVal + " . " + monthPadding + monthVal);
    //}, 100);
  }
});

let timeInputSubmitted = false;

$yearMonthButton.click(function(){
  if(canStartScan){
    yearSubmitted = yearVal;
    monthSubmitted = monthVal;
    timeInputSubmitted = true;
    
    //change spotlight state
    sunsetStart = false;
    backtoSpotLight = false;
    nightStart = true;
  
    clearRequestTimeout(SLCtimer);
    SLCtimer = requestTimeout(function() {
      mouseState = 2;
      updateR();
      cancelSLCid();
      LR1.ID = requestAnimationFrame(function(){nightColor(LR1, nightR1, "--LR1");});
      LG1.ID = requestAnimationFrame(function(){nightColor(LG1, nightG1, "--LG1");});
      LB1.ID = requestAnimationFrame(function(){nightColor(LB1, nightB1, "--LB1", 8500);});
      LR2.ID = requestAnimationFrame(function(){nightColor(LR2, nightR2, "--LR2");});
      LG2.ID = requestAnimationFrame(function(){nightColor(LG2, nightG2, "--LG2", 7900);});
      LB2.ID = requestAnimationFrame(function(){nightColor(LB2, nightB2, "--LB2", 9000);});
      LA037.ID = requestAnimationFrame(function(){nightAlpha(LA037, nightA037, "--LA0-37");});
    }, 500);
    
    //scan
    setCloudFlounder();
    getSignTime();
  }
});

$yearMonthButton.mousedown(function(){
  $yearMonthButton.css("cursor", "grabbing");
});
$yearMonthButton.mouseup(function(){
  $yearMonthButton.css("cursor", "grab");
});

//time sign func
let curSign;
let barcodeFinish;
let codeAlreadyScanned = 0;
let largerCodeNum = false;

function getSignTime(){
  let c = (yearSubmitted % 356) / monthSubmitted;
  let thetaL = Math.atan2(monthSubmitted, c);
  let epsilon = Math.atan2(yearSubmitted / monthSubmitted, c);
  let phi = Math.atan2(yearSubmitted, c);

  let asc = Math.atan(Math.cos(thetaL) / (Math.sin(thetaL)*Math.cos(epsilon)+Math.tan(phi)*Math.sin(epsilon)));
  asc *= (yearSubmitted*monthSubmitted)%(356*12*11);
  curSign = Math.round(asc) % 11;
  //reset barcode start, finish, condition
  curBarCodeNum = (curSign + Math.floor(Math.random() * Math.floor(4)) + 1) % 11;
  barcodeFinish = (curBarCodeNum + 10) % 11;
  codeAlreadyScanned = 0;
  if(curBarCodeNum > barcodeFinish){largerCodeNum = true;}
  else{largerCodeNum = false;}

  scanAnim();
}

/*******************scanArea*************************************/
let $scan = $("#scanArea");
// let $allNotScan = $("* :not(#scanArea):not(#redLine):not(#redLightArea):not(#barCodeToScan):not(#barCodeToScan2)\
// :not(.paperContainer):not(.paper):not(.segment):not(.segment2):not(.icon)\
// :not(#scrollContainer):not(#bodyRotate):not(.filtered):not(body)");
let $allNotScan = $bodyRotate;
let $redLine = $("#redLine");
let $redLightArea = $("#redLightArea");
// let $redLightBG = $("#redLightBG");
let $barCode = $("#barCodeToScan");
let $barCode2 = $("#barCodeToScan2");
let signs = {
  0: "{",
  1: "j",
  2: "s",
  3: "n",
  4: "x",
  5: "r",
  6: "m",
  7: "q",
  8: "^",
  9: "k",
  10: "c"
}
let curBarCodeNum = 0;
let $block = $(".block");

let $nameSignText = $("#nameSignText");
let $nameSignPlainTexts = $nameSignText.children(`.plaintext`);
let $nameSignHeader = $nameSignText.children().first();
let $timeSignText = $("#timeSignText");
let $timeSignPlainTexts = $timeSignText.children(`.plaintext`);
let $timeSignHeader = $timeSignText.children().first();

let canStartScan = true;

function redLineAppear(){
  requestTimeout(function(){
    $redLine.css("opacity", "1");
    $redLightArea.css("opacity", "1");
    $redLine.css("--redLineBlur", "2px");
    $redLightArea.css("--redAreaBlur", "2.7px");
    $redLine.css("--redLineScaleY", "1");
    $redLightArea.css("--redAreaScaleY", "1");
    $redLine.css("--redLineScaleX", "1");
    $redLightArea.css("--redAreaScaleX", "1");

    mouseFollowing = true;
    limitedCursor = true;
  }, 4000);
}

function redLineDisappear(){
  requestTimeout(function(){
    $redLine.css("opacity", "0");
    $redLine.css("--redLineBlur", "6px");
    $redLightArea.css("opacity", "0");
    $redLightArea.css("--redAreaBlur", "8px");
    $redLine.css("--redLineScaleY", "0.4");
    $redLightArea.css("--redAreaScaleY", "0.4");
    $redLine.css("--redLineScaleX", "0.96");
    $redLightArea.css("--redAreaScaleX", "0.96");
    requestTimeout(function(){
      $redLine.css("--redLineScaleY", "0.25");
      $redLightArea.css("--redAreaScaleY", "0.25");

      $redLine.css("will-change", "auto");
      $redLightArea.css("will-change", "auto");
    }, 3200);
  }, 2000);
}

function barCodeAppear($code,time){
  $code.text(signs[curBarCodeNum]);
  requestTimeout(function(){
    $code.addClass("goDown");
    $code.css("--barCodeOpacity", "0.2");
    $code.css("--barCodeBlur", "1.25px");
  }, time);
}

function barCodeGoToScan($code, time){
  // console.log(curSign + ", " + curBarCodeNum + " -- " + barcodeFinish);
  requestTimeout(function(){
    $code.removeClass("goDown");
    $code.addClass("toScan");
    $code.css("--barCodeOpacity", "0.85");
  }, time);
}

function barCodeDisappear(){
  $barCode.removeClass("toScan");
  $barCode2.removeClass("toScan");
  $barCode.addClass("goDown");
  $barCode2.addClass("goDown");
  $barCode.css("--barCodeOpacity", "0");
  $barCode2.css("--barCodeOpacity", "0");
  $barCode.css("--barCodeBlur", "12px");
  $barCode2.css("--barCodeBlur", "12px");
  requestTimeout(function(){
    $barCode.removeClass("goDown");
    $barCode2.removeClass("goDown");

    $barCode.css("will-change", "auto");
    $barCode2.css("will-change", "auto");
  }, 1800);
}

function incorrectCode($code, order){
  requestTimeout(function(){
    $code.removeClass("toScan");
    $code.addClass("incorrect");

    requestTimeout(function(){
      $code.css("--barCodeOpacity", "0");
      $code.css("--barCodeBlur", "15px");

      requestTimeout(function(){
          $code.removeClass("incorrect");
          if(order == 1){scanBarCode2();}
          else{scanBarCode();}
      }, 750);
    }, 50);
  }, 150);
}
function correctCode($code){
  requestTimeout(function(){
    $code.removeClass("toScan");
    $code.addClass("correct");
    $code.css("--barCodeOpacity", "0");
    $code.css("--barCodeBlur", "2.25px");

    requestTimeout(function(){
      $code.removeClass("correct");
      $code.addClass("toScan");
      $code.css("--barCodeOpacity", "0.85");
      $code.css("--barCodeBlur", "1.25px");
    }, 250);

    requestTimeout(function(){
      endScan();
    }, 1000);
  }, 300);
}

function scanBarCode(){
  if(codeAlreadyScanned < 11){
    barCodeGoToScan($barCode, 100);
    codeAlreadyScanned += 1;
    curBarCodeNum += 1;
    curBarCodeNum %= 11;
    if(curBarCodeNum <= barcodeFinish){largerCodeNum = false;}

    if(curBarCodeNum != curSign){
      if(largerCodeNum || curBarCodeNum < barcodeFinish){barCodeAppear($barCode2, 350);}
    }

    requestTimeout(function(){
      if(curBarCodeNum != curSign){
        incorrectCode($barCode, 1);
      }
      else{correctCode($barCode);}
    }, 800);
  }
}

function scanBarCode2(){
  if(codeAlreadyScanned < 11){
    barCodeGoToScan($barCode2, 100);
    codeAlreadyScanned += 1;
    curBarCodeNum += 1;
    curBarCodeNum %= 11;
    if(curBarCodeNum <= barcodeFinish){largerCodeNum = false;}

    if(curBarCodeNum != curSign){
      if(largerCodeNum || curBarCodeNum < barcodeFinish + 1){barCodeAppear($barCode, 350);}
    }

    requestTimeout(function(){
      if(curBarCodeNum != curSign){
        incorrectCode($barCode2, 2);
      }
      else{correctCode($barCode2);}
    }, 800);
  }
}

//paper
let $segment = $(".segment");
let $segment2 = $(".segment2");
let $paper = $(".paper");
let $icon = $(".icon");
let $paperContainer = $(".paperContainer");

function paperAppear(){
  $paper.removeClass("disappear");
  $segment.removeClass("disappear");
  $segment2.removeClass("disappear");
  $icon.removeClass("disappear");

  $paperContainer.css("display", "initial");
  $paper.addClass("appear");
  $segment.addClass("appear");
  $segment2.addClass("appear");
  $icon.addClass("appear");
}


function paperDisappear(){
  $paper.addClass("disappear");
  $segment.addClass("disappear");
  $segment2.addClass("disappear");
  $icon.addClass("disappear");

  requestTimeout(function(){
    mouseFollowing = false;
    limitedCursor = false;
    let scrlDest = {x: scrollinstance.scroll().position.x, 
                    y: $namesDiv.outerHeight(true) + $(".switchDiv").position().top - 1.75 * window.innerHeight};
    if(moonCount == 2){
      scrlDest.y = $timesDiv.outerHeight(true) + $(".switchDiv").position().top - 1.75 * window.innerHeight;
    }
    //console.log(scrlDest.y);
    //if(scrlDest.y < 0){scrlDest.y = 0;}
    // scrollinstance.scroll(scrlDest, 1100, "easeInOutQuad");

    if(moonCount == 1){
      mouseY = $nameSignText.offset().top - 0.15 * window.innerWidth;
      mouseX = 0.5 * window.innerWidth;
    }
    else if(moonCount == 2){
      mouseY = $timeSignText.offset().top - 0.15 * window.innerWidth;
      mouseX = 0.5 * window.innerWidth;
    }

    requestTimeout(function(){
      if(moonCount == 1){
        $nameSignText.addClass("appear");
      }
      else if(moonCount == 2){
        $timeSignText.addClass("appear");
      }
      scrollinstance.scroll(scrlDest, 2150, "easeInOutQuad");
      requestTimeout(()=>{adjustBodyRotateOrigin();}, 2200);
    }, 500)
    requestTimeout(function(){
      scrollinstance.options("overflowBehavior.y", "scroll");
      scrollinstance.options("overflowBehavior.x", "scroll");
      mouseFollowing = true;

      $scan.removeClass("svgFilter2");
      $scan.css("display", "none");

      $nameSignText.css("will-change", "auto");
      $timeSignText.css("will-change", "auto");
    }, 2400);
  }, 5000);


  requestTimeout(function(){
    $paper.removeClass("appear");
    $segment.removeClass("appear");
    $segment2.removeClass("appear");
    $icon.removeClass("appear");
    $paperContainer.css("display", "none");

    $paper.css("will-change", "auto");
    $segment.css("will-change", "auto");
    $segment2.css("will-change", "auto");
    $bodyRotate.css("will-change", "transform");
    $scan.css("will-change", "auto");

    requestTimeout(function(){
      canStartScan = true;
      $inp.css("cursor", "text");
      $yearMonthButton.css("cursor", "grab");
    }, 900); 
  }, 12100);
}

//barcode get transparent
let $timeContainer = $("#timeContainer");
function barcodeGetTransparent(){
  if(moonCount == 1){
    $rotateTextOne.addClass("barcodeTransparent");
  }
  else if(moonCount == 2){
    $rotateTextTwo.addClass("barcodeTransparent");
  }
  $timeContainer.addClass("barcodeTransparent");
}

function barcodeGetBack(){
  if(moonCount == 1){
    $rotateTextOne.removeClass("barcodeTransparent");
  }
  else if(moonCount == 2){
    $rotateTextTwo.removeClass("barcodeTransparent");
  }
  $timeContainer.removeClass("barcodeTransparent");
}

//barcode scan whole process
function scanAnim(){
  if(canStartScan){
    canStartScan = false;

    $filterSwitchText.css("color", "white");
    $block.css("display", "initial");

    if(moonCount == 1){
      $nameSignText.removeClass("appear");
      if(0.65 * window.innerHeight - $nameInput.offset().top > 0){
        let sd = {x: scrollinstance.scroll().position.x,
                  y: scrollinstance.scroll().position.y - (0.65 * window.innerHeight - $nameInput.offset().top)};
        if(sd.y < 0){sd.y = 0};
        scrollinstance.scroll(sd, 1100, "easeInOutQuad");
      }
    }
    else if(moonCount == 2){
      $timeSignText.removeClass("appear");
      if(0.65 * window.innerHeight - $timeInput.offset().top > 0){
        let sd = {x: scrollinstance.scroll().position.x,
                  y: scrollinstance.scroll().position.y - (0.65 * window.innerHeight - $timeInput.offset().top)};
        if(sd.y < 0){sd.y = 0};
        scrollinstance.scroll(sd, 1100, "easeInOutQuad");
      }
    }
    
    scrollinstance.options("overflowBehavior.y", "hidden");
    scrollinstance.options("overflowBehavior.x", "hidden");

    twinkleOpaState = 3;
    twinkleOpa = defaultTwinklwOpa3;

    mouseFollowing = false;
    mouseY = 0.5 * window.innerHeight - 70;
    mouseX = 0.5 * window.innerWidth;

    //will-change
    $paper.css("will-change", "transform, opacity");
    $segment.css("will-change", "transform");
    $segment2.css("will-change", "transform");
    $bodyRotate.css("will-change", "transform, filter");
    $nameSignText.css("will-change", "transform, opacity");
    $timeSignText.css("will-change", "transform, opacity");
    requestTimeout(function(){
      $inp.css("cursor", "no-drop");
      $yearMonthButton.css("cursor", "no-drop");

      if(moonCount == 1){
        $nameSignText.removeClass("appear");
      }
      else if(moonCount == 2){
        $timeSignText.removeClass("appear");
      }

      //setCloudFlounder();
      
      paperAppear();

      $allNotScan.addClass("scan");

      //will-change
      $scan.css("will-change", "filter");
      $redLine.css("will-change", "transform, opacity, filter");
      $redLightArea.css("will-change", "transform, opacity, filter");
      $barCode.css("will-change", "transform, opacity, filter");
      $barCode2.css("will-change", "transform, opacity, filter");

      $scan.css("display", "initial");
      requestTimeout(function(){
        if(moonCount == 1){
          $nameSignPlainTexts.html("");
          $nameSignHeader.html("");
        }
        else if(moonCount == 2){
          $timeSignPlainTexts.html("");
          $timeSignHeader.html("");
        }
        barcodeGetTransparent();
        $scan.addClass("svgFilter2");
        redLineAppear();
        barCodeAppear($barCode, 7500);

        requestTimeout(function(){
          scanBarCode();
        },9500);
      }, 1000);
    }, 210);
  }
}

function endScan(){
  requestAnimationFrame(function(){
    if(moonCount == 1){
      $nameSignHeader.text(signs[curSign]);

      $nameSignPlainTexts[0].innerHTML = 
        `<span class="anotherFont"><i class="fas fa-eye"></i> Decode your sign:</span><br> ${signs_decode_array[curSign]}`;
      $nameSignPlainTexts[1].innerHTML = 
        `<span class="anotherFont"><i class="fas fa-star"></i> Colorcode your element:</span><br> ${signs_element_array[curSign]}`;
      for (var i = 0; i < 4; i++){
        $nameSignPlainTexts[2 + i].innerHTML = signs_reading_2d_arr[curSign][i];
      }
      $nameSignPlainTexts[2].innerHTML = 
        `<span class="anotherFont">
        <i class="fas fa-caret-down"></i>
        </span><br> ${$nameSignPlainTexts[2].innerHTML}`;
      //compatibility graph
      $nameSignPlainTexts[6].innerHTML=
      `<p class="anotherFont" style="margin-top: 35vh;">* You can view Arstrology compatibility graph here: &nbsp
      <a href="./compatible-graph/arstro-compatibility.png" style="color: inherit; text-decoration:none; cursor:zoom-in;"
        onclick="openRequestedPopup(this.href, this.target); return false;"
        title="Arstrology Compatibility">
        <i class="fas fa-satellite-dish"></i>
      </a></p>`;
    }
    else if(moonCount == 2){
      $timeSignHeader.text(signs[curSign]);

      $timeSignPlainTexts[0].innerHTML = 
        `<span class="anotherFont"><i class="fas fa-eye"></i> Decode your sign:</span><br> ${signs_decode_array[curSign]}`;
      $timeSignPlainTexts[1].innerHTML = 
        `<span class="anotherFont"><i class="fas fa-star"></i> Colorcode your element:</span><br> ${signs_element_array[curSign]}`;;
      for (var i = 0; i < 4; i++){
        $timeSignPlainTexts[2 + i].innerHTML = signs_reading_2d_arr[curSign][i + 4];
      }
      $timeSignPlainTexts[2].innerHTML = 
        `<span class="anotherFont">
        <i class="fas fa-caret-down"></i>
        </span><br> ${$timeSignPlainTexts[2].innerHTML}`;
      //compatibility graph
      $timeSignPlainTexts[6].innerHTML = 
      `<p class="anotherFont" style="margin-top: 35vh;">* You can view Arstrology compatibility graph here: &nbsp
      <a href="./compatible-graph/arstro-compatibility.png" style="color: inherit; text-decoration:none; cursor:zoom-in;"
        onclick="openRequestedPopup(this.href, this.target); return false;"
        title="Arstrology Compatibility">
        <i class="fas fa-satellite-dish"></i>
      </a></p>`;
    }
    
    barCodeDisappear();
    redLineDisappear();
  
    requestTimeout(function(){
      paperDisappear();

      requestTimeout(function(){
        $allNotScan.removeClass("scan");
        $block.css("display", "none");
        $filterSwitchText.css("color", "black");
        barcodeGetBack();
        twinkleOpaState = 1;
        twinkleOpa = defaultTwinklwOpa1;
      }, 5000);
    }, 4500);
  });
}