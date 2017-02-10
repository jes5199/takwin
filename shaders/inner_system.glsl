precision highp float;

const int program_size = 128;
const int stack_size = 16;

const float pi = acos(-1.0);

const int max_image = 5;

uniform bool is_vertical;  // = false;
uniform float sample_rate; // = 44100.0; // hz
uniform float frame_size;  // = 1024.0; // samples
float tick_length; //sec

uniform float program[program_size];
uniform int tick_count;

uniform sampler2D image0;
uniform sampler2D image1;
uniform sampler2D image2;
uniform sampler2D image3;
uniform sampler2D image4;
uniform sampler2D image5;

varying vec2 position;

float stack[stack_size];
int ptr = -1;

int waveform = 0;
int image = 0;
int visual = 0;

int sing_shade_count = 1;

float color = 0.5; // final output from program

// Jaś language keywords

const float o_wave = -0.1;
const float o_visualize = -0.15;
const float o_pixel = -0.2;
const float o_sample = -0.21;
const float o_plus = -0.3;
const float o_times = -0.4; // I almost called this o_ring
const float o_neg = -0.5;
const float o_flip = -0.55;
const float o_inv = -0.6;

const float l_now = -1.0;
const float l_tick_length = -1.1;
const float l_frame_size = -1.2;
const float l_pi = -1.3;
const float l_tau = -1.32;
const float l_sample_rate = -1.4;
const float l_resonance = -1.5;

const float set_wave = -2.0;
const float set_image = -2.1;
const float set_visual = -2.2;
const float set_shades = -2.21;

const float get_wave = -3.0;
const float get_image = -3.1;
const float get_visual = -3.2;
const float get_shades = -3.21;

const int w_sine = 0;
const int w_ramp = 1;
const int w_saw = 2;
const int w_tri = 3;
const int w_square = 4;

const int v_shade_sing = 0;


void init() {
  tick_length = frame_size / sample_rate;
}

// Waveform functions. Assumed to have a period of 1.0, and a range of -1.0..1.0

float sinewave(float x) {
  return sin(x * pi * 2.0);
}

float rampwave(float x) {
  return mod(x*2.0 + 1.0, 2.0) - 1.0;
}

float sawwave(float x) {
  return mod(-x*2.0 + 1.0, 2.0) - 1.0;
}

float squarewave(float x) {
  return sign(mod(x*2.0, 2.0) - 1.0);
}

float trianglewave(float x) {
  return abs(sawwave(x + 0.25)) * 2.0 - 1.0;
}


// Visualization functions.

float sing(float val, float height) {
  float n = (val + 1.0) / 2.0;

  float fshades = abs(float(sing_shade_count));
  float shade = n * fshades;
  float major_shade = floor(shade + 0.5);
  float shade_error = major_shade - shade;
  float sing = major_shade / fshades;
  if(shade_error > 0.0 && height < shade_error) {
    sing -= (1.0 / fshades) * sign(shade_error);
  } else if (shade_error < 0.0 && 1.0-height < -shade_error) {
    sing -= (1.0 / fshades) * sign(shade_error);
  }

  return (sing * 2.0 - 1.0) * sign(float(sing_shade_count));
}

float visualize(float x, float y) {
  if(visual == v_shade_sing) {
    return sing(x, y);
  }
  return 0.5;
}

vec4 sampleFromImage(float x, float y) {
  vec2 sample_position = vec2( mod(x, 1.0), mod(y, 1.0) );
  vec4 sample;
  if(image == 0) {
    sample = texture2D(image0, sample_position);
  } else if(image == 1) {
    sample = texture2D(image1, sample_position);
  } else if(image == 2) {
    sample = texture2D(image2, sample_position);
  } else if(image == 3) {
    sample = texture2D(image3, sample_position);
  } else if(image == 4) {
    sample = texture2D(image4, sample_position);
  } else if(image == 5) {
    sample = texture2D(image5, sample_position);
  }
  return sample;
}

float rgb2grey(vec3 c) {
    return (c.r + c.g + c.b) / 3.0;
}

float grayScale(vec4 pixel) {
  return rgb2grey(pixel.rgb) * pixel.a + 0.5 * (1.0 - pixel.a);
}

float pixel(float x, float y) {
  vec4 pixel = sampleFromImage(mod(x, 1.0), mod(-y, 1.0));
  return grayScale(pixel);
}

// Helper functions

float pos() {
  if(is_vertical) {
    return 1.0 - position.y;
  } else {
    return position.x;
  }
}

float latitude() {
  if(is_vertical) {
    return position.x;
  } else {
    return position.y;
  }
}

float now() {
  return (float(tick_count) + pos()) * tick_length;
}

// Stack operations

void push(float val) {
  ptr += 1;
  for(int i = 0; i < stack_size; i++) {
    if(i == ptr) {
      stack[i] = val;
    }
  }
}

float pop() {
  float val;
  if(ptr >= 0) {
    for(int i = 0; i < stack_size; i++) {
      if(i == ptr) {
        val = stack[i];
      }
    }
    ptr -= 1;
    return val;
  } else {
    return 0.;
  }
}

void run() {
  for(int i = 0; i < program_size; i++) {
    float instruction = program[i];
    if(instruction >= 0.) {
      // number literal
      push(instruction);
    } else if( ceil(instruction) == 0. ) {
      // waveform functions
      if(instruction == o_wave) {
        float x = pop();
        float y = x;
        if(waveform == w_sine) {
          y = sinewave(x);
        } else if(waveform == w_ramp) {
          y = rampwave(x);
        } else if(waveform == w_saw) {
          y = sawwave(x);
        } else if(waveform == w_square) {
          y = squarewave(x);
        } else if(waveform == w_tri) {
          y = trianglewave(x);
        }
        push(y);
      } else if(instruction == o_visualize) {
        // TODO: sample image at my latitude
        float x = pop();
        float y = latitude();
        push(visualize(x,y));
      } else if(instruction == o_pixel) {
        // TODO: sample image at my latitude
        float x = pop();
        float y = latitude();
        push(pixel(x, y));
      } else if(instruction == o_sample) {
        // TODO: sample image vertical band
        float x = pop();
        push(1.0);
      } else if(instruction == o_plus) {
        push(pop() + pop());
      } else if(instruction == o_times) {
        push(pop() * pop());
      } else if(instruction == o_neg) {
        push(0.0 - pop());
      } else if(instruction == o_flip) {
        push(1.0 - pop());
      } else if(instruction == o_inv) {
        push(1.0 / pop());
      }
    } else if( ceil(instruction) == -1. ) {
      // other literals and parameters
      if( instruction == l_now ) {
        push(now());
      } else if( instruction == l_tick_length) {
        push(tick_length);
      } else if( instruction == l_frame_size) {
        push(frame_size);
      } else if( instruction == l_pi) {
        push(pi);
      } else if( instruction == l_tau) {
        push(pi * 2.0);
      } else if( instruction == l_sample_rate) {
        push(sample_rate);
      } else if( instruction == l_resonance) {
        push(sample_rate / frame_size);
      }
    } else if( ceil(instruction) == -2. ) {
      // set settings
      float val = pop();
      if( instruction == set_wave ) {
        waveform = int(val);
      } else if(instruction == set_image) {
        image = int(max(min(val, float(max_image)), 0.0));
      } else if(instruction == set_visual) {
        visual = int(val);
      } else if(instruction == set_shades) {
        sing_shade_count = int(val);
      }
    } else if( ceil(instruction) == -3. ) {
      // get settings value
      float val;
      if( instruction == set_wave ) {
        val = float(waveform);
      } else if(instruction == set_image) {
        val = float(image);
      }
      push(val);
    }
  }
  color = (pop() + 1.0) / 2.0;
}

void done() {
  gl_FragColor.rgba = vec4(color,color,color,color);
}

void main() {
  // for old time's sake
  init();
  run();
  done();
}
