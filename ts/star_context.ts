import * as glh from "./gl_helpers.js";

export type StarRenderContext = {
    program: WebGLShader,
    vao: WebGLVertexArrayObject,
    nStars: number,
    updateShimmerTimer: (t: number) => void;
}

type Star = {
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    size: number,
    shimmerOffset: number
}

function getRandomStar(): Star {
    return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: Math.random(),
        g: Math.random() + 0.3,
        b: Math.random() + 0.5,
        size: Math.random() * 10,
        shimmerOffset: Math.random() * 6.28
    }
}

function getRandomStars(nStars: number): Star[] {
    return Array(nStars).fill(undefined).map(getRandomStar);
}

export function createStarContext(gl: WebGL2RenderingContext, nStars: number): Promise<StarRenderContext | null> {
    return glh.compileShaderProgram("./glsl/star.vert", "./glsl/star.frag", gl).then(starShaderProgram =>{
        if(starShaderProgram === null) {
            return null;
        } else {
            gl.useProgram(starShaderProgram);
            const uTimeLocation = gl.getUniformLocation(starShaderProgram, "u_time");
            if(uTimeLocation === null) {
                console.error("Failed to acquire u_time uniform location in star shader.");
                return null;
            } else {
                const stars = getRandomStars(nStars);
                const starVAO =  createStarVAO(gl, stars);
                if(starVAO === null) {
                    return null;
                } else {
                    return {
                        program: starShaderProgram,
                        vao: starVAO,
                        nStars: nStars,
                        updateShimmerTimer: (t: number) => gl.uniform1i(uTimeLocation, t)
                    }
                }
            }
        }
    });
}

function createStarVAO(gl: WebGL2RenderingContext, stars: Star[]): WebGLVertexArrayObject | null {
    const vao =  gl.createVertexArray();
    if(vao !== null) {
        gl.bindVertexArray(vao);
        const vbo = gl.createBuffer();
        if(vbo !== null) {

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.enableVertexAttribArray(2);

            // 4 bytes = 32 bit float
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 6*4, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6*4, 2*4);
            gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 6*4, 5*4);

            const bufferData: number[] = Array(stars.length * 36);

            const aspectRatio = gl.drawingBufferHeight/gl.drawingBufferWidth;

            for(const [i, star] of stars.entries()) {
                const xSize = star.size / gl.drawingBufferWidth;
                const ySize = xSize / aspectRatio;
    
                bufferData[i * 36 +  0] = star.x - xSize/2;
                bufferData[i * 36 +  1] = star.y - ySize/2;
                bufferData[i * 36 +  2] = star.r;
                bufferData[i * 36 +  3] = star.g;
                bufferData[i * 36 +  4] = star.b;
                bufferData[i * 36 +  5] = star.shimmerOffset;

                bufferData[i * 36 +  6] = star.x - xSize/2;
                bufferData[i * 36 +  7] = star.y + ySize/2;
                bufferData[i * 36 +  8] = star.r;
                bufferData[i * 36 +  9] = star.g;
                bufferData[i * 36 + 10] = star.b;
                bufferData[i * 36 + 11] = star.shimmerOffset;

                bufferData[i * 36 + 12] = star.x + xSize/2;
                bufferData[i * 36 + 13] = star.y + ySize/2;
                bufferData[i * 36 + 14] = star.r;
                bufferData[i * 36 + 15] = star.g;
                bufferData[i * 36 + 16] = star.b;
                bufferData[i * 36 + 17] = star.shimmerOffset;

                bufferData[i * 36 + 18] = star.x - xSize/2;
                bufferData[i * 36 + 19] = star.y - ySize/2;
                bufferData[i * 36 + 20] = star.r;
                bufferData[i * 36 + 21] = star.g;
                bufferData[i * 36 + 22] = star.b;
                bufferData[i * 36 + 23] = star.shimmerOffset;

                bufferData[i * 36 + 24] = star.x + xSize/2;
                bufferData[i * 36 + 25] = star.y + ySize/2;
                bufferData[i * 36 + 26] = star.r;
                bufferData[i * 36 + 27] = star.g;
                bufferData[i * 36 + 28] = star.b;
                bufferData[i * 36 + 29] = star.shimmerOffset;

                bufferData[i * 36 + 30] = star.x + xSize/2;
                bufferData[i * 36 + 31] = star.y - ySize/2;
                bufferData[i * 36 + 32] = star.r;
                bufferData[i * 36 + 33] = star.g;
                bufferData[i * 36 + 34] = star.b;
                bufferData[i * 36 + 35] = star.shimmerOffset;
            }

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
            return vao;
        } else {
            console.error("Failed to create star VBO");
            return null;
        }
    } else {
        console.error("Failed to create star VAO");
        return null;
    }
}