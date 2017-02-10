precision mediump float;
attribute vec4 position3D;

varying vec2 position;

void main() {
  position = position3D.xy;
  gl_Position = 2.0 * position3D - 1.0;
}
