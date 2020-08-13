var $document = $(document);
var $htmlAndBody = $("html, body");
var $window = $(window);

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

//spotlight funcs
var lightV;
const lightMass = 15;
const shadeMass = 5;
const G = 0.2;
var velocity = new Vector(0, 0);
var acceleration = new Vector(0, 0);
//var accModifier = 1;
var shadeX = document.body.offsetWidth * 0.6;
var shadeY = document.body.offsetHeight;
var shadeV = new Vector(shadeX, shadeY);
var canChangeAlpha = 0;
//var eclipseSpeed = 0.125;
var x = 0.5*window.innerWidth;
var y = 1.5*window.innerHeight;
var maxDistToLightCenter =
  document.body.clientWidth >= document.body.clientHeight
    ? Math.pow(document.body.clientWidth * 0.18, 2)
    : Math.pow(document.body.clientHeight * 0.18, 2);
//var alphaBias = 0.2;
var randNum = 0;

$window.resize(function(){
  maxDistToLightCenter =
  document.body.clientWidth >= document.body.clientHeight
    ? Math.pow(document.body.clientWidth * 0.18, 2)
    : Math.pow(document.body.clientHeight * 0.18, 2);
  });

var cursorLerpX = 0.005;
var cursorLerpY = 0.005;
function followCursor() {
  IDfollowCursor = requestAnimationFrame(followCursor);
  
  if(Math.abs(cursorLerpY - 0.04) >= 0.002){cursorLerpY = lerp(cursorLerpY, 0.05, 0.005);}
  else{cursorLerpY = 0.04;}
  if(start == false){
    if(Math.abs(cursorLerpX - 0.06) >= 0.002){cursorLerpX = lerp(cursorLerpX, 0.06, 0.01);}
    else{cursorLerpY = 0.06;}
    x = lerp(x, mouseX, cursorLerpX);
  }
  y = lerp(y, mouseY, cursorLerpY);

  document.documentElement.style.setProperty("--cursorX", x + "px");
  document.documentElement.style.setProperty("--cursorY", y + "px");

  lightV = new Vector(x, y); //lightV is the attracting gravity
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

    //apply force
    let f = Vector.divide(force, shadeMass);
    acceleration.add(f);
    velocity.add(acceleration);
    shadeV.add(velocity);

    //change alpha and acc modifier
    let distanceToLightCenter =
      Math.pow(shadeX - x, 2) + Math.pow(shadeY - y, 2);

    //let aBias = Math.pow(document.body.clientWidth * alphaBias, 2);
    let d2 = distanceToLightCenter; //+ aBias;
    //if (d2 > maxDistToLightCenter) {d2 = maxDistToLightCenter;}

    let A1 = scale(d2, 10000, maxDistToLightCenter, 0.13, 0.98);
    let A2 = scale(d2, 10000, maxDistToLightCenter, 0.38, 1);
    //eclipseA1 = lerp(eclipseA1, A1, 0.4);
    //eclipseA2 = lerp(eclipseA2, A2, 0.4);
    eclipseA1 = 1 - A1;
    eclipseA2 = 1 - A2;

    document.documentElement.style.setProperty("--eclipseA1", eclipseA1);
    document.documentElement.style.setProperty("--eclipseA2", eclipseA2);
    //fadeInEcA1 = eclipseA1;
    //fadeInEcA2 = eclipseA2;
  } else if (mouseState == 1 && eclipseR <= 0) {
    randNum = Math.random() * (1.5 - 0.3) + 0.3;
    let randSign = Math.random() * (0.1 + 0.1) - 0.1;
    randNum = randSign > 0 ? randNum : -1 * randNum;
    shadeV = new Vector(
      mouseX + document.body.clientWidth * randNum,
      mouseY + document.body.clientHeight * randNum
    );

    if (shadeX < x) {
      velocity.x = 0.01;
    } else {
      velocity.x = -0.01;
    }
    if (shadeY < y) {
      velocity.y = 0.01;
    } else {
      velocity.y = -0.01;
    }
  }
  document.documentElement.style.setProperty("--eclipseX", shadeX + "px");
  document.documentElement.style.setProperty("--eclipseY", shadeY + "px");
}

//variables for function update
var mouseX = 0.5 * window.innerWidth,
    mouseY = 1.1 * window.innerHeight;
//var followInterv = 0;

var IDfollowCursor;
function update(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  //clearInterval(followInterv);
  //followInterv = setInterval(followCursor, 1000 / frameRate, mouseX, mouseY);
  cancelAnimationFrame(IDfollowCursor);
  IDfollowCursor = requestAnimationFrame(followCursor);
}

var mouseStateUpdated = 0;

function incR1() {
  IDincR1 = requestAnimationFrame(incR1);
  if (radius < 40) {
    canChange = 0;
    radius += 0.125;
  } else {
    canChange = 1;
    mouseStateUpdated = 0;
  }
  if (radius > 40) {
    radius = 40;
  }
  document.documentElement.style.setProperty("--radius", radius + "vmax");
}

function incR2() {
  IDincR2 = requestAnimationFrame(incR2);
  if (radius < 25) {
    canChange = 0;
    radius += 0.125;
  } else {
    canChange = 1;
    mouseStateUpdated = 0;
  }
  if (radius > 25) {
    radius = 25;
  }
  document.documentElement.style.setProperty("--radius", radius + "vmax");
}

function decR() {
  IDdecR = requestAnimationFrame(decR);
  if (radius > 17) {
    canChange = 0;
    radius -= 0.55;
  } else {
    canChange = 1;
    mouseStateUpdated = 0;
  }
  if (radius < 17) {
    radius = 17;
  }
  document.documentElement.style.setProperty("--radius", radius + "vmax");
}

function incEclipseR() {
  IDincEcR = requestAnimationFrame(incEclipseR);
  if (eclipseR < 18.5) {
    canChangeEclipse = 0;
    eclipseR += 0.08;
  } else {
    canChangeEclipse = 1;
  }
  if (eclipseR > 18.5) {
    eclipseR = 18.5;
  }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

function incEclipseR2() {
  IDincEcR2 = requestAnimationFrame(incEclipseR2);
  if (eclipseR < 24) {
    canChangeEclipse = 0;
    eclipseR += 0.04;
  } else {
    canChangeEclipse = 1;
  }
  if (eclipseR > 24) {
    eclipseR = 24;
  }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

function decEclipseR() {
  IDdecEcR = requestAnimationFrame(decEclipseR);
  if (eclipseR > 0) {
    canChangeEclipse = 0;
    eclipseR -= 0.5;
  } else {
    canChangeEclipse = 1;
  }
  if (eclipseR < 0) {
    eclipseR = 0;
  }
  document.documentElement.style.setProperty("--eclipseR", eclipseR + "vmax");
}

function eclipseFadeout() {
  IDecFadeOut = requestAnimationFrame(eclipseFadeout);
  if (eclipseA1 > 0.1 || eclipseA2 > 0.06) {
    canChangeAlpha = 0;
    if (eclipseA1 > 0.02) {
      eclipseA1 -= 0.03125;
    } else if (eclipseA1 < 0.02) {
      eclipseA1 = 0.02;
    }
    if (eclipseA2 > 0.01) {
      eclipseA2 -= 0.03125;
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

var IDincR1,
    IDecFadeOut,
    IDdecEcR,
    IDdecR,
    IDincEcR,
    IDincR2,
    IDincEcR2;
function updateR() {
  if (canChange == 1) {
    if (mouseStateUpdated == 0) {
      mouseStateUpdated = 1;
      mouseState = (mouseState + 1) % 3;
    }
    // clearInterval(interv);
    // clearInterval(eclipseInterv);
    // clearInterval(eclipseFadeInterv);

    if (mouseState == 1) {
      velocity.multiply(0); //reset eclipse velocity
      cancelAnimationFrame(IDincR2);
      cancelAnimationFrame(IDincEcR2);
      IDincR1 = requestAnimationFrame(incR1);
      IDecFadeOut = requestAnimationFrame(eclipseFadeout);
      IDdecEcR = requestAnimationFrame(decEclipseR);
      // interv = setInterval(incR1, 1000 / frameRate);
      // eclipseFadeInterv = setInterval(eclipseFadeout, 1000 / frameRate);
      // eclipseInterv = setInterval(decEclipseR, 1000 / frameRate);
    } 
    else if (mouseState == 2) {
      cancelAnimationFrame(IDincR1);
      cancelAnimationFrame(IDecFadeOut);
      cancelAnimationFrame(IDdecEcR);
      IDdecR = requestAnimationFrame(decR);
      IDincEcR = requestAnimationFrame(incEclipseR);
      // interv = setInterval(decR, 1000 / frameRate);
      // eclipseInterv = setInterval(incEclipseR, 1000 / frameRate);
    } 
    else if (mouseState == 0) {
      cancelAnimationFrame(IDdecR);
      cancelAnimationFrame(IDincEcR);
      IDincR2 = requestAnimationFrame(incR2);
      IDincEcR2 = requestAnimationFrame(incEclipseR2);
      // interv = setInterval(incR2, 1000 / frameRate);
      // eclipseInterv = setInterval(incEclipseR2, 1000 / frameRate);
    }
  }
}


$htmlAndBody.animate({ scrollTop: 0 }, "slow");
//******************************spotlight*********************************/
var mouseState = 0;
//var frameRate = 75;
var canChange = 1;
var canChangeEclipse = 1;

var radius = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--radius"),
  10
);
var eclipseR = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseR"),
  10
);
var eclipseA1 = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseA1"),
  10
);
var eclipseA2 = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--eclipseA2"),
  10
);
var fadeInEcA1 = eclipseA1;
var fadeInEcA2 = eclipseA2;
//var interv = 0;
//var eclipseInterv = 0;
//var eclipseFadeInterv = 0;

function startAnim(){
  if(start){
    setTimeout(function() {
      addEvent(document, "mousemove", update);
    }, 5000);
    setTimeout(function() {
      addEvent(document, "mousedown", updateR);
      start = false;
      cancelAnimationFrame(IDstart);
    }, 9000);
  }
}
function darknessStartAnim(){
  cancelAnimationFrame(IDdarkness);
  if(Math.abs(darkness - 0.93) >= 0.005){
    darkness = lerp(darkness, 0.93, 0.005);
    IDdarkness = requestAnimationFrame(darknessStartAnim);
  }
  else{darkness = 0.93; }
  document.documentElement.style.setProperty("--darkness", darkness);
}

var start = true;
var IDstart;
var IDdarkness;
var darkness = 0.99;
IDfollowCursor = requestAnimationFrame(followCursor);
IDstart = requestAnimationFrame(startAnim);
IDdarkness = requestAnimationFrame(darknessStartAnim);
$document.ready(updateR);

//******************************header blur ************************/
var hopacity = 0.85;
var hblur = 4.5;
var $h1 = $("h1");
var h1 = document.getElementsByTagName("h1")[0];
var hblurDir = -1;
var IDhblur;

IDhblur = requestAnimationFrame(hblurAnim);
function hblurAnim(){
  setTimeout(function(){
    if(hblurDir == -1){
      hopacity = 0.9;
      hblur = 1.5;
    }
    else{
      hopacity = 0.8;
      hblur = 5;
    }
    hblurDir *= -1;
    h1.style.setProperty("opacity", hopacity);
    h1.style.setProperty("--hblur", hblur+"px");
    IDhblur = requestAnimationFrame(hblurAnim);
  }, 10000);
}

//*************************body roate********************************/
var bodyRY = parseInt(getComputedStyle(document.body).getPropertyValue("--bodyRotateY"),10);
var screenMax = 0.6 * window.screen.width;
var screenMin = -1*window.screen.width/2 + 0.04 * window.screen.width;
function bodyRotate(e){
  let sx = e.screenX - window.screen.width/2;
  if(sx > screenMax){sx = screenMax;}
  else if (sx < screenMin){sx = screenMin;}
  bodyRY = Math.round(scale(sx, screenMin, screenMax, -3, 7));
  document.body.style.setProperty("--bodyRotateY", bodyRY+"deg");
  //let sy = e.screenY;
}
addEvent(document, "mousemove", bodyRotate);

//*********************cloud displacement map*****************************/
var cloudFilter = document.getElementById("cloud-filter");
var cloudDisp = document.getElementById("cloud-disp");
//var $cloudFilter = $("#cloud-filter");
//var $cloudDisp = $("#cloud-disp");
var IDbf;
var IDoc;
var IDsc;

var baseFrequency = 0.07;
var octave = 1;
var cloudScale = 100;

var bfMax = 0.018;
var bfMiddle = 0.015;
var bfMin = 0.007;
var scaleMax = 100;
var scaleMiddle = 73;
var scaleMin = 28;
var ocMax = 10;
var ocMiddle = 6;
var ocMin = 1;

var bfDir = -1;
var scDir = -1;
var ocDir = 1;

if(start){
  IDbf = requestAnimationFrame(cloudBfStart);
  IDsc = requestAnimationFrame(cloudScStart);
  IDoc = requestAnimationFrame(cloudOcStart);
}


function cloudBfStart(){
  let curBf = baseFrequency;
  $({ bf: curBf }).animate({ bf: bfMin }, {
    duration: 8500,
    easing: "easeOutQuad", 
    step: function(now, fx) {
      baseFrequency = now;
      cloudFilter.setAttribute("baseFrequency", baseFrequency);
    },
    complete: function(){
      bfDir = 1;
      cancelAnimationFrame(IDbf);
      IDbf = requestAnimationFrame(cloudBfDrift);
    }
  });
}
function cloudScStart(){
  let curSc = cloudScale;
  $({ sc: curSc }).animate({ sc: scaleMin }, {
    duration: 17500,
    easing: "easeOutQuad",
    step: function(now, fx) {
      cloudScale = now;
      cloudDisp.setAttribute("scale", cloudScale);
    },
    complete: function(){
      ScDir = 1;
      cancelAnimationFrame(IDsc);
      IDsc = requestAnimationFrame(cloudScDrift);
    }
  });
}
function cloudOcStart(){
  let curOc = octave;
  $({ oc: curOc }).animate({ oc: scaleMax }, {
    duration: 12500,
    easing: "easeOutQuad",
    step: function(now, fx) {
      octave = Math.round(now);
      cloudFilter.setAttribute("numOctaves", octave);
    },
    complete: function(){
      OcDir = -1;
      cancelAnimationFrame(IDoc);
      IDoc = requestAnimationFrame(cloudOcDrift);
    }
  });
}

function cloudBfDrift(){
  if(bfDir == -1){
    let curBf = baseFrequency;
    $({ bf: curBf }).animate({ bf: bfMin }, {
      duration: 35000,
      easing: "easeInOutSine",
      step: function(now, fx) {
        baseFrequency = now;
        cloudFilter.setAttribute("baseFrequency", baseFrequency);
      },
      complete: function(){
        bfDir = 1;
        cancelAnimationFrame(IDbf);
        IDbf = requestAnimationFrame(cloudBfDrift);
      }
    });
  }
  else{
    let curBf = baseFrequency;
    $({ bf: curBf }).animate({ bf: bfMiddle }, {
      duration: 35000,
      easing: "easeOutSine",
      step: function(now, fx) {
        baseFrequency = now;
        cloudFilter.setAttribute("baseFrequency", baseFrequency);
      },
      complete: function(){
        bfDir = -1;
        cancelAnimationFrame(IDbf);
        IDbf = requestAnimationFrame(cloudBfDrift);
      }
    });
  }
}

function cloudScDrift(){
  if(scDir == -1){
    let curSc = cloudScale;
    $({ sc: curSc }).animate({ sc: scaleMin }, {
      duration: 25000,
      easing: "easeOutSine",
      step: function(now, fx) {
        cloudScale = now;
        cloudDisp.setAttribute("scale", cloudScale);
      },
      complete: function(){
        ScDir = 1;
        cancelAnimationFrame(IDsc);
        IDsc = requestAnimationFrame(cloudScDrift);
      }
    });
  }
  else{
    let curSc = cloudScale;
    $({ sc: curSc }).animate({ sc: scaleMiddle }, {
      duration: 25000,
      easing: "easeOutSine",
      step: function(now) {
        cloudScale = now;
        cloudDisp.setAttribute("scale", cloudScale);
      },
      complete: function(){
        ScDir = -1;
        cancelAnimationFrame(IDsc);
        IDsc = requestAnimationFrame(cloudScDrift);
      }
    });
  }
}

function cloudOcDrift(){
  if(ocDir == -1){
    let curOc = octave;
    $({ oc: curOc }).animate({ oc: scaleMiddle }, {
      duration: 20000,
      easing: "easeOutSine",
      step: function(now) {
        octave = Math.round(now);
        cloudFilter.setAttribute("numOctaves", octave);
      },
      complete: function(){
        OcDir = 1;
        cancelAnimationFrame(IDoc);
        IDoc = requestAnimationFrame(cloudOcDrift);
      }
    });
  }
  else{
    let curOc = octave;
    $({ oc: curOc }).animate({ oc: scaleMax }, {
      duration: 20000,
      easing: "easeOutSine",
      step: function(now) {
        octave = Math.round(now);
        cloudFilter.setAttribute("numOctaves", octave);
      },
      complete: function(){
        OcDir = -1;
        cancelAnimationFrame(IDoc);
        IDoc = requestAnimationFrame(cloudOcDrift);
      }
    });
  }
}



//********************twinkle plain text***********************************/
var plaintexts = document.getElementsByClassName("plaintext");
//var twinkleIntervs = new Array(plaintexts.length);
var twinkleIDs = new Array(plaintexts.length);
var twinkleDirects = new Array(plaintexts.length);


function textTwinkle($this, index){
  twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($this, index);});
  if($this.css("opacity") < 0.55 && twinkleDirects[index] == 1){ 
    $this.css("opacity", 0.55);
    $this.css("--glowPix1", "3.5px");
    $this.css("--glowPix2", "-3.5px");
    if(Math.abs($this.css("opacity")-0.55) <= 0.005){twinkleDirects[index] = -1;}
  }
  else if ($this.css("opacity") > 0.15 && twinkleDirects[index] == -1){
    $this.css("opacity", 0.15);
    $this.css("--glowPix1", "1.5px");
    $this.css("--glowPix2", "-1.5px");
    if(Math.abs($this.css("opacity")-0.15) <= 0.005){twinkleDirects[index] = 1;}
  }
}

function textTwinkleBright($this, index){ 
  twinkleIDs[index] = requestAnimationFrame(function(){textTwinkleBright($this, index);});
  if($this.css("opacity") < 0.85 && twinkleDirects[index] == 1){ 
    $this.css("opacity", 0.85);
    $this.css("--glowPix1", "0.5px");
    $this.css("--glowPix2", "-0.5px");
    if(Math.abs($this.css("opacity")-0.85) <= 0.005){twinkleDirects[index] = -1;}
  }
  else if ($this.css("opacity") > 0.45 && twinkleDirects[index] == -1){
    $this.css("opacity", 0.45);
    $this.css("--glowPix1", "2px");
    $this.css("--glowPix2", "-2px");
    if(Math.abs($this.css("opacity")-0.45) <= 0.005){twinkleDirects[index] = 1;}
  }
}

let j;
for (j = 0; j < plaintexts.length; j++){
  //twinkleIntervs[j] = 0;
  //clearInterval(twinkleIntervs[j]);
  twinkleIDs[j] = undefined;
  cancelAnimationFrame(twinkleIDs[j]);
  twinkleDirects[j] = 1;
}


function selfTwinkle(){
  let k;
  for (k = 0; k < plaintexts.length; k++){
    let $argThis = $(plaintexts[k]);
    let index = parseInt($argThis.attr("id"), 10);
    //cancelAnimationFrame(twinkleIDs[index]);
    twinkleDirects[index] = -1;
    twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
  }//of for loop
}
$document.ready(selfTwinkle);
//$window.focus(selfTwinkle);

var i;
for(i = 0; i < plaintexts.length; i++){
  addEvent(plaintexts[i], "mouseover", function(){
    if($(this).parent().css("opacity") > 0 && inputFocused == 0 && start == false){
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', setTimeout(function() {
        // mouseover over ms
        //clearInterval(twinkleIntervs[index]);
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = 1;
        //twinkleIntervs[index] = setInterval(textTwinkleBright, 1000/frameRate, $argThis, index);
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkleBright($argThis, index);});
      }, 4000));
    }
    else{
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', setTimeout(function() {
        // mouseover over ms
        //clearInterval(twinkleIntervs[index]);
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = -1;
        //twinkleIntervs[index] = setInterval(textTwinkle, 1000 / frameRate, $argThis, index);
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
      }, 5000));
    }
  });
  
  addEvent(plaintexts[i], "mouseleave", function(){
    if($(this).parent().css("opacity") > 0 && start == false){
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', setTimeout(function() {
        // mouseover over ms
        //clearInterval(twinkleIntervs[index]);
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = -1;
        //twinkleIntervs[index] = setInterval(textTwinkle, 1000 / frameRate, $argThis, index);
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
      }, 10000));
    }
    else{
      let $argThis = $(this);
      let index = parseInt($argThis.attr("id"), 10);
      clearTimeout($.data(this, 'mouseoverTimer'));
      $.data(this, 'mouseoverTimer', setTimeout(function() {
        // mouseover over ms
        //clearInterval(twinkleIntervs[index]);
        cancelAnimationFrame(twinkleIDs[index]);
        twinkleDirects[index] = -1;
        //twinkleIntervs[index] = setInterval(textTwinkle, 1000 / frameRate, $argThis, index);
        twinkleIDs[index] = requestAnimationFrame(function(){textTwinkle($argThis, index);});
      }, 5000));
    }
  })
}//of for loop

//**********************************rotation*************************************/
var moonCount = 0;
var $rotateBackCircle = $(".rotateBackCircle");
var $rotate = $(".rotate");
var $rotateTextOne = $(".rotateTextOne");
var $rotateTextTwo = $(".rotateTextTwo");
var $timesDiv = $("#timesDiv");
var $namesDiv = $("#namesDiv");
var $root = $(":root");

$rotateBackCircle.click(function () {
  if(start == false){
    moonCount = (moonCount + 1) % 3;

    if (moonCount == 1) {
      $rotate.toggleClass("one");
      $rotateTextTwo.removeClass("hide");
      $rotateTextOne.toggleClass("up");

      $timesDiv.removeClass("hideRotateLeft");
      $namesDiv.toggleClass("showRotateLeft");
      $root.css("overflow-y", "auto");
    } else if (moonCount == 2) {
      $rotate.removeClass("one");
      $rotate.toggleClass("two");
      $rotateTextOne.removeClass("up");
      $rotateTextOne.toggleClass("hide");
      $rotateTextTwo.toggleClass("down");

      $namesDiv.removeClass("showRotateLeft");
      $namesDiv.toggleClass("hideRotateLeft");
      $timesDiv.toggleClass("showRotateLeft");
      $root.css("overflow-y", "auto");
    } else {
      $rotate.removeClass("two");
      $rotateTextTwo.removeClass("down");
      $rotateTextOne.removeClass("hide");
      $rotateTextTwo.toggleClass("hide");

      $namesDiv.removeClass("hideRotateLeft");
      $timesDiv.removeClass("showRotateLeft");
      $timesDiv.toggleClass("hideRotateLeft");
      $htmlAndBody.animate({ scrollTop: 0 }, "slow");
      $root.css("overflow-y", "hidden");
    }
  }
});

$rotateBackCircle.mouseover(function(){
  $rotateBackCircle.css("box-shadow", "0px 0px 10px #232323, 0px 0px 10px #3f3d52, 0px 0px 10px #3f3d52, 0px 0px 10px #232323")
  $rotate.css("box-shadow", "0px 0px 10px #ebebeb, 0px 0px 10px #ebebeb, 0px 0px 10px #ebebeb, 0px 0px 10px #ebebeb")
  $rotateTextOne.css("color", "#191919");
  $rotateTextTwo.css("color", "#191919");
  document.getElementsByClassName("SelectionDiv")[0].style.setProperty("--blurPx", "1.25px");
});
$rotateBackCircle.mouseleave(function(){
  $rotateBackCircle.css("box-shadow", "8px -8px 10px #232323, -8px 8px 10px #3f3d52, 8px 8px 10px #3f3d52, -8px -8px 10px #232323")
  $rotate.css("box-shadow", "8px 8px 10px #ebebeb, -8px -8px 10px #ebebeb, 8px -8px 10px #ebebeb, -8px 8px 10px #ebebeb")
  $rotateTextOne.css("color", "#1b1b24");
  $rotateTextOne.css("color", "#1b1b24");
  document.getElementsByClassName("SelectionDiv")[0].style.setProperty("--blurPx", "3.5px");
});

//*****************************input box line*************************************/

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

var animationEndEvent = whichAnimationEndEvent();
var animationStartEvent = whichAnimationStartEvent();

var validAnimationEnd = 0;

var borderName = document.getElementById("borderName");
var canFlash = 0;
//animation event name
addEvent(borderName, animationStartEvent, function (e) {
  canFlash = 1;
  if (e.animationName == "inputFormButton") {
    borderName.nextElementSibling.style.transitionDelay = "0s";
    validAnimationEnd = 0;
  } else if (e.animationName == "inputBackToLine") {
    borderName.nextElementSibling.style.transitionDelay = "1s";
  }
});

addEvent(borderName, animationEndEvent, function (e) {
  canFlash = 0;
  if (e.animationName == "inputFormButton") {
    validAnimationEnd = 1;
    if (bufferRevealBarCode == 1) {
      let checkName = document.getElementsByClassName("check")[0];
      if (inputFocused == 1 && inputSubmitted == 0) {
        checkName.style.opacity = "1";
        let border = checkName.previousElementSibling;
        border.style.opacity = "0";
      } else {
        checkName.style.opacity = "0";
        let border = checkName.previousElementSibling;
        border.style.opacity = "1";
      }
    }
  }
});

var validity = false;
var JQinput = $("#inp");
var JQborder = $(".border");
JQinput.on("input", function () {
  if (validity != this.checkValidity()) {
    validity = this.checkValidity();
    if (canFlash == 1) {
      JQborder.fadeOut(250).fadeIn(260);
    }
  }
});

//check if focus and blur if focused
var inputFocused = 0;
var inputSubmitted = 0;

var JQbodyNswitch = $("body > *:not(.switchDiv)");
var JQswitchNinp = $(".switchDiv > *:not(.inp)");
var $inp = $(".inp");
function inputFocusIn() {
  inputFocused = 1;
  inputSubmitted = 0;
  JQbodyNswitch.toggleClass("inputFocused");
  JQswitchNinp.toggleClass("inputFocused");
  $inp.css("filter", "blur(1px)");
  $inp.css("-ms-filter", "blur(1px)");
  $inp.css("-ms-filter", "blur(1px)");
  $inp.css("-web-kit-filter", "blur(1px)");
}
function inputFocusOut() {
  inputFocused = 0;
  JQbodyNswitch.toggleClass("inputFocused");
  JQswitchNinp.toggleClass("inputFocused");
  $inp.css("filter", "blur(.5px)");
  $inp.css("-ms-filter", "blur(.5px)");
  $inp.css("-ms-filter", "blur(.5px)");
  $inp.css("-web-kit-filter", "blur(.5px)");
}

var JSinput = document.getElementById("inp");
JSinput.addEventListener("focusin", inputFocusIn);
JSinput.addEventListener("focusout", inputFocusOut);

//check hover and click
var JQcheck = $(".check");
var bufferRevealBarCode = 0;
JQcheck.mouseover(function () {
  if (validAnimationEnd == 1) {
    bufferRevealBarCode = 0;
    if (inputFocused == 1 && inputSubmitted == 0) {
      this.style.opacity = "1";
      let border = this.previousElementSibling;
      border.style.opacity = "0";
    } else {
      this.style.opacity = "0";
      let border = this.previousElementSibling;
      border.style.opacity = "1";
    }
  } else {
    bufferRevealBarCode = 1;
  }
});

JQcheck.mouseleave(function () {
  this.style.opacity = "0";
  let border = this.previousElementSibling;
  border.style.opacity = "1";
  bufferRevealBarCode = 0;
});

addEvent(JSinput, "invalid", function () {
  JQcheck.css("opacity", "0");
  let border = this.nextElementSibling;
  border.style.opacity = "1";
  //bufferRevealBarCode = 0;
});

var nameData = "";
JQcheck.mousedown(function () {
  if (inputFocused == 1 && JSinput.checkValidity()) {
    let input = this.previousElementSibling.previousElementSibling;
    this.style.opacity = "0";
    let border = this.previousElementSibling;
    border.style.opacity = "1";

    validity = false;
    nameData = input.value; //get val
    input.value = "";
    inputSubmitted = 1;
    input.blur();
  }
});

//*******************showSign*************************************/