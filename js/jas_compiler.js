class JasCompiler {
  constructor() {
    this.keywordEncodings = {
      zero: -0.001, "0": -0.001,
      wave: -0.1,
      vis: -0.15, viz: -0.15, visualize: -0.15,
      pixel: -0.2, image: -0.2,
      sample: -0.21,
      plus: -0.3, "+": -0.3,
      times: -0.4, "*": -0.4,
      neg: -0.5, "-": -0.5,
      flip: -0.55, "1-" : -0.55,
      inv: -0.6, "/": -0.6, "1/": -0.6,

      now: -1.0,
      tick_length: -1.1,
      frame_size: -1.2,
      pi: -1.3,
      tau: -1.32,
      sample_rate: -1.4,
      resonance: -1.5,

      set_wave: -2.0,
      set_image: -2.1,
      set_visual: -2.2,
      set_shades: -2.21,

      get_wave: -3.0,
      get_image: -3.1,
      get_visual: -3.2,
      get_shades: -3.21,

      sine: 0,
      ramp: 1,
      saw: 2,
      tri: 3,
      square: 4,

      sing: 0,
    };
  }

  tokenize(text) {
    return text.split(/ +/);
  }

  encode(token) {
    var number = parseFloat(token);
    if(token in this.keywordEncodings) {
      return this.keywordEncodings[token];
    } else {
      if( number == 0 ) {
        return this.keywordEncodings["0"];
      }
      return number;
    }
  }

  compile(text) {
    var tokens = this.tokenize(text);
    return tokens.map(t => this.encode(t));
  }
}
