class Audializer extends GLProgrammer {
  constructor(main) {
    super(main.getCanvas());

    // if this is null, then we didn't render to texture
    // probably that's a requirement
    this.texture_number = main.output_texture_number();

    this.height = main.getHeight();
  }

  shader_template_variables() {
    return {
      HEIGHT: this.height,
    };
  }


  fragmentShaderSource() {
    return "/takwin/shaders/sum.glsl";
  }
}
