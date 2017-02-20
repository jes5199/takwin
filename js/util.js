'use strict';

function get_gl_context(canvas) {
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return gl;
}

function compile_vertex_shader(gl, text) {
  var vertex_shader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex_shader, text);
  gl.compileShader(vertex_shader);

  var success = gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS);
  if (!success) {
    console.log(gl.getShaderInfoLog(vertex_shader));
  }
  return vertex_shader;
}

function compile_fragment_shader(gl, text){
  var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment_shader, text);
  gl.compileShader(fragment_shader);

  var success = gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS);
  if (!success) {
    console.log(gl.getShaderInfoLog(fragment_shader));
  }
  return fragment_shader;
}

function build_program(gl, vertex_shader, fragment_shader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertex_shader);
  gl.attachShader(program, fragment_shader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.log(gl.getProgramInfoLog(program));
  }
  return program;
}

function assign_positions(gl, program, attribute, positions) {
  var positionAttributeLocation = gl.getAttribLocation(program, attribute);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
          positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
}

function make_texture(gl, texture_slot, zoom) {
  var texture = gl.createTexture();
  gl.activeTexture(texture_slot);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  if(!zoom || zoom == "nearest") {
    zoom = gl.NEAREST;
  } else if(zoom == "linear") {
    zoom = gl.LINEAR;
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, zoom);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, zoom);

  return texture;
}

function make_texture_surface(gl, texture_slot, width, height, floating_point, image) {
  gl.activeTexture(texture_slot);

  var pixel_type = floating_point ? gl.FLOAT : gl.UNSIGNED_BYTE;
  image = image || null;

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, pixel_type, image);
}

function make_framebuffer(gl, texture_obj) {
  var fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_obj, 0);

  return fbo;
}
