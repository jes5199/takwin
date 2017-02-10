'use strict';

function get_gl_context(canvas) {
  console.log(canvas);
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

