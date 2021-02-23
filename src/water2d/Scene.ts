import * as PIXI from 'pixi.js';
import { Stage } from './Stage';
export class Scene {
    public app: PIXI.Application;
    public canvas: any;
    public constructor() {
        this.canvas = document.querySelector("#pixijscanvas");
        this.app = new PIXI.Application({ antialias: true, view: this.canvas, width: this.canvas.clientWidth, height: this.canvas.clientHeight, resizeTo: this.canvas });
    }

    public init() {
        let stage = new Stage(this.app);
        stage.init();
    }
}
