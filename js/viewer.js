class Viewer extends GLProgrammer {
  constructor(receiver) {
    super(receiver.getCanvas());

    // if this is null, then we didn't render to texture
    // probably that's a requirement
    this.texture_number = receiver.output_texture_number();

    this.receiver = receiver;

    //this.height = receiver.getHeight();
    //this.width = receiver.getWidth();
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
      this.receiver.getColors() ||
      [ 1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
      ]);

    this.setColorMask([true, true, true, true]);
    this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.setColorMask([true, true, true, false]);
    this.draw();
  }
}
