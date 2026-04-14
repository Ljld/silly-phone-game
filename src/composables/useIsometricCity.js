import * as THREE from 'three';

const PALETTE = {
  buildings: [0x4a90d9, 0x5b6abf, 0x7c5cbf, 0xe8737a, 0xf5a623, 0x50c878, 0xf0e68c, 0xff8c69],
  windows: 0xfff9c4,
  windowDark: 0x2a2a4a,
  road: 0x3a3a4a,
  roadLine: 0xf9ca24,
  sidewalk: 0x6a6a7a,
  grass: 0x4caf50,
  grassDark: 0x388e3c,
  tree: 0x2e7d32,
  treeDark: 0x1b5e20,
  trunk: 0x795548,
  car: [0xe74c3c, 0x3498db, 0xf39c12, 0x2ecc71, 0x9b59b6, 0xff6b81],
  headlight: 0xfff9c4,
  taillight: 0xff1744,
  cloud: 0xecf0f1,
  sky: 0x87ceeb,
  ground: 0x4a7c59,
};

function createBuilding(x, z, w, d, h) {
  const group = new THREE.Group();
  const color = PALETTE.buildings[Math.floor(Math.random() * PALETTE.buildings.length)];

  const bodyGeo = new THREE.BoxGeometry(w, h, d);
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, h / 2, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const windowSize = 0.3;
  const windowGap = 0.6;
  const windowMat = new THREE.MeshBasicMaterial({ color: PALETTE.windows });
  const windowDarkMat = new THREE.MeshBasicMaterial({ color: PALETTE.windowDark });
  const windowGeo = new THREE.PlaneGeometry(windowSize, windowSize * 1.4);

  for (let wy = 1.2; wy < h - 0.5; wy += windowGap) {
    for (let wx = -w / 2 + 0.4; wx < w / 2 - 0.2; wx += windowGap) {
      const lit = Math.random() > 0.3;
      const mat = lit ? windowMat : windowDarkMat;

      const wFront = new THREE.Mesh(windowGeo, mat);
      wFront.position.set(wx, wy, d / 2 + 0.01);
      group.add(wFront);

      const wBack = new THREE.Mesh(windowGeo, mat);
      wBack.position.set(wx, wy, -d / 2 - 0.01);
      wBack.rotation.y = Math.PI;
      group.add(wBack);
    }
    for (let wz = -d / 2 + 0.4; wz < d / 2 - 0.2; wz += windowGap) {
      const lit = Math.random() > 0.3;
      const mat = lit ? windowMat : windowDarkMat;

      const wRight = new THREE.Mesh(windowGeo, mat);
      wRight.position.set(w / 2 + 0.01, wy, wz);
      wRight.rotation.y = Math.PI / 2;
      group.add(wRight);

      const wLeft = new THREE.Mesh(windowGeo, mat);
      wLeft.position.set(-w / 2 - 0.01, wy, wz);
      wLeft.rotation.y = -Math.PI / 2;
      group.add(wLeft);
    }
  }

  if (Math.random() > 0.5) {
    const roofGeo = new THREE.BoxGeometry(w + 0.2, 0.15, d + 0.2);
    const roofMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color).multiplyScalar(0.7) });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, h + 0.075, 0);
    roof.castShadow = true;
    group.add(roof);
  }

  if (h > 4 && Math.random() > 0.4) {
    const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2);
    const antennaMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(
      (Math.random() - 0.5) * w * 0.5,
      h + 0.6,
      (Math.random() - 0.5) * d * 0.5
    );
    group.add(antenna);

    const blinkGeo = new THREE.SphereGeometry(0.06);
    const blinkMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const blink = new THREE.Mesh(blinkGeo, blinkMat);
    blink.position.copy(antenna.position);
    blink.position.y += 0.6;
    blink.userData.blink = true;
    group.add(blink);
  }

  group.position.set(x, 0, z);
  return group;
}

function createTree(x, z) {
  const group = new THREE.Group();
  const trunkH = 0.4 + Math.random() * 0.3;
  const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, trunkH);
  const trunkMat = new THREE.MeshLambertMaterial({ color: PALETTE.trunk });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = trunkH / 2;
  trunk.castShadow = true;
  group.add(trunk);

  const leafR = 0.3 + Math.random() * 0.25;
  const leafColor = Math.random() > 0.5 ? PALETTE.tree : PALETTE.treeDark;
  const leafGeo = new THREE.SphereGeometry(leafR, 6, 5);
  const leafMat = new THREE.MeshLambertMaterial({ color: leafColor });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.y = trunkH + leafR * 0.6;
  leaf.castShadow = true;
  group.add(leaf);

  if (Math.random() > 0.4) {
    const leaf2R = leafR * 0.7;
    const leaf2 = new THREE.Mesh(
      new THREE.SphereGeometry(leaf2R, 6, 5),
      leafMat
    );
    leaf2.position.set(
      (Math.random() - 0.5) * 0.3,
      trunkH + leafR * 0.9,
      (Math.random() - 0.5) * 0.3
    );
    leaf2.castShadow = true;
    group.add(leaf2);
  }

  group.position.set(x, 0, z);
  group.userData.sway = true;
  return group;
}

function createCar(x, z, direction) {
  const group = new THREE.Group();
  const color = PALETTE.car[Math.floor(Math.random() * PALETTE.car.length)];

  const bodyGeo = new THREE.BoxGeometry(0.8, 0.3, 0.4);
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.2;
  body.castShadow = true;
  group.add(body);

  const cabinGeo = new THREE.BoxGeometry(0.4, 0.22, 0.36);
  const cabinMat = new THREE.MeshLambertMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.6 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.05, 0.41, 0);
  group.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const positions = [
    [0.25, 0.08, 0.22], [0.25, 0.08, -0.22],
    [-0.25, 0.08, 0.22], [-0.25, 0.08, -0.22],
  ];
  for (const [wx, wy, wz] of positions) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(wx, wy, wz);
    wheel.rotation.x = Math.PI / 2;
    group.add(wheel);
  }

  const hlGeo = new THREE.SphereGeometry(0.04, 4, 4);
  const hlMat = new THREE.MeshBasicMaterial({ color: PALETTE.headlight });
  const hl1 = new THREE.Mesh(hlGeo, hlMat);
  hl1.position.set(0.41, 0.22, 0.12);
  group.add(hl1);
  const hl2 = new THREE.Mesh(hlGeo, hlMat);
  hl2.position.set(0.41, 0.22, -0.12);
  group.add(hl2);

  const tlGeo = new THREE.SphereGeometry(0.03, 4, 4);
  const tlMat = new THREE.MeshBasicMaterial({ color: PALETTE.taillight });
  const tl1 = new THREE.Mesh(tlGeo, tlMat);
  tl1.position.set(-0.41, 0.22, 0.12);
  group.add(tl1);
  const tl2 = new THREE.Mesh(tlGeo, tlMat);
  tl2.position.set(-0.41, 0.22, -0.12);
  group.add(tl2);

  group.position.set(x, 0, z);
  group.rotation.y = direction;
  group.userData.car = true;
  group.userData.speed = 0.015 + Math.random() * 0.02;
  group.userData.direction = direction;
  return group;
}

function createStreetLight(x, z) {
  const group = new THREE.Group();

  const poleGeo = new THREE.CylinderGeometry(0.04, 0.05, 2);
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = 1;
  group.add(pole);

  const armGeo = new THREE.BoxGeometry(0.6, 0.04, 0.04);
  const arm = new THREE.Mesh(armGeo, poleMat);
  arm.position.set(0.25, 2, 0);
  group.add(arm);

  const lightGeo = new THREE.SphereGeometry(0.1, 6, 6);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
  const light = new THREE.Mesh(lightGeo, lightMat);
  light.position.set(0.55, 1.9, 0);
  group.add(light);

  const pointLight = new THREE.PointLight(0xfff3b0, 0.5, 4);
  pointLight.position.set(0.55, 1.8, 0);
  group.add(pointLight);

  group.position.set(x, 0, z);
  return group;
}

function createCloud(x, y, z) {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: PALETTE.cloud, transparent: true, opacity: 0.85 });

  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const r = 0.4 + Math.random() * 0.6;
    const geo = new THREE.SphereGeometry(r, 7, 6);
    const part = new THREE.Mesh(geo, mat);
    part.position.set(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.5
    );
    group.add(part);
  }

  group.position.set(x, y, z);
  group.userData.cloud = true;
  group.userData.speed = 0.005 + Math.random() * 0.008;
  return group;
}

function createPark(x, z, w, d) {
  const group = new THREE.Group();

  const grassGeo = new THREE.BoxGeometry(w, 0.05, d);
  const grassMat = new THREE.MeshLambertMaterial({ color: PALETTE.grass });
  const grass = new THREE.Mesh(grassGeo, grassMat);
  grass.position.y = 0.025;
  grass.receiveShadow = true;
  group.add(grass);

  const treeCount = Math.floor(w * d * 0.3);
  for (let i = 0; i < treeCount; i++) {
    const tx = (Math.random() - 0.5) * (w - 0.8);
    const tz = (Math.random() - 0.5) * (d - 0.8);
    group.add(createTree(tx, tz));
  }

  if (w > 2 && d > 2) {
    const pondGeo = new THREE.CircleGeometry(0.6, 12);
    const pondMat = new THREE.MeshLambertMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.7 });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.y = 0.06;
    group.add(pond);
  }

  group.position.set(x, 0, z);
  return group;
}

export function useIsometricCity() {
  let scene, camera, renderer, animationId;
  const cars = [];
  const clouds = [];
  const blinkLights = [];
  const swayObjects = [];

  const init = (container) => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.sky);
    scene.fog = new THREE.Fog(PALETTE.sky, 30, 60);

    const aspect = w / h;
    const frustum = 12;
    camera = new THREE.OrthographicCamera(
      -frustum * aspect, frustum * aspect,
      frustum, -frustum,
      0.1, 100
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xb0c4de, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
    sunLight.position.set(15, 25, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    scene.add(sunLight);

    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshLambertMaterial({ color: PALETTE.ground });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    buildCity();
    addClouds();

    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      const a = nw / nh;
      camera.left = -frustum * a;
      camera.right = frustum * a;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  };

  const buildCity = () => {
    const roadWidth = 1.6;
    const roadMat = new THREE.MeshLambertMaterial({ color: PALETTE.road });
    const lineMat = new THREE.MeshBasicMaterial({ color: PALETTE.roadLine });

    const hRoads = [-8, -3, 3, 8];
    const vRoads = [-8, -3, 3, 8];

    for (const rz of hRoads) {
      const roadGeo = new THREE.BoxGeometry(50, 0.02, roadWidth);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.position.set(0, 0.01, rz);
      road.receiveShadow = true;
      scene.add(road);

      for (let lx = -24; lx < 25; lx += 1.5) {
        const lineGeo = new THREE.BoxGeometry(0.6, 0.001, 0.06);
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(lx, 0.025, rz);
        scene.add(line);
      }

      const sidewalkGeo = new THREE.BoxGeometry(50, 0.08, 0.3);
      const sidewalkMat = new THREE.MeshLambertMaterial({ color: PALETTE.sidewalk });
      const sw1 = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sw1.position.set(0, 0.04, rz + roadWidth / 2 + 0.15);
      sw1.receiveShadow = true;
      scene.add(sw1);
      const sw2 = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sw2.position.set(0, 0.04, rz - roadWidth / 2 - 0.15);
      sw2.receiveShadow = true;
      scene.add(sw2);
    }

    for (const rx of vRoads) {
      const roadGeo = new THREE.BoxGeometry(roadWidth, 0.02, 50);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.position.set(rx, 0.01, 0);
      road.receiveShadow = true;
      scene.add(road);

      for (let lz = -24; lz < 25; lz += 1.5) {
        const lineGeo = new THREE.BoxGeometry(0.06, 0.001, 0.6);
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(rx, 0.025, lz);
        scene.add(line);
      }

      const sidewalkGeo = new THREE.BoxGeometry(0.3, 0.08, 50);
      const sidewalkMat = new THREE.MeshLambertMaterial({ color: PALETTE.sidewalk });
      const sw1 = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sw1.position.set(rx + roadWidth / 2 + 0.15, 0.04, 0);
      sw1.receiveShadow = true;
      scene.add(sw1);
      const sw2 = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sw2.position.set(rx - roadWidth / 2 - 0.15, 0.04, 0);
      sw2.receiveShadow = true;
      scene.add(sw2);
    }

    const blocks = [
      { cx: -5.5, cz: -5.5, bw: 3.2, bd: 3.2 },
      { cx: 0, cz: -5.5, bw: 4, bd: 3.2 },
      { cx: 5.5, cz: -5.5, bw: 3.2, bd: 3.2 },
      { cx: -5.5, cz: 0, bw: 3.2, bd: 4 },
      { cx: 0, cz: 0, bw: 4, bd: 4 },
      { cx: 5.5, cz: 0, bw: 3.2, bd: 4 },
      { cx: -5.5, cz: 5.5, bw: 3.2, bd: 3.2 },
      { cx: 0, cz: 5.5, bw: 4, bd: 3.2 },
      { cx: 5.5, cz: 5.5, bw: 3.2, bd: 3.2 },
    ];

    blocks.forEach(({ cx, cz, bw, bd }, idx) => {
      if (idx === 4) {
        scene.add(createPark(cx, cz, bw, bd));
        return;
      }

      const buildingCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < buildingCount; i++) {
        const w = 1 + Math.random() * (bw / buildingCount - 0.3);
        const d = 1 + Math.random() * (bd - 0.5);
        const h = 2 + Math.random() * 6;
        const ox = cx + (i - (buildingCount - 1) / 2) * (bw / buildingCount);
        const oz = cz + (Math.random() - 0.5) * 0.5;
        scene.add(createBuilding(ox, oz, w, d, h));
      }

      if (Math.random() > 0.5) {
        const tx = cx + (Math.random() - 0.5) * bw * 0.6;
        const tz = cz + bd / 2 - 0.3;
        scene.add(createTree(tx, tz));
      }
    });

    for (const rz of hRoads) {
      for (let i = 0; i < 3; i++) {
        const cx = -10 + Math.random() * 20;
        const car = createCar(cx, rz, 0);
        cars.push(car);
        scene.add(car);
      }
      for (let i = 0; i < 2; i++) {
        const cx = -10 + Math.random() * 20;
        const car = createCar(cx, rz - 0.4, Math.PI);
        cars.push(car);
        scene.add(car);
      }
    }

    for (const rx of vRoads) {
      for (let i = 0; i < 2; i++) {
        const cz = -10 + Math.random() * 20;
        const car = createCar(rx, cz, Math.PI / 2);
        cars.push(car);
        scene.add(car);
      }
      for (let i = 0; i < 2; i++) {
        const cz = -10 + Math.random() * 20;
        const car = createCar(rx - 0.4, cz, -Math.PI / 2);
        cars.push(car);
        scene.add(car);
      }
    }

    for (const rz of hRoads) {
      for (let lx = -10; lx <= 10; lx += 5) {
        scene.add(createStreetLight(lx, rz + 1.2));
      }
    }
    for (const rx of vRoads) {
      for (let lz = -10; lz <= 10; lz += 5) {
        scene.add(createStreetLight(rx + 1.2, lz));
      }
    }

    scene.traverse((obj) => {
      if (obj.userData.blink) blinkLights.push(obj);
      if (obj.userData.sway) swayObjects.push(obj);
    });
  };

  const addClouds = () => {
    for (let i = 0; i < 10; i++) {
      const cloud = createCloud(
        (Math.random() - 0.5) * 40,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 40
      );
      clouds.push(cloud);
      scene.add(cloud);
    }
  };

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    for (const car of cars) {
      const speed = car.userData.speed;
      const dir = car.userData.direction;

      if (Math.abs(dir) < 0.1 || Math.abs(dir - Math.PI) < 0.1) {
        car.position.x += Math.cos(dir) * speed;
        if (car.position.x > 20) car.position.x = -20;
        if (car.position.x < -20) car.position.x = 20;
      } else {
        car.position.z += Math.cos(dir - Math.PI / 2) * speed;
        if (car.position.z > 20) car.position.z = -20;
        if (car.position.z < -20) car.position.z = 20;
      }
    }

    for (const cloud of clouds) {
      cloud.position.x += cloud.userData.speed;
      if (cloud.position.x > 25) cloud.position.x = -25;
    }

    for (const light of blinkLights) {
      light.visible = Math.sin(t * 3 + light.id) > 0;
    }

    for (const obj of swayObjects) {
      obj.rotation.z = Math.sin(t * 1.5 + obj.id * 0.5) * 0.03;
    }

    camera.position.x = 20 * Math.cos(t * 0.05);
    camera.position.z = 20 * Math.sin(t * 0.05);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  return { init };
}
