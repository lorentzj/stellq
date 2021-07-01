"use strict";
exports.__esModule = true;
exports.createStarContext = void 0;
var glh = require("./gl_helpers.js");
function getRandomStar() {
    return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: Math.random(),
        g: Math.random() + 0.3,
        b: Math.random() + 0.5
    };
}
function getRandomStars(nStars) {
    return Array(nStars).fill(undefined).map(getRandomStar);
}
function createStarContext(gl, nStars) {
    return glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(function (starShaderProgram) {
        if (starShaderProgram === null) {
            return null;
        }
        else {
            var stars = getRandomStars(nStars);
            var starVAO = createStarVAO(gl, stars);
            if (starVAO === null) {
                return null;
            }
            else {
                return {
                    program: starShaderProgram,
                    vao: starVAO,
                    nStars: nStars
                };
            }
        }
    });
}
exports.createStarContext = createStarContext;
function createStarVAO(gl, stars) {
    var vao = gl.createVertexArray();
    if (vao !== null) {
        gl.bindVertexArray(vao);
        var vbo = gl.createBuffer();
        if (vbo !== null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            // 4 bytes = 32 bit float
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 5 * 4, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
            var bufferData = Array(stars.length * 5);
            for (var _i = 0, _a = stars.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], star = _b[1];
                bufferData[i * 5 + 0] = star.x;
                bufferData[i * 5 + 1] = star.y;
                bufferData[i * 5 + 2] = star.r;
                bufferData[i * 5 + 3] = star.g;
                bufferData[i * 5 + 4] = star.b;
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
            return vao;
        }
        else {
            console.error("Failed to create star VBO");
            return null;
        }
    }
    else {
        console.error("Failed to create star VAO");
        return null;
    }
}
