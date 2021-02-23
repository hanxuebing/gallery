import { RenderProcess } from "./RenderProcess";
import * as PIXI from 'pixi.js';
export class Stage {
    public app: PIXI.Application;
    public testFunc: any;
    public stageRT: PIXI.RenderTexture;
    public stage: PIXI.Container;

    private stageRT2;
    public constructor(app) {
        this.app = app;
    }
    public init() {
        const geometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100] as any);

        const shader = PIXI.Shader.from(`
    
        precision mediump float;
        attribute vec2 aVertexPosition;
    
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
    
        void main() {
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        }`,

            `precision mediump float;
    
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    
    `);
        const triangle = new PIXI.Mesh(geometry, shader);

        triangle.position.set(400, 300);
        this.stage = new PIXI.Container();
        this.stage.addChild(triangle);

        let count = 0;

        // build a rope!
        const ropeLength = 918 / 20;

        const points = [];

        for (let i = 0; i < 20; i++) {
            points.push(new PIXI.Point(i * ropeLength, 0));
        }

        const strip = new PIXI.SimpleRope(PIXI.Texture.from('Assets/snake.png'), points);

        strip.x = -459;

        const snakeContainer = new PIXI.Container();
        snakeContainer.x = 400;
        snakeContainer.y = 300;

        snakeContainer.scale.set(800 / 1100);
        this.stage.addChild(snakeContainer);

        snakeContainer.addChild(strip);
        this.app.stage.addChild(this.stage);
        this.stageRT = PIXI.RenderTexture.create(
            {
                width: this.app.screen.width,
                height: this.app.screen.height / 2
            }
        );
        this.stageRT2 = PIXI.RenderTexture.create(
            {
                width: this.app.screen.width,
                height: this.app.screen.height / 2
            }
        );

        let reflection = this.makeRelectionStage(this.stageRT);

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(20, 0x33FF00, 0.6, 0.5, false);
        graphics.moveTo(0, this.app.view.height / 2 - 50);
        graphics.lineTo(this.app.view.width, this.app.view.height / 2 );
        this.stage.addChild(graphics);

        let renderProcess = new RenderProcess(this.app);
        renderProcess.process();
        let direction = 'go';
        this.testFunc = () => {
            // count += 0.1;

            // make the snake
            // for (let i = 0; i < points.length; i++) {
            //     points[i].y = Math.sin((i * 0.5) + count) * 30;
            //     points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20;
            // }
            // triangle.rotation += 0.01;

            if (triangle.position.x > this.app.view.width) {
                direction = 'to';
            }
            if (triangle.position.x < 0) {
                direction = 'go';
            }
            if (direction == 'go') {
                triangle.position.x += 1.0;
            } else {
                triangle.position.x -= 1.0;
            }
            const temp = this.stageRT;
            this.stageRT = this.stageRT2;
            this.stageRT2 = temp;
            reflection.shader.uniforms.time += 1.0;
            this.app.renderer.render(this.stage, this.stageRT);
        }
        renderProcess.addProcess(this.testFunc);
    }

    private makeRelectionStage(renderTexture: PIXI.RenderTexture): PIXI.Mesh {
        const geometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition', // the attribute name
                [
                    0, 0, // x, y
                    this.app.view.width, 0, // x, y
                    this.app.view.width, this.app.view.height / 2,
                    0, this.app.view.height / 2
                ] as any, // x, y
                2) // the size of the attribute

            .addAttribute('aUvs', // the attribute name
                [
                    0, 0, // u, v
                    1, 0, // u, v
                    1, 1,
                    0, 1
                ] as any, // u, v
                2) // the size of the attribute
            .addIndex([0, 1, 2, 0, 2, 3] as any)
        const vertexSrc = `

            precision mediump float;
        
            attribute vec2 aVertexPosition;
            attribute vec2 aUvs;
        
            uniform mat3 translationMatrix;
            uniform mat3 projectionMatrix;
        
            varying vec2 vUvs;
        
            void main() {
        
                vUvs = aUvs;
                gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        
            }`;

        const fragmentSrc = `
        
            precision mediump float;
        
            varying vec2 vUvs;
        
            uniform sampler2D uSampler2;
            uniform sampler2D noiseSampler;
            uniform float time;
            uniform float speed;
            uniform float intensity;
            void main() {
                vec2 reflectionUvs = vec2(vUvs.x, 1.0 - vUvs.y);
                vec4 noise_col =  texture2D(noiseSampler, vUvs + vec2(time * speed, 0));
                // gl_FragColor = noise_col;
                // gl_FragColor = texture2D(uSampler2, reflectionUvs);
                float uOffset = noise_col.r;
                float vOffset = noise_col.g;
                // gl_FragColor = vec4(noise_col.r,noise_col.g,0,1.0);
                vec4 noise_color = texture2D(noiseSampler, vUvs + vec2(uOffset, vOffset));
                vec4 base_color = texture2D(uSampler2, reflectionUvs + intensity * vec2(uOffset, vOffset));
                gl_FragColor = vec4(base_color.xyz * 0.4 + vec3(noise_color.xyz * 0.09), 1.0);
            }`;
        var noiseTex = PIXI.Texture.from('Assets/mask_5.jpg');
        noiseTex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        const uniforms = {
            uSampler2: renderTexture,
            time: 0,
            noiseSampler: noiseTex,
            speed: 0.0005,
            intensity: 0.06
        };

        const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

        const quad = new PIXI.Mesh(geometry, shader);
        quad.position.set(0, this.app.view.height / 2);
        // quad.scale.set(2);
        this.app.stage.addChild(quad);
        return quad;
    }
}