import { EventEmitter } from "events";

export class RenderProcess {
    public emitter: EventEmitter;
    public app: PIXI.Application;
    public constructor(app: PIXI.Application) {
        this.app = app;
        this.emitter = new EventEmitter();
    }
    public process() {
        this.app.ticker.add((delta) => {
            this.emitter.emit('render');
        });
    }

    public addProcess(process: any) {
        this.emitter.addListener('render', process);
    }

    public removeProcess(process: any) {
        this.emitter.removeListener('render', process);
    }
}