#version 300 es

precision mediump float;

in vec3 f_color;

out vec4 color;

uniform int u_time;

void main() {
    float shimmer = (sin(float(u_time)/1000.0f) + 1.0f) / 2.0f;
    color = vec4(f_color * shimmer, shimmer);
}