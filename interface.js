// =====================================================
// FONCTIONS SUPPLEMENTAIRES
// =====================================================

// =====================================================

function addObject(input) {
	if(input == 'filePic') {
		
		var shapes = document.getElementById("filepicker").value.split("\\");
		var shape = shapes[shapes.length-1].replace(".obj","");
	}
	else 
		shape = input;

	// choosing unused id
	var i = 0;
	while (typeof tabObj[shape+i] !== 'undefined')
		i ++;
	var id = shape+i;
	// add radio button in the page
	let listObj = document.getElementById("listingObj");
	
	let newObj = document.createElement("label");
	newObj.innerText = shape+" ";
	newObj.setAttribute('class', 'container');
	newObj.setAttribute('id', 'label'+id);
	
	var radioInput = document.createElement('input');
	radioInput.setAttribute('type', 'radio');
	radioInput.setAttribute('checked', 'checked');
	radioInput.setAttribute('name', 'shape');
	radioInput.setAttribute('id', id);
	radioInput.setAttribute('onclick', 'selectObject(\''+id+'\');');

	var span = document.createElement('span');
	span.setAttribute('class', 'checkmark');

	var button = document.createElement('button');
	button.setAttribute('onclick', 'removeObj(\''+id+'\')');
	var img = document.createElement('img');
	img.setAttribute('src', 'img/close.png');
	img.setAttribute('style', 'height: 20px;');

	button.appendChild(img);

	newObj.appendChild(radioInput);
	newObj.appendChild(span);
	newObj.appendChild(button);
	listObj.appendChild(newObj);

	// add object in tabObj
	tabObj[id] = new Obj3D('obj', shape, -1, null, null, null, null, 0, 0, 0, 0, 0, 0, 0.8, 0.4, 0.4);
	selectObject(id);
	
	// reload
	tabObj[id].initAll();
}


function removeObj(id) {
	delete tabObj[id];
	document.getElementById('label'+id).remove();
	console.log('label'+id+" will be removed");
	
	// verifies if an object is selected
	var obselec = false;
	for(var key in tabObj) {
		if (tabObj[key].selected == 1)
			obselec = true;
	}
	// select first object in the tab
	if(obselec == false) {
		id = Object.keys(tabObj)[0];
		selectObject(id);
		document.getElementById(id).checked = true;
	}
}

function selectObject(id) {
	// unselect previous selected object
	for(var key in tabObj) {
		if (tabObj[key].selected == 1) {
			tabObj[key].r = tmpKd['r'];
			tabObj[key].v = tmpKd['v'];
			tabObj[key].b = tmpKd['b'];
			tabObj[key].selected = 0;
		}
	}
	// select current object
	tabObj[id].selected = 1;
	
	// check mesh activation
	var objMesh = document.getElementById('meshAct');
	if(tabObj[id].meshAct)
		objMesh.checked = true;
	else
		objMesh.checked = false;
	
	// change color to selected
	invertColor();
}

function invertColor() {
	// unselect previous selected object
	for(var key in tabObj) {
		if (tabObj[key].selected == 1) {
			id = key;
		}
	}

	// register current color
	tmpKd['r'] = tabObj[id].r;
	tmpKd['v'] = tabObj[id].v;
	tmpKd['b'] = tabObj[id].b;
	// change color to red
	tabObj[id].r = 0.8;
	tabObj[id].v = 0.1;
	tabObj[id].b = 0.1;
}

function changeColor(theKd){
	var kdHex = document.getElementById(theKd).value;
	var objSelec;
	for(var key in tabObj) {
		if (tabObj[key].selected == 1) {
			objSelec = tabObj[key];
		}
	}

	kdHex = kdHex.replace('#','');
    objSelec.r = parseInt(kdHex.substring(0,2), 16)/255.0;
	objSelec.v = parseInt(kdHex.substring(2,4), 16)/255.0;
	objSelec.b = parseInt(kdHex.substring(4,6), 16)/255.0;
	
	objSelec.setShadersParams();
}

function activeTransp() {
	if(!transp) {
		if(document.getElementById("meshAct").checked){
			document.getElementById("meshAct").checked = false;
			activeMesh();
		}
		transp = true;
		transpVal = 0.5;
		var inputTransp = document.createElement('input');
		inputTransp.setAttribute('type', 'range');
		inputTransp.setAttribute('id', 'inTransp');
		inputTransp.setAttribute('value', '0.5');
		inputTransp.setAttribute('min', '0.0');
		inputTransp.setAttribute('max', '0.9');
		inputTransp.setAttribute('step', '0.1');
		inputTransp.setAttribute('oninput', 'manageSlider(\'inTransp\', \'labTransp\');');

		var labelTransp = document.createElement('label');
		labelTransp.setAttribute('id', 'labTransp');
		labelTransp.innerText = 0.5;

		//document.getElementById("transp").appendChild(document.createElement('br'));
		document.getElementById("transp").appendChild(inputTransp);
		document.getElementById("transp").appendChild(labelTransp);
	}
	else {
		transp = false
		transpVal = 1.0;

		var inputTransp = document.getElementById("inTransp");
		var labelTransp = document.getElementById("labTransp");

		document.getElementById("transp").removeChild(inputTransp);
		document.getElementById("transp").removeChild(labelTransp);
	}
	var canvas = document.getElementById("WebGL-test");
	initGL(canvas);
}

function activeMesh() {
	for(var key in tabObj) {
		if (tabObj[key].selected == 1)
			myObjSelec = tabObj[key];
	}
	
	if(myObjSelec.meshAct) {
		myObjSelec.meshAct = false;
		loadObjFile(myObjSelec);
	}
	else {
		if(document.getElementById("trs").checked){
			document.getElementById("trs").checked = false;
			activeTransp();
		}
		myObjSelec.meshAct = true;
		OBJ.initMeshBuffers(gl,myObjSelec.mesh, myObjSelec.meshAct);
	}
}

function manageSlider(theSlider, theValue){
	var slider = document.getElementById(theSlider); 
	var val = document.getElementById(theValue); 
	val.innerHTML = slider.value;
	
	transpVal = slider.value;
}

//Fonction vérifiant si une touche est enfoncée
function checkKey(event){
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
function checkDefault(){
	selectedKeyH = false;
	selectedKeyR = false;
	selectedKeyV = false;
	document.getElementById("defaut").checked = true;
}