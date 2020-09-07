
precision mediump float;

varying vec4 pos3D;
varying vec3 N;

void main(void)
{
	vec3 col = vec3(0.8,0.4,0.4) * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
	gl_FragColor = vec4(col,0.5); //alpha = transparence

}
//////////////////// transparence ////////////////////////////
//il faut prendre en compte la position du triangle transparent (avant / arrière)
// activer gl enable de gl blind 
// activer fonction a qui on dit l'opération à faire 
// on peut fixer à la main la valeur de alpha 
// le blinding fait après le fragment shader

/////////////////// fil de fer ///////////////////////////
// reparcourir la géométrie --> mesh 
// = refaire un draw = il faut un nouvel objet qui prend en entré le mesh de l'objet obj 

/////////////////// fil de fer en enlevant les fil arrières ////////////////
// rendu avec la profondeur activée des triangles 
// rendu en fil de fer avec la profondeur en affichant que les fil avant 
// appliquer une homtétie pour agrandir les fils de fer ou changer la profondeur de la ligne 

//////////////////////partie cachée en option////////////////

