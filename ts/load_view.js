"use strict";
exports.__esModule = true;
var star = require("./star_context.js");
function createRenderLoop(gl, starContext) {
    var draw = function () {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(starContext.program);
        gl.bindVertexArray(starContext.vao);
        gl.drawArrays(gl.POINTS, 0, starContext.nStars);
        requestAnimationFrame(draw);
    };
    draw();
}
document.body.onload = function () {
    var canvasElements = document.getElementsByTagName("canvas");
    if (canvasElements.length !== 0) {
        canvasElements[0].width = document.body.clientWidth;
        canvasElements[0].height = document.body.clientHeight * 3 / 4;
        var gl_1 = canvasElements[0].getContext("webgl2");
        if (gl_1) {
            star.createStarContext(gl_1).then(function (starContext) {
                if (starContext !== null) {
                    createRenderLoop(gl_1, starContext);
                }
            });
            //     glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(starShaderProgram =>{
            //         if(starShaderProgram !== null) {
            //             const uTimeLocation = gl.getUniformLocation(starShaderProgram, "u_time");
            //             if(uTimeLocation !== null) {
            //                 gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            //                 const stars = star.getRandomStars(1000);
            //                 const starContext =  star.createStarVAO(gl, stars);
            //                 if(starContext !== null) {
            //                     createRenderLoop(gl, starContext, starShaderProgram);
            //                 }    
            //             }
            //         }
            //     });
            //
        }
        else {
            console.error("Failed to create WebGL2 context.");
        }
    }
    else {
        console.error("No canvas element found.");
    }
};
