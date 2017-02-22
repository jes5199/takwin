'use strict';

class Painter {
  constructor(canvas, orientation, width, height, render_to_texture) {
    this.canvas = canvas;
    this.orientation = orientation;
    // TODO: default to canvas width/height
    this.width = width;
    this.height = height;

    this.renderer = new Renderer(canvas, render_to_texture, width, height);
    this.compiler = new JasCompiler();
  }

  getCanvas() {
    return this.renderer.getCanvas();
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  output_texture_number() {
    return this.renderer.output_texture_number();
  }

  setImage(n, img) {
    this.renderer.setImage(n, img);
  }

  whenReady(f) {
    this.renderer.whenReady(f);
  }

  dimensionsForBand(band) {
    if(this.orientation == "vertical") {
      return {
        x: band.offset * this.width,
        y: 0,
        width: band.size * this.width,
        height: this.height
      };
    } else {
      return {
        x: 0,
        y: band.offset * this.height,
        width: this.width,
        height: band.size * this.height,
      };
    }
  }

  maskForChannel(channel) {
    switch(channel) {
      case "x": return [true, false, false, false];
      case "y": return [false, true, false, false];
      case "z": return [false, false, true, false];
      case "w": return [false, false, false, true];
    }
  }

  paint(data, tick_count) {
    this.renderer.clear();

    for(var k in data.bands) {
      var band = data.bands[k];

      var settings = {};
      Object.assign(settings, this.dimensionsForBand(band));
      settings.mask = this.maskForChannel(band.channel);
      settings.sample_rate = 44100; // TODO: pass this in from audio context or whatever
      settings.is_vertical = (this.orientation == "vertical");
      settings.frame_size = settings.is_vertical ? this.height : this.width;

      var program = this.compiler.compile(band.program);

      this.renderer.render(settings, program, tick_count);
    }
  }
}
