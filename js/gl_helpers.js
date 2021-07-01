export function compileShaderProgram(vPath, fPath, gl) {
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
                const vSuccess = attachShaderFromSource(vSource, program, gl, gl.VERTEX_SHADER);
                const fSuccess = attachShaderFromSource(fSource, program, gl, gl.FRAGMENT_SHADER);
                if (vSuccess && fSuccess) {
                    gl.linkProgram(program);
                    const programLog = gl.getProgramInfoLog(program);
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
function attachShaderFromSource(source, program, gl, type) {
    const shader = gl.createShader(type);
    if (shader === null) {
        return false;
    }
    else {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const shaderLog = gl.getShaderInfoLog(shader);
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
