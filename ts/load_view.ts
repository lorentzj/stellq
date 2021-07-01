import * as star from "./render_stars.js";
import * as player from "./player.js";

function createRenderLoop(gl: WebGL2RenderingContext, starContext: star.StarRenderContext, playerState: player.PlayerState) {
    let prevTime = (new Date()).getTime();

    const draw = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        star.renderStars(gl, starContext);

        const currentTime = (new Date()).getTime();
        const deltaT = currentTime - prevTime;
        prevTime = currentTime;

        playerState.update(deltaT);
        requestAnimationFrame(draw);
    }

    draw();
}

document.body.onload = () => {
    const canvasElements = document.getElementsByTagName("canvas");
    if(canvasElements.length !== 0) {
        const canvas = canvasElements[0];
        const cWidth = Math.round(document.body.clientWidth);
        const cHeight = Math.round(document.body.clientHeight * 0.75);

        canvas.style.width = cWidth.toString() + "px";
        canvas.style.height = cHeight.toString() + "px";

        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.round(cWidth * devicePixelRatio);
        canvas.height = Math.round(cHeight * devicePixelRatio);

        const gl = canvas.getContext("webgl2", {premultipliedAlpha: false});
        if(gl) {
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            star.createStarContext(gl, 500).then(starContext => {
                if(starContext !== null) {

                    const playerState = new player.PlayerState();

                    createRenderLoop(gl, starContext, playerState);
                }
            });
        } else {
            console.error("Failed to create WebGL2 context.");
        }
    } else {
        console.error("No canvas element found.");
    }
}