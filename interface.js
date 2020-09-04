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
	var shape = document.getElementById("filepicker").value.split("\\")[2].replace(".obj","");
	var id = shape;
	
	// Add radio button in the page
	let listObj = document.getElementById("listingObj");
	
	let newObj = document.createElement("label");
	newObj.innerText = shape;
	newObj.setAttribute('class', 'container');
	
	var radioInput = document.createElement('input');
	radioInput.setAttribute('type', 'radio');
	radioInput.setAttribute('checked', 'checked');
	radioInput.setAttribute('name', 'shape');
	radioInput.setAttribute('id', id);
	radioInput.setAttribute('onclick', 'selectObject(\''+shape+'\');');

	var span = document.createElement('span');
	span.setAttribute('class', 'checkmark');

	newObj.appendChild(radioInput);
	newObj.appendChild(span);
	listObj.appendChild(newObj);

	// add object in tabObj
	tabObj[id] = new Obj3D('obj', shape, -1, null, null, null, null, 0, 0, 0, 0, 0);
	selectObject(id);
	
	// reload
	tabObj[id].initAll();
}

function selectObject($id) {
	// select current object
	for(var key in tabObj) {
		tabObj[key].selected = 0;
	}
	tabObj[$id].selected = 1;
}