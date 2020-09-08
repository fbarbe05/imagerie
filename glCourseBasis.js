// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();

var distCENTER;
// =====================================================
var tabObj = [];
var transp = false;
var transpVal = 1.0;
// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================
class Obj3D {
	constructor(fname, shape, loaded, shader, mesh, rMatrix, tMatrix, rotObjX, rotObjY, posX, posY, selected, r, v, b) {
		this.fname = fname;
		this.shape = shape;
		this.loaded = loaded;
		this.shader = shader;
		this.mesh = mesh;
		this.meshAct = false;
		this.rMatrix = rMatrix;
		this.tMatrix = tMatrix;
		this.rotObjX = rotObjX;
		this.rotObjY = rotObjY;
		this.posX = posX;
		this.posY = posY;
		this.selected = selected;
		this.r = r;
		this.v = v;
		this.b = b;
	}

	// =====================================================
	initAll()
	{
		this.vBuffer = gl.createBuffer();
		this.rMatrix = mat4.create();
		mat4.identity(this.rMatrix);
		this.tMatrix = mat4.create();
		mat4.identity(this.tMatrix);
		loadObjFile(this);
		loadShaders(this);
	}

	// =====================================================
	setShadersParams()
	{
		gl.useProgram(this.shader);

		gl.uniform3fv(gl.getUniformLocation(this.shader, "Kd"), [this.r, this.v, this.b]);
		gl.uniform1f(gl.getUniformLocation(this.shader, "transpVal"), transpVal);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.rObjMatrixUniform = gl.getUniformLocation(this.shader, "uObjRMatrix");
		this.shader.tObjMatrixUniform = gl.getUniformLocation(this.shader, "uObjTMatrix");
	}



	// =====================================================
	//ajouter l'envoie des matrice obj this 
	setMatrixUniforms()
	{
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, distCENTER);
			mat4.multiply(mvMatrix, rotMatrix);

			// mat4.identity(this.rMatrix);
			// mat4.identity(this.tMatrix);
			// mat4.translate(this.tMatrix, [0, 0.5, 0]);
			// mat4.rotate(this.rMatrix, this.rotObjY, [0, 0, 1]);
			// mat4.rotate(this.rMatrix, this.rotObjX, [1, 0, 0]);

			gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
			gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
			gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(this.shader.rObjMatrixUniform, false, this.rMatrix);
			gl.uniformMatrix4fv(this.shader.tObjMatrixUniform, false, this.tMatrix);
	}

	// =====================================================
	draw()
	{
		if(this.shader && this.loaded==4 && this.mesh != null) {
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			if(this.meshAct)
				gl.drawElements(gl.LINES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			else
				gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}
// =====================================================
lapin = new Obj3D('obj', "bunny", -1, null, null, null, null, 0, 0, 0, 0, 1, 0.8, 0.1, 0.1);
tabObj["bunny1"] = lapin;
var tmpKd = {'r':0.8, 'v':0.4, 'b':0.4}; // temporary registered color of the selected object

// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

var Plane3D = { fname:'plane', loaded:-1, shader:null };

// =====================================================
Plane3D.initAll = function()
{

	vertices = [
		-0.7, -0.7, 0.0,
		 0.7, -0.7, 0.0,
		 0.7,  0.7, 0.0,
		-0.7,  0.7, 0.0
	]; //position

	texcoords = [
		0.0,0.0,
		0.0,1.0,
		1.0,1.0,
		1.0,0.0
	]; //coordonnées de texture

	this.vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer.itemSize = 3;
	this.vBuffer.numItems = 4;

	this.tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	this.tBuffer.itemSize = 2;
	this.tBuffer.numItems = 4;

	loadShaders(this);
}


// =====================================================
Plane3D.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
	gl.enableVertexAttribArray(this.shader.vAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
	gl.enableVertexAttribArray(this.shader.tAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
	gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
}

// =====================================================
Plane3D.setMatrixUniforms = function() 
{
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, distCENTER);
	mat4.multiply(mvMatrix, rotMatrix);
	gl.uniformMatrix4fv(Plane3D.shader.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(Plane3D.shader.mvMatrixUniform, false, mvMatrix);
}
//pour un objet tous les sommets subissent les mêmes matrices

// =====================================================
Plane3D.draw = function()
{
	if(this.shader && this.loaded==4) {		
		this.setShadersParams();
		this.setMatrixUniforms();
		
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
		gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems); //ligne vue de dessous
	}
}

// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================

// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	//on fait d'abord la rotation et ensuite la translation 
	//dans opengl ce n'est pas la caméra qui bouge ce sont les objets

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;
	document.onkeydown = check;
	document.onkeyup = checkDefaut;

	initGL(canvas);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);//pMatrix = matrice de projection perspective
	
	mat4.identity(rotMatrix); //initialise à l'identité
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]); //rotation en X
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]); //rotation en Y
	//rotMatrix permet de gérer la rotation de la scène 
	//il faut donc ajouter une autre matrice pour ajouter 
	//chaque objet obj devront avoir leur propre matrice de rotation et de translation 

	distCENTER = vec3.create([0,-0.2,-3]); //distance entre mon oeil et le centre de la scène


	Plane3D.initAll();
	for(var key in tabObj) {
		tabObj[key].initAll();
	}

	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl"); //C'est ce qui va permettre de dessiner dans la fenêtre 
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height); //Je dessine dans la totalité du canvas

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		if(!transp)
			gl.enable(gl.DEPTH_TEST); //test de la profondeur
			gl.enable(gl.CULL_FACE); //si la variable part vers l'arrière on n'affiche pas
			gl.cullFace(gl.BACK); //on enlève la face qui nous tourne le dos
		if(transp) {
			gl.enable(gl.BLEND); //active la transparence
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(myObj)
{
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
		var tmpMesh = new OBJ.Mesh(xhttp.responseText);
		OBJ.initMeshBuffers(gl,tmpMesh, myObj.meshAct);
		myObj.mesh=tmpMesh;
	}
  }
  
  xhttp.open("GET","Obj/"+myObj.shape+".obj", true);
  xhttp.send();
}


// =====================================================
function loadShaders(myObj) {
	loadShaderText(myObj,'.vs');
	loadShaderText(myObj,'.fs');
}

// =====================================================
function loadShaderText(myObj,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { myObj.vsTxt = xhttp.responseText; myObj.loaded ++; }
			if(ext=='.fs') { myObj.fsTxt = xhttp.responseText; myObj.loaded ++; }
			if(myObj.loaded==2) {
				myObj.loaded ++;
				compileShaders(myObj);
				myObj.loaded ++;
			}
    }
  }
  //Shader compilé et utilisable lorsque loaded = 4
  
  myObj.loaded = 0;
  xhttp.open("GET", myObj.fname+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(myObj)
{
	myObj.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(myObj.vshader, myObj.vsTxt);
	gl.compileShader(myObj.vshader);
	if (!gl.getShaderParameter(myObj.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+myObj.fname+".vs");
		console.log(gl.getShaderInfoLog(myObj.vshader));
	}

	myObj.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(myObj.fshader, myObj.fsTxt);
	gl.compileShader(myObj.fshader);
	if (!gl.getShaderParameter(myObj.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+myObj.fname+".fs");
		console.log(gl.getShaderInfoLog(myObj.fshader));
	}

	myObj.shader = gl.createProgram();
	gl.attachShader(myObj.shader, myObj.vshader);
	gl.attachShader(myObj.shader, myObj.fshader);
	gl.linkProgram(myObj.shader);
	if (!gl.getProgramParameter(myObj.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(myObj.shader));
	}
}


// =====================================================
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT);
	Plane3D.draw();
	for(var key in tabObj) {
		tabObj[key].draw();
	}
	
	
}