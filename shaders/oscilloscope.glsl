precision highp float;

varying vec2 position;

uniform sampler2D image;

void main() {
  int acc = 0;
  vec4 sample;
  float color = 0.0;

  sample = texture2D(image, vec2(position.x, 0));
  float y = (2.0 * position.y) - 1.0;

  if(y > sample.r) {
    if( sample.r < 0.0 && y < 0.0){
      color = 1.0;
    }
  } else {
    if( sample.r > 0.0 && y > 0.0){
      color = 1.0;
    }
  }

  gl_FragColor.rgba = vec4(0.0, color, 0.0, color);
}
