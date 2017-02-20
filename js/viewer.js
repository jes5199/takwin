class Viewer extends GLProgrammer {
  constructor(main) {
    super(main.getCanvas());

    // if this is null, then we didn't render to texture
    // probably that's a requirement
    this.texture_number = main.output_texture_number();

    //this.height = main.getHeight();
    //this.width = main.getWidth();
  }

  fragmentShaderSource() {
    return "/takwin/shaders/viewer.glsl";
  }

  view() {
    if(!this.ready){ return false; }
    this.setFBO(null);
    this.setViewPort({x:0, y:100, width:1024, height:512}); // TODO: parameterize
    this.setColorMask([true, true, true, true]);
    this.setUniformInt("image", this.texture_number);

    this.setUniformMatrix4Float(
      "colorTransform",
      receiver.data.colors ||
      [ 1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
      ]);

    this.setColorMask([true, true, true, true]);
    this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.setColorMask([true, true, true, false]);
    this.draw();
    //this.fullAlpha();
    //this.gl.clearColor(0.0, 0.0, 0.0, 1);
  }
}
