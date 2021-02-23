import * as THREE from 'three';
export function main() {
  const div: any = document.querySelector("#threejsContainer");
  const canvas: any = document.querySelector("#threejscanvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 75;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

  const scene = new THREE.Scene();

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  function addMesh(geometry, parent, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({ color });

    const mesh = new THREE.Mesh(geometry, material);

    if (parent != null) {
      parent.add(mesh);
    } else {
      scene.add(mesh);
    }

    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;

    return mesh;
  }

  let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  let cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

  var cubeMesh: THREE.Mesh, cylinderMesh: THREE.Mesh;
  onWindowResize();
  const meshes = [
    (cubeMesh = addMesh(cubeGeometry, null, 0xff0000, 0, 0, 0)),
    (cylinderMesh = addMesh(cylinderGeometry, cubeMesh, 0x00ff00, -2, 0, 0)),
    addMesh(sphereGeometry, cylinderMesh, 0x0000ff, 2, 0, 0)
  ];

  function render(time) {
    time *= 0.001; // convert time to seconds

    meshes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    // onWindowResize();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function onWindowResize() {
    const width = div.clientWidth;
    const height = div.clientHeight;

    console.log(`${width},${height}`);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", onWindowResize, false);
  requestAnimationFrame(render);
}

main();
