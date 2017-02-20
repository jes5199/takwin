precision highp float;

varying vec2 position;

uniform sampler2D image;

void main() {
  int acc = 0;
  vec4 sample;

  for(int i = 0; i < $HEIGHT; i++) {
    sample = texture2D(image, vec2(position.x, float(i) / float(height)));
    acc += int(sample.r * 255.0);
    acc += int(sample.g * 255.0);
    acc += int(sample.b * 255.0);
    acc += int(sample.a * 255.0);
  }
  float amp = float(acc) / ($HEIGHT.0 * 255.0 * 4.0 / 2.0) - 1.0;
  gl_FragColor.rgba = vec4(amp, amp, amp, amp);
}
