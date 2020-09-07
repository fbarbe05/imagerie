// =====================================================
// FONCTIONS SUPPLEMENTAIRES, MODIF COULEUR FOND
// =====================================================

// =====================================================

function verifTex(){
	var monImage = new Image();
	monImage.src = "Skin/"+objName+".jpg";
	monImage.onerror = function(){
		document.getElementById("colorId").select();
		document.getElementById("textId").disabled = "disabled";
		document.getElementById("textId").checked = "";
		document.getElementById("colorId").checked = "checked";
		useTex = 0;
	}
	monImage.onload = function(){
		document.getElementById("textId").disabled = "";
	}
}

function addObject() {
	// choosing unused id
	var shape = document.getElementById("filepicker").value.split("\\")[2].replace(".obj","");
	var i = 0;
	while (typeof tabObj[shape+i] !== 'undefined')
		i ++;
	var id = shape+i;
	
	// add radio button in the page
	let listObj = document.getElementById("listingObj");
	
	let newObj = document.createElement("label");
	newObj.innerText = shape;
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
	tabObj[id] = new Obj3D('obj', shape, -1, null, null, null, null, 0, 0, 0, 0, 0, 0.8, 0.4, 0.4);
	selectObject(id);
	
	// reload
	tabObj[id].initAll();
}

function removeObj(id) {
	delete tabObj[id];
	document.getElementById('label'+id).remove();
	console.log('label'+id+" will be removed");
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

function changeDiffuse(theKd){
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

function manageSlider(theSlider, theValue){
	var slider = document.getElementById(theSlider); 
	var val = document.getElementById(theValue); 
	val.innerHTML = slider.value;
	
	transpVal = slider.value;
}

