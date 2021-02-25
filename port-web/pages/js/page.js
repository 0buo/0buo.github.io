/**************************request time out****************************** */
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

/**************check mobile**********************/
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};



// =========================


function getBottomScrollBarHeight(el){
    let h = el.offsetHeight - el.clientHeight - el.clientTop*2;
    return h;
}

function setSideColumnHeight(){
    let scrollH = getBottomScrollBarHeight(flexContainer) + sideColumn.clientTop*2;
    $sideColumn.css(`height`, `calc(100vh - ${scrollH}px)`);
    $sideBorder.css(`height`, `calc(100vh - ${scrollH}px)`);
}

//FOLD / UNFOLD SIDE
let sideFolded = false;
let narrowScreen = false;
function resizeSide(){
    if(window.innerWidth <= 1000){
        if(!narrowScreen){
            $sideColumn.css(`transform`, `translateX(-150vw)`);
            $sideBorder.css(`transform`, `translateX(-150vw)`);
            $sideButton.css(`left`, `8px`);
            sideFolded = true;
        }
        narrowScreen = true;

        $sideColumn.css(`width`, `${window.innerWidth - 80}px`);
        $sideBorder.css(`left`, `${window.innerWidth - 80}px`);
    }
    else{
        if(narrowScreen){
            $sideColumn.css(`transform`, ``);
            $sideBorder.css(`transform`, ``);
            $sideButton.css(`left`, `calc(50vw + 3.5px + 7px)`);
            sideFolded = false;
        }
        narrowScreen = false;

        $sideColumn.css(`width`, `50vw`);
        $sideBorder.css(`left`, `50vw`);
    }
}

//============
//BUTTON EVETNS
let isMouseDown = false;
function mouseoverSideButton(){
    $sideButton.css(`transform`, `scale(1.15)`);
    if(!isMouseDown) $sideButton.css(`background-color`, `transparent`);
    else $sideButton.css(`background-color`, `${buttonColor}`);
    $sideButton.css(`background-image`, `${buttonImage}`);
}
function mouseleaveSideButton(){
    $sideButton.css(`transform`, `scale(1)`);
    $sideButton.css(`background-color`, `transparent`);
    $sideButton.css(`background-image`, `none`);
}

//------
function mousedownSideButton(e){
    if(e.type == `touchstart`){
        e.preventDefault();
        firstTouch = e.changedTouches[0];
    }

    $sideButton.css(`transform`, `scale(1.25)`);
    if(isMobileTablet){
        $sideButton.addClass(`buzz`);
    }
    else{
        $sideButton.addClass(`squiggle`);
    }

    isMouseDown = true;
    $sideButton.css(`background-color`, `${buttonColor}`);
    $sideButton.css(`background-image`, `${buttonImage}`);
}
function windowMouseupSideButton(e){
    // if(e.type == `touchend`) e.preventDefault();
    
    $sideButton.css(`transform`, `scale(1)`);
    $sideButton.removeClass(`squiggle`);
    $sideButton.removeClass(`buzz`);

    isMouseDown = false;
    $sideButton.css(`background-color`, `transparent`);
    $sideButton.css(`background-image`, `none`);
}
function mouseupSideButton(e){
    if(e.type == `touchend`){
        e.preventDefault();

        lastTouch = e.changedTouches[0];
        touchDist = Math.pow((firstTouch.screenX - lastTouch.screenX), 2) + Math.pow((firstTouch.screenY - lastTouch.screenY), 2);
    }
    else{
        touchDist = 0;
    }

    console.log(touchDist);

    if(touchDist < restraint){
        if(narrowScreen){
            if(sideFolded){
                sideFolded = false;
        
                $sideColumn.css(`transform`, ``);
                $sideBorder.css(`transform`, ``);
                $sideButton.css(`left`, `calc(calc(100vw - 80px) + 3.5px + 7px)`);
            }
            else{
                sideFolded = true;
        
                $sideColumn.css(`transform`, `translateX(-150vw)`);
                $sideBorder.css(`transform`, `translateX(-150vw)`);
                $sideButton.css(`left`, `7px`)
            }
        }
        else{
            if(sideFolded){
                sideFolded = false;
        
                $sideColumn.css(`transform`, ``);
                $sideBorder.css(`transform`, ``);
                $sideButton.css(`left`, `calc(50vw + 3.5px + 8px)`);
            }
            else{
                sideFolded = true;
        
                $sideColumn.css(`transform`, `translateX(-150vw)`);
                $sideBorder.css(`transform`, `translateX(-150vw)`);
                $sideButton.css(`left`, `8px`)
            }
        }
    }
    //
}

//-------------
let firstTouch, lastTouch, touchDist = 0, restraint = 1250;
function buttonEvents(){
    $sideButton.mouseover(mouseoverSideButton);
    $sideButton.mouseleave(mouseleaveSideButton);
    $sideButton.on(`mousedown touchstart`, mousedownSideButton);
    $(window).on(`mouseup touchend`, windowMouseupSideButton);
    $sideButton.on(`mouseup touchend`, mouseupSideButton);
}


//====
//variables
let flexContainer = document.getElementsByClassName(`row-flex-container`)[0];

let sideColumn = document.getElementsByClassName(`side-column-container`)[0];
let $sideColumn = $(`.side-column-container`);
let $sideButton = $(`#side-button`);
let $sideBorder = $(`#column-border`);

let buttonColor = `#a9bab7`;
let buttonImage = `url("../page-assets/logo.png")`;

//MAIN
let isMobileTablet = mobileAndTabletCheck();
//===
//resize
setSideColumnHeight();
resizeSide();
window.addEventListener(`resize`, setSideColumnHeight);
window.addEventListener(`resize`, resizeSide);

buttonEvents();
