class Oscilloscope extends GLProgrammer {
  constructor(audializer, height) {
    super(audializer.getCanvas());

    // if this is null, then we didn't render to texture
    // probably that's a requirement
    this.texture_number = audializer.output_texture_number();

    this.width = audializer.getWidth();
    this.height = height;

    this.targetTexture = this.gl.TEXTURE9;
    this.initTargetTexture();
  }

  shader_template_variables() {
    return {
      HEIGHT: this.height,
    };
  }

  fragmentShaderSource() {
    return "/takwin/shaders/oscilloscope.glsl";
  }

  initTargetTexture() {
    var texture = make_texture(this.gl, this.targetTexture, "nearest");
    make_texture_surface(this.gl, this.targetTexture, this.width, this.height, true);
    this.fbo = make_framebuffer(this.gl, texture);
  }

  view() {
    if(!this.ready){ return false; }
    this.setFBO(null);
    this.setViewPort({x:0, y:0, width:this.width, height:this.height});
    this.setColorMask([true, true, true, true]);
    this.setUniformInt("image", this.texture_number);
    this.draw();
  }
}
