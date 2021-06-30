import * as glh from "./gl_helpers.js";

document.body.onload = () => {
    const canvasElements = document.getElementsByTagName("canvas");
    if(canvasElements.length !== 0) {
        const gl = canvasElements[0].getContext("webgl2");
        if(gl) {
            glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(program =>{
                if(program !== null) {
                    console.log("Successfully loaded WebGL shader program.");
                    console.log(program);
                }
            });
        } else {
            console.error("Could not create WebGL2 context.");
        }
    } else {
        console.error("No canvas element found.");
    }
};