"use strict";
exports.__esModule = true;
exports.compileShaderProgram = void 0;
function compileShaderProgram(vPath, fPath, gl) {
    var program = gl.createProgram();
    if (program === null) {
        return Promise.resolve(null);
    }
    else {
        return Promise.all([fetch(vPath), fetch(fPath)]).then(function (responses) {
            var vResponse = responses[0], fResponse = responses[1];
            if (vResponse.status !== 200) {
                console.error("Failed to retrieve vertex shader source: " + vResponse.statusText);
                return null;
            }
            if (fResponse.status !== 200) {
                console.log("Failed to retrieve fragment shader source: " + vResponse.statusText);
                return null;
            }
            return Promise.all([vResponse.text(), fResponse.text()]);
        }).then(function (source) {
            if (source === null) {
                return Promise.resolve(null);
            }
            else {
                var vSource = source[0], fSource = source[1];
                var vSuccess = attachShaderFromSource(vSource, program, gl, gl.VERTEX_SHADER);
                var fSuccess = attachShaderFromSource(fSource, program, gl, gl.FRAGMENT_SHADER);
                if (vSuccess && fSuccess) {
                    gl.linkProgram(program);
                    var programLog = gl.getProgramInfoLog(program);
                    if (programLog !== "") {
                        console.error("Failed to link shader program.");
                        console.error(programLog);
                        return null;
                    }
                    else {
                        return program;
                    }
                }
                else {
                    return null;
                }
            }
        });
    }
}
exports.compileShaderProgram = compileShaderProgram;
function attachShaderFromSource(source, program, gl, type) {
    var shader = gl.createShader(type);
    if (shader === null) {
        return false;
    }
    else {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var shaderLog = gl.getShaderInfoLog(shader);
        if (shaderLog !== "") {
            console.error("Failed to compile shader.");
            console.error(shaderLog);
            return false;
        }
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
        return true;
    }
}
