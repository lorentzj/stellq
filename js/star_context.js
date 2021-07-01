import * as glh from "./gl_helpers.js";
function getRandomStar() {
    return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: Math.random(),
        g: Math.random() + 0.3,
        b: Math.random() + 0.5,
        size: Math.random() * 10,
        shimmerOffset: Math.random() * 6.28
    };
}
function getRandomStars(nStars) {
    return Array(nStars).fill(undefined).map(getRandomStar);
}
export function createStarContext(gl, nStars) {
    return glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(starShaderProgram => {
        if (starShaderProgram === null) {
            return null;
        }
        else {
            gl.useProgram(starShaderProgram);
            const uTimeLocation = gl.getUniformLocation(starShaderProgram, "u_time");
            if (uTimeLocation === null) {
                console.error("Failed to acquire u_time uniform location in star shader.");
                return null;
            }
            else {
                const stars = getRandomStars(nStars);
                const starVAO = createStarVAO(gl, stars);
                if (starVAO === null) {
                    return null;
                }
                else {
                    return {
                        program: starShaderProgram,
                        vao: starVAO,
                        nStars: nStars,
                        updateShimmerTimer: (t) => gl.uniform1i(uTimeLocation, t)
                    };
                }
            }
        }
    });
}
function createStarVAO(gl, stars) {
    const vao = gl.createVertexArray();
    if (vao !== null) {
        gl.bindVertexArray(vao);
        const vbo = gl.createBuffer();
        const ebo = gl.createBuffer();
        if (vbo !== null && ebo !== null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.enableVertexAttribArray(2);
            // 4 bytes = 32 bit float
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 6 * 4, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 2 * 4);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 6 * 4, 5 * 4);
            // 4 verts per quad (because of instancing), 6 floats per vert
            const vertBufferData = Array(stars.length * 4 * 6);
            const elementBufferData = Array(stars.length * 1 * 6);
            const aspectRatio = gl.drawingBufferHeight / gl.drawingBufferWidth;
            for (const [i, star] of stars.entries()) {
                elementBufferData[i * 6 + 0] = i * 4 + 0;
                elementBufferData[i * 6 + 1] = i * 4 + 1;
                elementBufferData[i * 6 + 2] = i * 4 + 2;
                elementBufferData[i * 6 + 3] = i * 4 + 0;
                elementBufferData[i * 6 + 4] = i * 4 + 2;
                elementBufferData[i * 6 + 5] = i * 4 + 3;
                const xSize = star.size / gl.drawingBufferWidth;
                const ySize = xSize / aspectRatio;
                vertBufferData[i * 24 + 0] = star.x - xSize / 2;
                vertBufferData[i * 24 + 1] = star.y - ySize / 2;
                vertBufferData[i * 24 + 2] = star.r;
                vertBufferData[i * 24 + 3] = star.g;
                vertBufferData[i * 24 + 4] = star.b;
                vertBufferData[i * 24 + 5] = star.shimmerOffset;
                vertBufferData[i * 24 + 6] = star.x - xSize / 2;
                vertBufferData[i * 24 + 7] = star.y + ySize / 2;
                vertBufferData[i * 24 + 8] = star.r;
                vertBufferData[i * 24 + 9] = star.g;
                vertBufferData[i * 24 + 10] = star.b;
                vertBufferData[i * 24 + 11] = star.shimmerOffset;
                vertBufferData[i * 24 + 12] = star.x + xSize / 2;
                vertBufferData[i * 24 + 13] = star.y + ySize / 2;
                vertBufferData[i * 24 + 14] = star.r;
                vertBufferData[i * 24 + 15] = star.g;
                vertBufferData[i * 24 + 16] = star.b;
                vertBufferData[i * 24 + 17] = star.shimmerOffset;
                vertBufferData[i * 24 + 18] = star.x + xSize / 2;
                vertBufferData[i * 24 + 19] = star.y - ySize / 2;
                vertBufferData[i * 24 + 20] = star.r;
                vertBufferData[i * 24 + 21] = star.g;
                vertBufferData[i * 24 + 22] = star.b;
                vertBufferData[i * 24 + 23] = star.shimmerOffset;
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertBufferData), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(elementBufferData), gl.STATIC_DRAW);
            return vao;
        }
        else {
            console.error("Failed to create star VBO and EBO");
            return null;
        }
    }
    else {
        console.error("Failed to create star VAO");
        return null;
    }
}
