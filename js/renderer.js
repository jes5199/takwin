'use strict';

// TODO: library style

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = get_gl_context(canvas);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.ready = false;
    this.readyCallbacks = [];

    this.vertex_shader_source = null;
    this.fragment_shader_source = null;

    this.getVertexShader();
    this.getFragmentShader();
  }

  checkReady() {
    if(
      this.vertex_shader_source
      && this.fragment_shader_source
    ) {
      console.log("got ready");
      this.ready = true;
      this.doReady();
    }
  }

  getVertexShader() {
    var renderer = this;
    $.get({
      url: "/shaders/flat_rectangle.glsl",
      cache: false
    }, function(data) {
      console.log("got vertex");
      renderer.vertex_shader_source = data;
      renderer.checkReady();
    });
  }

  getFragmentShader() {
    var renderer = this;
    $.get({
      url: "/shaders/inner_system.glsl",
      cache: false
    }, function(data) {
      console.log("got fragment");
      renderer.fragment_shader_source = data;
      renderer.checkReady();
    });
  }

  doReady() {
    while(this.readyCallbacks.length) {
      this.readyCallbacks.pop()();
    }
  }

  whenReady(f) {
    if(this.ready) {
      f();
    } else {
      this.readyCallbacks.push(f);
    }
  }

  vertex_shader() {
    if(this._vertex_shader) {return this._vertex_shader;}
    this._vertex_shader = compile_vertex_shader(this.gl, this.vertex_shader_source);
    return this._vertex_shader;
  }

  fragment_shader() {
    if(this._fragment_shader) {return this._fragment_shader;}
    this._fragment_shader = compile_fragment_shader(this.gl, this.fragment_shader_source);
    return this._fragment_shader;
  }

  program() {
    if(this._program) {return this._program;}
    this._program = build_program(this.gl, this.vertex_shader(), this.fragment_shader());
    assign_positions(this.gl, this._program, "position3D", this.square_vertex_triangles());
    return this._program;
  }

  getUniformLocation(name) {
    let program = this.program();
    this.gl.useProgram(program);
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

  setUniforms(settings, program, tick_count) {
    this.setUniformInt("is_vertical", settings.is_vertical);
    this.setUniformFloat("sample_rate", settings.sample_rate);
    this.setUniformFloat("frame_size", settings.frame_size);
    this.setUniformFloatArray("program", program);
    this.setUniformInt("tick_count", tick_count);
  }

  setFBO(fbo) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
  }

  setViewPort(settings) {
    this.gl.viewport(settings.x, settings.y, settings.width, settings.height);
  }

  setColorMask(mask) {
    if(!mask) {
      this.gl.colorMask([true, true, true, true]);
    } else {
      this.gl.colorMask.apply(this.gl, mask);
    }
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  render(settings, program, tick_count) {
    if(!this.ready){ return false; }

    this.setUniforms(settings, program, tick_count);
    this.setFBO(null);
    this.setViewPort(settings);
    this.setColorMask(settings.mask);
    this.draw();

    return true;
  }

  fullAlpha() {
    this.gl.colorMask.apply(this.gl, [false, false, false, true]);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  square_vertex_triangles() {
    return [
      0, 0,   1, 1,   0, 1,
      0, 0,   1, 1,   1, 0,
    ];
  }
}
