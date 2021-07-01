#version 300 es

precision highp float;

in vec3 f_color;
in float f_shimmer_offset;

uniform int u_time;

out vec4 color;

void main() {
    float shimmer = (sin(float(u_time)/1000.0f + f_shimmer_offset) + 1.0f) / 1.5f;
    color = vec4(f_color * shimmer, shimmer);
}