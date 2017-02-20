class Audializer extends GLProgrammer {
  constructor(main) {
    super(main.getCanvas());

    // if this is null, then we didn't render to texture
    // probably that's a requirement
    this.texture_number = main.output_texture_number();

    this.height = main.getHeight();
    this.width = main.getWidth();

    this.targetTexture = this.gl.TEXTURE7;
    this.initTargetTexture();
  }

  output_texture_number() {
    return 7; // see TEXTURE7 above
  }

  getWidth() {
    return this.width;
  }

  shader_template_variables() {
    return {
      HEIGHT: this.height,
    };
  }

  fragmentShaderSource() {
    return "/takwin/shaders/sum.glsl";
  }

  initTargetTexture() {
    var texture = make_texture(this.gl, this.targetTexture, "nearest");
    make_texture_surface(this.gl, this.targetTexture, this.width, 1, true);
    this.fbo = make_framebuffer(this.gl, texture);
  }

  convert() {
    if(!this.ready){ return false; }
    this.setUniformInt("image", this.texture_number);
    this.setFBO(this.fbo);
    this.setViewPort({x: 0, y:0, width: this.width, height: 1});
    this.setColorMask([true, true, true, true]);
    this.draw();
  }
}
