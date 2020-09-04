// =====================================================
// FONCTIONS SUPPLEMENTAIRES, MODIF COULEUR FOND
// ça va falloir le mettre dans un nouveau document avec toutes les fonctions pour l'interface
// =====================================================

// =====================================================

function manageSlider(theSlider, theValue){
	var slider = document.getElementById(theSlider); 
	var val = document.getElementById(theValue); 
	val.innerHTML = slider.value;
	
	if (theSlider == "li")
		Li = slider.value;
	else if (theSlider == "lobe")
		n = slider.value;
	else if (theSlider == "ks")
		Ks = slider.value;
	Object3D.setShadersParams();
	//gl.clearColor(0.7, 0.7, 0.7, bar.value);
}

function changeDiffuse(theKd){
	var kdHex = document.getElementById(theKd).value;
	var ksElt = document.getElementById("ks");

	kdHex = kdHex.replace('#','');
    var r = parseInt(kdHex.substring(0,2), 16)/255.0;
    var g = parseInt(kdHex.substring(2,4), 16)/255.0;
    var b = parseInt(kdHex.substring(4,6), 16)/255.0;

	//parseInt((cutHex(h)).substring(0,2),16)
	Kd = [r,g,b];
	
	var max = Math.trunc(Math.min(1-r, 1-g, 1-b)*100)/100;
	ksElt.value = Math.min(ksElt.value, max);
	ksElt.max = max;
	document.getElementById("ksVal").innerHTML = ksElt.value;
	document.getElementById("ksMax").innerHTML = "Max : "+ksElt.max;
	
	Object3D.setShadersParams();
}


function changeSkin(theTexture){
	if (theTexture) {
		useTex = 1;
	}
	else
		useTex = 0;

	Object3D.setShadersParams();
}

function changeShape(theShape){
	objName = theShape;
	verifTex();
	Object3D.initAll();
}

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