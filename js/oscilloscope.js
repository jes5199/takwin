class Oscilloscope extends GLProgrammer {
  constructor(audializer, height) {
    super(audializer.getCanvas());

    this.texture_number = audializer.output_texture_number();

    this.width = audializer.getWidth();
    this.height = height;
  }

  shader_template_variables() {
    return {
      HEIGHT: this.height,
    };
  }

  fragmentShaderSource() {
    return "/takwin/shaders/oscilloscope.glsl";
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
