
precision mediump float;

varying vec4 pos3D;
varying vec3 N;	
uniform vec3 Kd;
uniform float transpVal;

void main(void)
{
	vec3 col = Kd * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
	gl_FragColor = vec4(col,transpVal);
}



