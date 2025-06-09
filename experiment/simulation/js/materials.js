"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

function vertexShader() {
    return `varying vec3 vUv; 
      
                  void main() {
                    vUv = position; 
      
                    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewPosition; 
                  }`;
}

function fragmentShader() {
    return `uniform vec3 colorA; 
                    uniform vec3 colorB; 
                    varying vec3 vUv;
      
                    void main() {
                  gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
                    }`;
}

export function createMaterials() {
    // Cube: Red to Blue gradient
    const cubeShader = new THREE.ShaderMaterial({
        uniforms: {
            colorA: { type: "vec3", value: new THREE.Color(0xff0000) }, // Red
            colorB: { type: "vec3", value: new THREE.Color(0x0000ff) }, // Blue
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
    });

    // Tetrahedron: Green to Yellow gradient
    const tetrahedronShader = new THREE.ShaderMaterial({
        uniforms: {
            colorA: { type: "vec3", value: new THREE.Color(0x00ff00) }, // Green
            colorB: { type: "vec3", value: new THREE.Color(0xffff00) }, // Yellow
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
    });

    // Octahedron: Purple to Pink gradient
    const octahedronShader = new THREE.ShaderMaterial({
        uniforms: {
            colorA: { type: "vec3", value: new THREE.Color(0x800080) }, // Purple
            colorB: { type: "vec3", value: new THREE.Color(0xff69b4) }, // Pink
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
    });

    // Dodecahedron: Orange to Cyan gradient
    const dodecahedronShader = new THREE.ShaderMaterial({
        uniforms: {
            colorA: { type: "vec3", value: new THREE.Color(0xffa500) }, // Orange
            colorB: { type: "vec3", value: new THREE.Color(0x00ffff) }, // Cyan
        },
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
    });

    return {
        cubeShader,
        tetrahedronShader,
        octahedronShader,
        dodecahedronShader
    };
}
