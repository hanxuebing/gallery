import * as PIXI from 'pixi.js';
import { renderTexture } from './Pixi3dScene';
let renderTexture2d1 = null;
let renderTexture2d2 = null;
export function init() {
  const canvas: any = document.querySelector('#pixi2dcanvas');
  const app = new PIXI.Application({
    antialias: true,
    view: canvas,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    resizeTo: canvas,
  });
  var texture = PIXI.Texture.from('Assets/snake.png');
  var width = texture.width;
  var height = texture.height;
}

init();
