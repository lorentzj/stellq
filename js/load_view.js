import * as glh from "./gl_helpers.js";
import * as star from "./star_vao.js";
function createRenderLoop(gl, starContext, starShaderProgram) {
    const draw = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(starShaderProgram);
        gl.bindVertexArray(starContext.vao);
        gl.drawArrays(gl.POINTS, 0, starContext.nStars);
        requestAnimationFrame(draw);
    };
    draw();
}
document.body.onload = () => {
    const canvasElements = document.getElementsByTagName("canvas");
    if (canvasElements.length !== 0) {
        canvasElements[0].width = document.body.clientWidth;
        canvasElements[0].height = document.body.clientHeight * 3 / 4;
        const gl = canvasElements[0].getContext("webgl2");
        if (gl) {
            glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(starShaderProgram => {
                if (starShaderProgram !== null) {
                    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                    const stars = star.getRandomStars(100);
                    const starContext = star.createStarVAO(gl, stars);
                    if (starContext !== null) {
                        createRenderLoop(gl, starContext, starShaderProgram);
                    }
                }
            });
        }
        else {
            console.error("Failed to create WebGL2 context.");
        }
    }
    else {
        console.error("No canvas element found.");
    }
};
