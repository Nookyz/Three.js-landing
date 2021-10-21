varying float vNoise;
varying vec2 vUv;

uniform sampler2D uImage;
uniform float time;

void main(){
  vec2 newUv = vUv;

  vec4 texture = texture2D(uImage, newUv);

  gl_FragColor = vec4(vUv.x, vUv.y, 0.2, 1.0);

  // gl_FragColor = vec4(vNoise, 0., 0., 1.0);
  gl_FragColor = texture;
  gl_FragColor.rgb += 0.04 * vec3(vNoise);
}