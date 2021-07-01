import * as star from "./star_context.js";
function createRenderLoop(gl, starContext) {
    const draw = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        starContext.updateShimmerTimer((new Date()).getTime());
        gl.useProgram(starContext.program);
        gl.bindVertexArray(starContext.vao);
        gl.drawArrays(gl.POINTS, 0, starContext.nStars);
        requestAnimationFrame(draw);
    };
    draw();
}
document.body.onload = () => {
    const canvasElements = document.getElementsByTagName("canvas");
    if (canvasElements.length !== 0) {
        const canvas = canvasElements[0];
        const cWidth = Math.round(document.body.clientWidth);
        const cHeight = Math.round(document.body.clientHeight * 0.75);
        canvas.style.width = cWidth.toString() + "px";
        canvas.style.height = cHeight.toString() + "px";
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.round(cWidth * devicePixelRatio);
        canvas.height = Math.round(cHeight * devicePixelRatio);
        const gl = canvas.getContext("webgl2");
        if (gl) {
            star.createStarContext(gl, 1000).then(starContext => {
                if (starContext !== null) {
                    createRenderLoop(gl, starContext);
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
