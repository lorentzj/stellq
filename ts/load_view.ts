import * as glh from "./gl_helpers.js";

type Point = {
    x: number,
    y: number
}

function getRandomPoint(): Point {
    return {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1}
}

function createRenderLoop(gl: WebGL2RenderingContext, starVAO: WebGLVertexArrayObject, starShaderProgram: WebGLProgram) {
    const draw = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        gl.useProgram(starShaderProgram);
        gl.bindVertexArray(starVAO);
    
        gl.drawArrays(gl.POINTS, 0, 2);
        requestAnimationFrame(draw);
    }

    draw();
}

document.body.onload = () => {
    const canvasElements = document.getElementsByTagName("canvas");
    if(canvasElements.length !== 0) {
        canvasElements[0].width = document.body.clientWidth;
        canvasElements[0].height = document.body.clientHeight*3/4;
        const gl = canvasElements[0].getContext("webgl2");
        if(gl) {
            glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(starShaderProgram =>{
                if(starShaderProgram !== null) {
                    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

                    const starVAO =  gl.createVertexArray();
                    if(starVAO !== null) {
                        gl.bindVertexArray(starVAO);
                        const starVBO = gl.createBuffer();
                        if(starVBO !== null) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, starVBO);

                            gl.enableVertexAttribArray(0);
                            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2*4, 0);

                            const positions = new Float32Array([0, 0.5, 0.3, -0.3]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

                            createRenderLoop(gl, starVAO, starShaderProgram);
                        } else {
                            console.error("Failed to create star VBO");
                        }
                    } else {
                        console.error("Failed to create star VAO");
                    }
                }
            });
        } else {
            console.error("Failed to create WebGL2 context.");
        }
    } else {
        console.error("No canvas element found.");
    }
};