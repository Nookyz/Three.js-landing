varying float vNoise;
varying vec2 vUv;

void main(){
  vec3 colorRed = vec3(1.0, 0.0, 0.0);
  vec3 colorGreen = vec3(0.0, 1.0, 0.0);
  vec3 colorBlue = vec3(0.0, 0.0, 1.0);

  vec3 finalColor = mix(colorBlue, colorGreen, 0.5 * (vNoise + 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}