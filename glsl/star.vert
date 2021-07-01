#version 300 es

layout (location = 0) in vec2 position;
layout (location = 1) in vec3 color;
layout (location = 2) in float shimmer_offset;

out float f_shimmer_offset;
out vec3 f_color;

void main() {
    f_color = color;
    f_shimmer_offset = shimmer_offset;
    gl_Position = vec4(position, 0.0f, 1.0f);
}