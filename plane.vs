//Pour chaque pixel il appelle le fragment
attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;

uniform mat4 uMVMatrix; //model view = rotation translation
uniform mat4 uPMatrix;

varying vec2 texCoords; //initialisé ici mais utilisé dans le fragment 

void main(void) {
	texCoords = aTexCoords;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
