varying float vNoise;
varying vec2 vUv;

uniform sampler2D uImage;
uniform float time;
uniform float hoverState;

void main(){
  vec2 newUv = vUv;

  vec2 p = newUv;
  float x = hoverState;
  x = smoothstep(.0,1.0,(x*2.0+p.y-1.0));
  vec4 f = mix(
    texture2D(uImage, (p-.5)*(1.-x)+.5), 
    texture2D(uImage, (p-.5)*x+.5), 
    x);

  vec4 texture = texture2D(uImage, newUv);

  // gl_FragColor = vec4(vUv.x, vUv.y, 0.2, 1.0);

  // gl_FragColor = vec4(vNoise, 0., 0., 1.0);
  // gl_FragColor = texture;
  gl_FragColor = f;
  gl_FragColor.rgb += 0.04 * vec3(vNoise);
}