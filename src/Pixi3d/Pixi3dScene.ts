import * as PIXI from 'pixi.js';
import { mat4 } from '../libs/gl-matrix';
import { ConsoleUtil } from '../libs/ConsoleUtil';
const canvas: any = document.querySelector('#pixi3dcanvas');
const app = new PIXI.Application({
  antialias: true,
  view: canvas,
  width: canvas.clientWidth,
  height: canvas.clientHeight,
  resizeTo: canvas,
});
const vertices = [
  // Front face
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0, 1.0, -1.0,
  1.0, 1.0, -1.0,
  1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, -1.0, 1.0,
  -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,
  1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, 1.0, -1.0
];
const uvs = [
  // Front
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Back
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Top
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Bottom
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Right
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0,
  // Left
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0
];
const indices = [
  0, 1, 2, 0, 2, 3,    // front
  4, 5, 6, 4, 6, 7,    // back
  8, 9, 10, 8, 10, 11,   // top
  12, 13, 14, 12, 14, 15,   // bottom
  16, 17, 18, 16, 18, 19,   // right
  20, 21, 22, 20, 22, 23,   // left
];

export let renderTexture: PIXI.RenderTexture = null;
export let renderTexture2: PIXI.RenderTexture = null;
export let index: number = 0;
export function main() {
  const geometry = new PIXI.Geometry()
    .addAttribute(
      'aVertexPosition', // the attribute name
      vertices as any, // x, y
      3,
    ) // the size of the attribute
    .addAttribute(
      'aUvs', // the attribute name
      uvs as any, // u, v
      2,
    ) // the size of the attribute
    .addIndex(indices as any);

  const vertexSrc = `

        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aUvs;

        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
        uniform mat4 translationMatrix4;
        uniform mat4 projectionMatrix4;
        uniform mat4 viewMatrix4;
        varying vec2 vUvs;

        void main() {

            vUvs = aUvs;
            gl_Position = projectionMatrix4 * viewMatrix4* translationMatrix4* vec4(aVertexPosition, 1.0);
            // gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

        }`;

  const fragmentSrc = `

        precision mediump float;

        varying vec2 vUvs;

        uniform sampler2D uSampler2;
        uniform float time;

        void main() {

            // gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );
            gl_FragColor = texture2D(uSampler2, vUvs );
        }`;
  const projectionMatrix = mat4.create();
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective(
    projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar,
  );

  const modelMatrix = mat4.create();
  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -10.0])

  // mat4.rotateX(viewMatrix, viewMatrix, Math.PI * 0.5);
  ConsoleUtil.printMatrix4(viewMatrix);
  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  var cubeRotation = 0.0;
  mat4.translate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to translate
    [-0.0, 0.0, -10.0],
  ); // amount to translate
  // mat4.rotate(modelViewMatrix,  // destination matrix
  //     modelViewMatrix,  // matrix to rotatezz
  //     cubeRotation,     // amount to rotate in radians
  //     [0, 0, 1]);       // axis to rotate around (Z)
  // mat4.rotate(modelViewMatrix,  // destination matrix
  //     modelViewMatrix,  // matrix to rotate
  //     cubeRotation * .7,// amount to rotate in radians
  //     [0, 1, 0]);       // a
  const uniforms = {
    uSampler2: PIXI.Texture.from('Assets/plane.png'),
    translationMatrix4: modelMatrix,
    viewMatrix4: viewMatrix,
    projectionMatrix4: projectionMatrix,
    time: 0,
  };

  const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

  const quad = new PIXI.Mesh(geometry, shader);

  quad.position.set(0, 300);
  // quad.scale.set(1);
  quad.state.culling = true;
  app.stage.addChild(quad);

  renderTexture = PIXI.RenderTexture.create({
    width: app.screen.width,
    height: app.screen.height,
  });
  renderTexture2 = PIXI.RenderTexture.create({
    width: app.screen.width,
    height: app.screen.height,
  });
  // start the animation..
  // requestAnimationFrame(animate);
  const currentTexture = renderTexture;
  const outputSprite = new PIXI.Sprite(currentTexture);
  // outputSprite.rotate
  // // align the sprite
  outputSprite.x = 300;
  outputSprite.y = 300;
  outputSprite.anchor.set(0.5);
  outputSprite.rotation;
  // outputSprite.
  app.stage.addChild(outputSprite);
  app.ticker.add((delta) => {
    quad.rotation += 0.01;
    quad.shader.uniforms.time += 0.1;
    cubeRotation = 0;
    cubeRotation += delta / 100;
    // index++;
    // console.log(cubeRotation);
    // mat4.translate(modelViewMatrix,     // destination matrix
    //     modelViewMatrix,     // matrix to translate
    //     [-0.0, 0.0, -6.0]);  // amount to translate
    mat4.rotate(
      modelMatrix, // destination matrix
      modelMatrix, // matrix to rotate
      cubeRotation, // amount to rotate in radians
      [0, 0, 1],
    ); // axis to rotate around (Z)
    // mat4.rotate(viewMatrix, viewMatrix, cubeRotation, [0, 0, 1]);
    // mat4.rotate(
    //   modelMatrix, // destination matrix
    //   modelMatrix, // matrix to rotate
    //   cubeRotation * 0.7, // amount to rotate in radians
    //   [0, 1, 0],
    // ); // a
    // uniforms.translationMatrix4 = modelViewMatrix;
    const tempTexture = renderTexture;
    renderTexture = renderTexture2;
    renderTexture2 = tempTexture;
    outputSprite.texture = renderTexture;
    app.renderer.render(quad, renderTexture2, true);
  });
}
export function getRenderTexture() {
  return renderTexture;
}
main();
