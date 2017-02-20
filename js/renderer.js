'use strict';

// TODO: library style

let program_size = 128;

class Renderer extends GLProgrammer {
  constructor(canvas, render_to_texture, width, height) {
    super(canvas);
    this.width = width || 1024;
    this.height = height || 512;

    this.imageTextures = [
      this.gl.TEXTURE0,
      this.gl.TEXTURE1,
      this.gl.TEXTURE2,
      this.gl.TEXTURE3,
      this.gl.TEXTURE4,
      this.gl.TEXTURE5,
    ];
    for(var i = 0; i < this.imageTextures.length; i++) {
      var img = new Image(8,8);
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

      this.initImageTexture(this.imageTextures[i]);
      this.setImage(i, img);
    }

    if(render_to_texture) {
      this.targetTexture = this.gl.TEXTURE6;
      this.initTargetTexture();
    }

    this.whenReady( this.setImageUniforms.bind(this) );
  }

  fragmentShaderSource() {
    return "/takwin/shaders/inner_system.glsl";
  }

  getCanvas() {
    return this.canvas;
  }

  getHeight() {
    return this.height;
  }

  output_texture_number() {
    if(this.targetTexture) {
      return 6; // see TEXTURE6 above
    }
  }

  initImageTexture(texture) {
    make_texture(this.gl, texture, "linear");
  }

  initTargetTexture() {
    var texture = make_texture(this.gl, this.targetTexture, "nearest");
    make_texture_surface(this.gl, this.targetTexture, this.width, this.height, false);
    this.fbo = make_framebuffer(this.gl, texture);
    this.setFBO(this.fbo);
  }

  setImageUniforms() {
    for(var i = 0; i < this.imageTextures.length; i++) {
      var imageLocation = this.gl.getUniformLocation(this.program(), "image" + i);
      this.setUniformInt(imageLocation, i);
    }
  }

  setImage(n, image) {
    let gl = this.gl;
    gl.activeTexture(this.imageTextures[n]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  setUniforms(settings, jas_program, tick_count) {
    this.setUniformInt("is_vertical", settings.is_vertical);
    this.setUniformFloat("sample_rate", settings.sample_rate);
    this.setUniformFloat("frame_size", settings.frame_size);

    this.setUniformFloatArray("program", (new Array(program_size)).fill(NaN));
    this.setUniformFloatArray("program", jas_program);

    this.setUniformInt("tick_count", tick_count);
  }

  setTargetFBO() {
    if(this.targetTexture) {
    } else {
      this.setFBO(null);
    }
  }

  render(settings, program, tick_count) {
    if(!this.ready){ return false; }

    this.setUniforms(settings, program, tick_count);
    this.setTargetFBO();
    this.setViewPort(settings);
    this.setColorMask(settings.mask);
    this.draw();

    return true;
  }

  clear() {
    this.setColorMask([true, true, true, true]);
    this.gl.clearColor(0.5, 0.5, 0.5, 0.5);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
