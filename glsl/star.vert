#version 300 es

layout (location = 0) in vec2 position;
layout (location = 1) in vec3 v_color;

out vec3 f_color;

void main() {
    gl_Position = vec4(position, 0.0f, 1.0f);
    f_color = v_color;
}