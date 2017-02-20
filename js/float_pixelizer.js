class FloatPixelizer extends GLProgrammer {
  constructor(audializer, height) {
    super(audializer.getCanvas());

    this.texture_number = audializer.output_texture_number();

    this.width = audializer.getWidth();
    this.height = 1;

    this.targetTexture = this.gl.TEXTURE9;
    this.initTargetTexture();

    this.flipEndian = this.littleEndianness();

    this.buffer = new ArrayBuffer(this.width * this.height * 4);
    this.data = new Float32Array(this.buffer);
    this.pixels = new Uint8Array(this.buffer);
  }

  littleEndianness () {
    var b = new ArrayBuffer(4);
    var a = new Uint32Array(b);
    var c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] == 0xef) return true;
    if (c[0] == 0xde) return false;
    throw new Error('unknown endianness');
  }

  output_texture_number() {
    return 9; //see TEXTURE9 above
  }

  fragmentShaderSource() {
    return "/takwin/shaders/float_pixelizer.glsl";
  }

  initTargetTexture() {
    var texture = make_texture(this.gl, this.targetTexture, "nearest");
    make_texture_surface(this.gl, this.targetTexture, this.width, this.height, false);
    this.fbo = make_framebuffer(this.gl, texture);
  }

  convert() {
    if(!this.ready){ return false; }
    this.setFBO(this.fbo);
    this.setViewPort({x:0, y:0, width:this.width, height:this.height});
    this.setColorMask([true, true, true, true]);
    this.setUniformInt("image", this.texture_number);
    this.setUniformInt("flipEndian", this.flipEndian);
    this.draw();
  }

  getData() {
    this.setFBO(this.fbo);
    this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixels);
    return this.data;
  }
}
