#version 300 es

precision highp float;

out vec4 color;

void main() {
    color = vec4(1, 1, 1, 1);
}

//uniform int u_time;

//void main() {
//    float shimmer = (sin(float(u_time)/1000.0f) + 1.0f) / 2.0f;
//    color = vec4(f_color * shimmer, shimmer);
//}