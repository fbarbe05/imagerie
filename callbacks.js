

// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotY = 0;
var rotX = -1; //environ 1/3 de pi 

// =====================================================
window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback,
									/* DOMElement Element */ element)
         {
            window.setTimeout(callback, 1000/60);
         };
})();

// ==========================================
function tick() {
	requestAnimFrame(tick);
	drawScene();
}

// =====================================================
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}


// =====================================================
function handleMouseWheel(event) {

	distCENTER[2] += event.deltaY/10.0;
}

// =====================================================
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}


// =====================================================
function handleMouseUp(event) {
	mouseDown = false;
}


// =====================================================
function handleMouseMove(event) {
	
	if (!mouseDown) return;

	var newX = event.clientX;
	var newY = event.clientY;	
	var deltaX = newX - lastMouseX;
	var deltaY = newY - lastMouseY;
	var posX;
	var posY;
	
	if(event.shiftKey) {
		distCENTER[2] += deltaY/100.0;
	} else if(event.ctrlKey){

		lapin.rotObjY += degToRad(deltaX / 5);
		lapin.rotObjX += degToRad(deltaY / 5);

		mat4.identity(lapin.rMatrix);
		mat4.rotate(lapin.rMatrix, lapin.rotObjX, [1, 0, 0]);
		mat4.rotate(lapin.rMatrix, lapin.rotObjY, [0, 0, 1]);

	}else if(event.altKey){
		
		lapin.posX += deltaX/200; 
		lapin.posY += deltaY/200;

		mat4.identity(lapin.tMatrix);
		mat4.translate(lapin.tMatrix, [lapin.posX, -lapin.posY, 0]);
		
	}else {

		rotY += degToRad(deltaX / 5);
		rotX += degToRad(deltaY / 5);

		mat4.identity(rotMatrix);
		mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
		mat4.rotate(rotMatrix, rotY, [0, 0, 1]);
	}
	
	lastMouseX = newX
	lastMouseY = newY;
}
