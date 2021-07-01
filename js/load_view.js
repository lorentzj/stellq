import * as star from "./star_context.js";
function createRenderLoop(gl, starContext) {
    const draw = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        starContext.updateShimmerTimer((new Date()).getTime());
        gl.useProgram(starContext.program);
        gl.bindVertexArray(starContext.vao);
        gl.drawArrays(gl.TRIANGLES, 0, starContext.nStars * 6);
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
        const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
        if (gl) {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            star.createStarContext(gl, 500).then(starContext => {
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
