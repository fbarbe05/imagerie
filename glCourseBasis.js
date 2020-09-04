
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();

var distCENTER;
// =====================================================



// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

var Obj3D = { fname:'obj', loaded:-1, shader:null, mesh:null, rMatrix:null, rotObjX:0, rotObjY:0 , tMatrix:null, posX:0, posY:0}; //ajouter une matrice de rotation et une de translation pour l'objet

// =====================================================
Obj3D.initAll = function()
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
Obj3D.setShadersParams = function()
{
	gl.useProgram(this.shader);

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
//ajouter l'envoie des matrice obj this ? 
Obj3D.setMatrixUniforms = function()
{
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		// mat4.identity(this.rMatrix);
		// mat4.identity(this.tMatrix);
		// mat4.translate(this.tMatrix, [0, 0.5, 0]);
		// mat4.rotate(this.rMatrix, this.rotObjY, [0, 0, 1]);
		// mat4.rotate(this.rMatrix, this.rotObjX, [1, 0, 0]);

		gl.uniformMatrix4fv(Obj3D.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.rObjMatrixUniform, false, this.rMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.tObjMatrixUniform, false, this.tMatrix);
}

// =====================================================
Obj3D.draw = function()
{
	if(this.shader && this.loaded==4 && this.mesh != null) {
		this.setShadersParams();
		this.setMatrixUniforms();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	}
}

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

	initGL(canvas);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);//pMatrix = matrice de projection perspective
	
	mat4.identity(rotMatrix); //initialise à l'identité
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]); //rotation en X
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]); //rotation en Y
	//rotMatrix permet de gérer la rotation de la scène 
	//il faut donc ajouter une autre matrice pour ajouter 
	// mat4.identity(Obj3D.rMatrix);
	// mat4.rotate(Obj3D.rMatrix, Obj3D.rotObjX, [1, 0, 0]);
	// mat4.rotate(Obj3D.rMatrix, Obj3D.rotObjY, [0, 0, 1]);
	//chaque objet obj devront avoir leur propre matrice de rotation et de translation 

	distCENTER = vec3.create([0,-0.2,-3]); //distance entre mon oeil et le centre de la scène
		
	Plane3D.initAll();
	Obj3D.initAll();

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
		gl.enable(gl.DEPTH_TEST); //test de la profondeur
		gl.enable(gl.CULL_FACE); //si la variable part vers l'arrière on n'affiche pas
		gl.cullFace(gl.BACK); //on enlève la face qui nous tourne le dos
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(OBJ3D)
{
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
		var tmpMesh = new OBJ.Mesh(xhttp.responseText);
		OBJ.initMeshBuffers(gl,tmpMesh);
		OBJ3D.mesh=tmpMesh;
    }
  }

  xhttp.open("GET", "bunny.obj", true);
  xhttp.send();
}


// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(Obj3D.loaded==2) {
				Obj3D.loaded ++;
				compileShaders(Obj3D);
				Obj3D.loaded ++;
			}
    }
  }
  //Shader compilé et utilisable lorsque loaded = 4
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.fname+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.fname+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.fname+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT);
	Plane3D.draw();
	Obj3D.draw();
}