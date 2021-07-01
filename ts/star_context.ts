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
    shimmerOffset: number
}

function getRandomStar(): Star {
    return {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        r: Math.random(),
        g: Math.random() + 0.3,
        b: Math.random() + 0.5,
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

            const bufferData: number[] = Array(stars.length * 6);
            for(const [i, star] of stars.entries()) {
                bufferData[i * 6 + 0] = star.x
                bufferData[i * 6 + 1] = star.y;
                bufferData[i * 6 + 2] = star.r;
                bufferData[i * 6 + 3] = star.g;
                bufferData[i * 6 + 4] = star.b;
                bufferData[i * 6 + 5] = star.shimmerOffset;
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