varying float vNoise;
varying vec2 vUv;

uniform sampler2D t1;
uniform float time;

void main(){
  vec3 colorRed = vec3(1.0, 0.0, 0.0);
  vec3 colorGreen = vec3(0.0, 1.0, 0.0);
  vec3 colorBlue = vec3(0.0, 0.0, 1.0);

  vec3 finalColor = mix(colorBlue, colorGreen, 0.5 * (vNoise + 1.0));

  vec2 newUv = vUv;

  // newUv = vec2(newUv.x + 0.01 * sin(newUv.y * 10.0 + time), newUv.y);
  newUv = vec2(newUv.x, newUv.y + 0.01 * sin(newUv.x * 10.0 + time));

  vec4 texture1 = texture2D(t1, newUv);

  // gl_FragColor = vec4(finalColor, 1.0);
  gl_FragColor = vec4(vUv.x, vUv.y, 0.2, 1.0);

  // gl_FragColor = texture1 + 0.1 * vec4(vNoise, vNoise, 1.0, 0.0);
  // gl_FragColor = vec4(vNoise);
}