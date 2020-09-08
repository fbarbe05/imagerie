

// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotY = 0;
var rotX = -1; //environ 1/3 de pi 
var selectedKeyR;
var selectedKeyH;
var selectedKeyV;

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
	
	for(var key in tabObj) {
		if (tabObj[key].selected == 1) 
			selectedObj = tabObj[key];
	}
	
	if(event.shiftKey) {
		distCENTER[2] += deltaY/100.0;
	} 
	else if(selectedKeyR){

		selectedObj.rotObjY += degToRad(deltaX / 5);
		selectedObj.rotObjX += degToRad(deltaY / 5);

		mat4.identity(selectedObj.rMatrix);
		//mat4.rotate(selectedObj.rMatrix, selectedObj.rotObjX, [1, 0, 0]);
		mat4.rotate(selectedObj.rMatrix, selectedObj.rotObjY, [0, 0, 1]);
	}
	else if(selectedKeyH){
		
		selectedObj.posX += deltaX/200; 
		selectedObj.posY += deltaY/200;

		mat4.identity(selectedObj.tMatrix);
		mat4.translate(selectedObj.tMatrix, [selectedObj.posX, -selectedObj.posY, -selectedObj.posZ]);
	}
	else if(selectedKeyV){
		
		//selectedObj.posX += deltaX/200; 
		selectedObj.posZ += deltaY/200;

		mat4.identity(selectedObj.tMatrix);
		mat4.translate(selectedObj.tMatrix, [selectedObj.posX, -selectedObj.posY, max(-selectedObj.posZ, 0)]);
	}
	else {
		rotY += degToRad(deltaX / 5);
		rotX += degToRad(deltaY / 5);

		mat4.identity(rotMatrix);
		mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
		mat4.rotate(rotMatrix, rotY, [0, 0, 1]);
	}
	
	lastMouseX = newX
	lastMouseY = newY;
}

//Fonction vérifiant si une touche est enfoncée
function check(event){
	if(event.key == "h"){
		selectedKeyH = true;
		document.getElementById("hkey").checked = true;
	}
	else if(event.key == "v"){
		selectedKeyV = true;
		document.getElementById("vkey").checked = true;
	}
	else if(event.key == "r"){
		selectedKeyR = true;
		document.getElementById("rkey").checked = true;
	}
}
//Fonction vérifiant si un touche est relachée --> elle pourrait être modifier si l'utilisateur 
//ne veut pas garder les touches enfoncées pour interagir avec l'interface
function checkDefaut(){
	selectedKeyH = false;
	selectedKeyR = false;
	selectedKeyV = false;
	document.getElementById("defaut").checked = true;
}

function max(a, b) {
	if(a > b)
		return a;
	else
		return b;
}