import * as PIXI from 'pixi.js';
export function init() {
    const canvas: any = document.querySelector("#pixijscanvas");
    const app = new PIXI.Application({ antialias: true, view: canvas, width: canvas.clientWidth, height: canvas.clientHeight, resizeTo: canvas });
    var texture = PIXI.Texture.from('Assets/snake.png');
    var width = texture.width;
    var height = texture.height;
    var simpleMesh1 = new PIXI.SimpleMesh(texture,
        Float32Array.from([0, 0, // x, y
            width, 0, // x, y
            width, height,
            0, height]),
        Float32Array.from([0, 0, // u, v
            1, 0, // u, v
            1, 1,
            0, 1]),
        Uint16Array.from([0, 1, 2, 0, 2, 3])
    );
    var simpleMesh2 = new PIXI.SimpleMesh(texture,
        Float32Array.from([0, 0, // x, y
            width, 0, // x, y
            width, height,
            0, height]),
        Float32Array.from([0, 0, // u, v
            1, 0, // u, v
            1, 1,
            0, 1]),
        Uint16Array.from([0, 1, 2, 0, 2, 3])
    );
    simpleMesh2.position.set(400, 400);
    // simpleMesh1.position.set(100,100);
    const geometry1 = new PIXI.Geometry()
        .addAttribute('aVertexPosition', // the attribute name
            [0, 0, // x, y
                100, 0, // x, y
                100, 100,
                0, 100] as any, // x, y
            2) // the size of the attribute
        .addAttribute('aUvs', // the attribute name
            [0, 0, // u, v
                1, 0, // u, v
                1, 1,
                0, 1] as any, // u, v
            2) // the size of the attribute
        .addIndex([0, 1, 2, 0, 2, 3] as any);

    const geometry2 = new PIXI.Geometry()
        .addAttribute('aVertexPosition', // the attribute name
            [100, 0, // x, y
                200, 0, // x, y
                200, 100,
                100, 100] as any, // x, y
            2) // the size of the attribute
        .addAttribute('aUvs', // the attribute name
            [0, 0, // u, v
                1, 0, // u, v
                1, 1,
                0, 1] as any, // u, v
            2) // the size of the attribute
        .addIndex([0, 1, 2, 0, 2, 3] as any);
    var geometry = PIXI.Geometry.merge([geometry1, geometry2]);
    var vertices = (geometry as any).buffers[0].data;
    var uvs = (geometry as any).buffers[1].data;
    var indices = (geometry as any).buffers[2].data;
    var simpleMeshMerge = new PIXI.SimpleMesh();
    simpleMeshMerge.texture = texture;

    // setTimeout(()=>{
    var verticesBuffer = simpleMeshMerge.geometry.getBuffer('aVertexPosition') as any;
    // verticesBuffer.static = false;
    verticesBuffer.update(vertices);
    var uvsBuffer = simpleMeshMerge.geometry.getBuffer('aTextureCoord');
    uvsBuffer.update(uvs);
    var indicesBuffer = simpleMeshMerge.geometry.getIndex();
    indicesBuffer.update(indices);
    // },2000)
    // simpleMeshMerge.autoUpdate = true;
    // simpleMeshMerge.visible = true;
    // const quad = new PIXI.SimpleMesh(texture, shader);
    const container = new PIXI.Container();
    // quad.position.set(300,300);
    container.addChild(simpleMeshMerge);
    // container.addChild(simpleMesh2);
    app.stage.addChild(container);
    // let count = 0;

    // app.ticker.add(() => {
    // count += 0.1;
    // simpleMesh1.x = count*30;
    // // make the snake
    // for (let i = 0; i < points.length; i++) {
    //     points[i].y = Math.sin((i * 0.5) + count) * 30;
    //     points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20;
    // }
    // });
}

init();