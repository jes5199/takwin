class GLProgrammer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = get_gl_context(canvas);

    this.ready = false;
    this.readyCallbacks = [];

    this.vertex_shader_source = null;
    this.fragment_shader_source = null;

    this.getVertexShader();
    this.getFragmentShader();
  }

  getCanvas() {
    return this.canvas;
  }

  fragmentShaderSource() {
    return "/takwin/shaders/inner_system.glsl";
  }

  getVertexShader() {
    var renderer = this;
    $.get({
      url: "/takwin/shaders/flat_rectangle.glsl",
      cache: true
    }, function(data) {
      renderer.vertex_shader_source = data;
      renderer.checkReady();
    });
  }

  getFragmentShader() {
    $.get({
      url: this.fragmentShaderSource(),
      cache: false
    }, function(data) {
      this.fragment_shader_source = data;
      this.checkReady();
    }.bind(this));
  }

  whenReady(f) {
    if(this.ready) {
      f();
    } else {
      this.readyCallbacks.push(f);
    }
  }

  checkReady() {
    if(
      this.vertex_shader_source
      && this.fragment_shader_source
    ) {
      this.ready = true;
      this.doReady();
    }
  }

  doReady() {
    while(this.readyCallbacks.length) {
      this.readyCallbacks.shift()();
    }
  }

  setFBO(fbo, width, height) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
  }

  setViewPort(settings) {
    this.gl.viewport(settings.x, settings.y, settings.width, settings.height);
  }

  setColorMask(mask) {
    this.gl.colorMask.apply(this.gl, mask);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  program() {
    if(!this.ready){ return; }
    if(this._program) {
      this.gl.useProgram(this._program);
      return this._program;
    }
    this._program = build_program(this.gl, this.vertex_shader(), this.fragment_shader());
    this.gl.useProgram(this._program);
    assign_positions(this.gl, this._program, "position3D", this.square_vertex_triangles());
    return this._program;
  }

  square_vertex_triangles() {
    return [
      0, 0,   1, 1,   0, 1,
      0, 0,   1, 1,   1, 0,
    ];
  }

  shader_template_variables() {
    return {};
  }

  fragment_shader() {
    if(this._fragment_shader) {return this._fragment_shader;}
    var src = this.fragment_shader_source;
    var values = this.shader_template_variables();
    for(name in values) {
      var r = new RegExp("\\$" + name, "g");
      src = src.replace(r, values[name]);
    }
    this._fragment_shader = compile_fragment_shader(this.gl, src);
    return this._fragment_shader;
  }

  vertex_shader() {
    if(this._vertex_shader) {return this._vertex_shader;}
    this._vertex_shader = compile_vertex_shader(this.gl, this.vertex_shader_source);
    return this._vertex_shader;
  }

  getUniformLocation(name) {
    let program = this.program();
    return this.gl.getUniformLocation(program, name);
  }

  setUniformInt(name, val) {
    var loc = this.getUniformLocation(name);
    this.gl.uniform1i(loc, val);
  }

  setUniformFloat(name, val) {
    var loc = this.getUniformLocation(name);
    this.gl.uniform1f(loc, val);
  }

  setUniformFloatArray(name, vals) {
    var loc = this.getUniformLocation(name);
    this.gl.uniform1fv(loc, vals);
  }

  setUniformMatrix4Float(name, vals) {
    var loc = this.getUniformLocation(name);
    vals.length = 16;
    this.gl.uniformMatrix4fv(loc, false, vals);
  }

  fullAlpha() {
    this.setColorMask([false, false, false, true]);
    this.gl.clearColor(0.5, 0.5, 0.5, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
