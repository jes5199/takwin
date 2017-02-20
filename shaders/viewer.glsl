precision highp float;

varying vec2 position;

uniform sampler2D image;

uniform mat4 colorTransform;

void main() {
  vec4 pattern = texture2D(image, position);
  vec4 colors = (pattern - 0.5) * colorTransform + 0.5;
  gl_FragColor.rgba = vec4(colors.rgb, 1.0);
}
