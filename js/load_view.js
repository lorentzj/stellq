"use strict";
function load_view() {
    const canvasElements = document.getElementsByTagName("canvas");
    if (canvasElements.length !== 0) {
        const gl = canvasElements[0].getContext("webgl2");
        if (gl) {
            compileShaderProgram("/glsl/star.vert", "/glsl/star.frag", gl);
        }
        else {
            console.error("Could not create WebGL2 gl.");
        }
    }
    else {
        console.error("No canvas element found.");
    }
}
function compileShaderProgram(vPath, fPath, gl) {
    const program = gl.createProgram();
    if (program === null) {
        return Promise.resolve(null);
    }
    else {
        return Promise.all([fetch(vPath), fetch(fPath)]).then(responses => {
            const [vResponse, fResponse] = responses;
            if (vResponse.status !== 200) {
                console.error(`Failed to retrieve vertex shader source: ${vResponse.statusText}`);
                return null;
            }
            if (fResponse.status !== 200) {
                console.log(`Failed to retrieve fragment shader source: ${vResponse.statusText}`);
                return null;
            }
            return Promise.all([vResponse.text(), fResponse.text()]);
        }).then(source => {
            if (source === null) {
                return Promise.resolve(null);
            }
            else {
                const [vSource, fSource] = source;
                const vShader = gl.createShader(gl.VERTEX_SHADER);
                const fShader = gl.createShader(gl.FRAGMENT_SHADER);
                if (vShader === null || fShader === null) {
                    console.error("Failed to create shader objects.");
                }
                else {
                    gl.shaderSource(vShader, vSource);
                    gl.compileShader(vShader);
                    const vShaderLog = gl.getShaderInfoLog(vShader);
                    if (vShaderLog !== "") {
                        console.error("Failed to compile vertex shader.");
                        console.error(vShaderLog);
                        return null;
                    }
                    gl.attachShader(program, vShader);
                    gl.deleteShader(vShader);
                    gl.shaderSource(fShader, fSource);
                    gl.compileShader(fShader);
                    const fShaderLog = gl.getShaderInfoLog(fShader);
                    if (fShaderLog !== "") {
                        console.error("Failed to compile fragment shader.");
                        console.error(fShaderLog);
                        return null;
                    }
                    gl.attachShader(program, fShader);
                    gl.deleteShader(fShader);
                    gl.linkProgram(program);
                    const programLog = gl.getProgramInfoLog(program);
                    if (programLog !== "") {
                        console.error("Failed to link shader program.");
                        console.error(programLog);
                        return null;
                    }
                    return program;
                }
            }
            return null;
        });
    }
}
document.body.onload = load_view;
