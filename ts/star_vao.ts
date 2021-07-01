type Star = {
    x: number,
    y: number
}

export type StarRenderContext = {
    vao: WebGLVertexArrayObject,
    nStars: number;
}

export function getRandomStar(): Star {
    return {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1}
}

export function getRandomStars(nStars: number): Star[] {
    return Array(nStars).fill(undefined).map(getRandomStar);
}

export function createStarVAO(gl: WebGL2RenderingContext, stars: Star[]): StarRenderContext | null {
    const vao =  gl.createVertexArray();
    if(vao !== null) {
        gl.bindVertexArray(vao);
        const vbo = gl.createBuffer();
        if(vbo !== null) {

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.enableVertexAttribArray(0);

            // 4 bytes = 32 bit float, so stride is 2*4 bytes
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 2*4, 0);

            const bufferData: number[] = Array(stars.length * 2);
            for(const [i, star] of stars.entries()) {
                bufferData[i * 2    ] = star.x
                bufferData[i * 2 + 1] = star.y;
            }

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Float32Array(bufferData)), gl.STATIC_DRAW);
            return {vao: vao, nStars: stars.length};
        } else {
            console.error("Failed to create star VBO");
            return null;
        }
    } else {
        console.error("Failed to create star VAO");
        return null;
    }
}