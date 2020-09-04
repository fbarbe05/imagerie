attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
//ajouter 2 matrices 
uniform mat4 uObjRMatrix;
uniform mat4 uObjTMatrix;

varying vec4 pos3D;
varying vec3 N;

void main(void) {
	//mettre les nouvelles matrices à droite : mv translation rotation 
	//pos3D = uMVMatrix * uObjTMatrix * uObjRMatrix * vec4(aVertexPosition,1.0); //position 3D avant projection dans l'espace caméra
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0); //position 3D avant projection dans l'espace caméra
	//pos3D = uMVMatrix * vec4(aVertexPosition,1.0); //position 3D avant projection dans l'espace caméra
	//ne jamais appliquer de translation sur un vecteur normal
	//ajouter la rotation à droite 
	N = vec3(uRMatrix * uObjRMatrix * vec4(aVertexNormal,1.0)); //normale du sommet aussi interpolé ou on va appliquer la matrice de rotation 
	//N = vec3(uRMatrix * vec4(aVertexNormal,1.0)); //normale du sommet aussi interpolé ou on va appliquer la matrice de rotation 
	gl_Position = uPMatrix * uMVMatrix * uObjTMatrix * uObjRMatrix * vec4(aVertexPosition,1.0);
}
