/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var lil_gui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lil-gui */ "./node_modules/lil-gui/dist/lil-gui.esm.js");




// Three.jsとCANNON.jsを組み合わせた3Dシーンを管理するクラス
class ThreeJSContainer {
    // === クラスのプロパティ定義 ===
    scene;
    light;
    ballBody;
    planeMesh;
    isBallInFlight = false;
    lastShotPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(0, 1.8, 0);
    camera;
    constructor() {
        // コンストラクタは空のまま
    }
    // Three.jsのレンダラーとキャンバスを作成し、ページに追加するメソッド
    createRendererDOM = (width, height, cameraPos) => {
        // レンダラーの初期設定
        const renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x495ed4));
        renderer.shadowMap.enabled = true;
        // カメラの初期設定
        this.camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0));
        // カメラコントローラー（マウスでの視点操作）の設定
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, renderer.domElement);
        orbitControls.target.set(-4.5, 3, 0);
        // シーン内の全オブジェクトをここで作成
        this.createScene();
        // 描画ループを開始
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        // 作成したキャンバスのスタイルを設定して返す
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // Three.jsのジオメトリからCANNON.jsのTrimesh（複雑な形状）を生成するヘルパー関数
    createTrimeshFromGeometry = (geometry) => {
        const vertices = Array.from(geometry.attributes.position.array);
        const indices = geometry.index ? Array.from(geometry.index.array) : [];
        return new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Trimesh(vertices, indices);
    };
    // シーンに表示する全ての3Dオブジェクトを作成するメソッド
    createScene = () => {
        // === シーンと物理ワールドの基本設定 ===
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.3;
        world.defaultContactMaterial.restitution = 0.3;
        // === GUI（操作パネル）の作成 ===
        const shootParams = {
            power: 4.0,
            launchAngle: 7.0,
            directionAngle: 0.0,
        };
        const ballParams = {
            fixedY: 1.8
        };
        const gui = new lil_gui__WEBPACK_IMPORTED_MODULE_3__["default"]();
        gui.add(shootParams, 'power', 1.0, 15.0).name('シュートの強さ');
        gui.add(shootParams, 'launchAngle', 1.0, 15.0).name('打ち出し角度');
        gui.add(shootParams, 'directionAngle', -90, 90).name('左右の向き (度)');
        gui.add(ballParams, 'fixedY', 0.1, 4.0).name('ボールの高さ (m)');
        // === バックボードの作成 ===
        const boardWidth = 1.8;
        const boardHeight = 1.05;
        const boardDepth = 0.05;
        const boardCenterX = -4.572;
        const boardCenterY = 3.20;
        const boardCenterZ = 0;
        const boardGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(boardDepth, boardHeight, boardWidth);
        const boardMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0xffffff, transparent: true, });
        const boardMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(boardGeometry, boardMaterial);
        boardMesh.position.set(boardCenterX, boardCenterY, boardCenterZ);
        boardMesh.castShadow = true;
        this.scene.add(boardMesh);
        const boardPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Material('boardMat');
        const boardBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(boardDepth / 2, boardHeight / 2, boardWidth / 2)),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(boardCenterX, boardCenterY, boardCenterZ),
            material: boardPhysMaterial
        });
        world.addBody(boardBody);
        // === リングとバックボードを繋ぐアームの作成 ===
        const supportArmDepth = 0.05;
        const supportArmHeight = 0.15;
        const supportArmWidth = 0.14;
        const boardFront = boardCenterX + (boardDepth / 2);
        const supportArmStart = boardFront;
        const supportArmCenterX = supportArmStart + (supportArmDepth / 2);
        const boardBottomY = boardCenterY - (boardHeight / 2);
        const supportArmCenterY = boardBottomY + (0.15) + (supportArmHeight / 2);
        const supportArmCenterZ = 0;
        const supportArmGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(supportArmDepth, supportArmHeight, supportArmWidth);
        const supportArmMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0x888888 });
        const supportArmMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(supportArmGeometry, supportArmMaterial);
        supportArmMesh.rotation.z = Math.PI / 2;
        supportArmMesh.position.set(supportArmCenterX, supportArmCenterY, supportArmCenterZ);
        supportArmMesh.castShadow = true;
        this.scene.add(supportArmMesh);
        const supportArmBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(supportArmDepth / 2, supportArmHeight / 2, supportArmWidth / 2)),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(supportArmCenterX, supportArmCenterY, supportArmCenterZ)
        });
        world.addBody(supportArmBody);
        // === リング（ゴール）の作成 ===
        const ringRadius = 0.45 / 2;
        const ringTube = 0.05;
        const supportArmFrontX = supportArmCenterX + supportArmDepth * 1.8;
        const ringCenterX = supportArmFrontX + ringRadius;
        const ringCenterY = boardBottomY + 0.15 + (supportArmHeight / 2);
        const ringCenterZ = 0;
        const ringGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.TorusGeometry(ringRadius, ringTube / 2, 16, 100);
        const ringMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0xff0000 });
        const ringMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(ringCenterX, ringCenterY, ringCenterZ);
        ringMesh.castShadow = true;
        this.scene.add(ringMesh);
        const ringPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Material('ringMat');
        ringGeometry.computeVertexNormals();
        ringGeometry.computeBoundingBox();
        const ringShape = this.createTrimeshFromGeometry(ringGeometry);
        const ringBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            shape: ringShape,
            material: ringPhysMaterial,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(ringCenterX, ringCenterY, ringCenterZ),
        });
        ringBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
        world.addBody(ringBody);
        // === ゴールネットの作成 ===
        const netHeight = 0.4;
        const netTopRadius = ringRadius;
        const netBottomRadius = ringRadius * 0.8;
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 5;
        for (let i = -canvas.width; i < canvas.width; i += 15) {
            context.beginPath();
            context.moveTo(i, -canvas.height);
            context.lineTo(i + canvas.width * 2, canvas.height * 2);
            context.stroke();
            context.moveTo(i, canvas.height * 2);
            context.lineTo(i + canvas.width * 2, -canvas.height);
            context.stroke();
        }
        const netTexture = new three__WEBPACK_IMPORTED_MODULE_2__.CanvasTexture(canvas);
        const netMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            map: netTexture,
            transparent: true,
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            alphaTest: 0.5,
        });
        const netGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(netTopRadius, netBottomRadius, netHeight, 32, 5, true);
        const netMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(netGeometry, netMaterial);
        netMesh.position.set(ringCenterX, ringCenterY - (netHeight / 2), ringCenterZ);
        this.scene.add(netMesh);
        // === バスケットボールと関連オブジェクトの作成 ===
        const ballRadius = 0.245 / 2;
        const ballGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(ballRadius, 32, 32);
        const ballMeshMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0xffa500 });
        const ballMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(ballGeometry, ballMeshMaterial);
        ballMesh.castShadow = true;
        ballMesh.position.set(0, ballParams.fixedY, 0);
        this.scene.add(ballMesh);
        const indicatorGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CircleGeometry(ballRadius, 32);
        const indicatorMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 });
        const ballIndicator = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(indicatorGeometry, indicatorMaterial);
        ballIndicator.rotation.x = -Math.PI / 2;
        ballIndicator.position.y = 0.01;
        this.scene.add(ballIndicator);
        const directionArrow = new three__WEBPACK_IMPORTED_MODULE_2__.ArrowHelper(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, 0, 0), new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0), 1.5, 0xffff00, 0.5, 0.3);
        this.scene.add(directionArrow);
        const ballPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Material('ballMat');
        const groundMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Material('groundMat');
        const contactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.ContactMaterial(ballPhysMaterial, groundMaterial, { restitution: 0.8, friction: 0.3 });
        world.addContactMaterial(contactMaterial);
        const ballRingContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.ContactMaterial(ballPhysMaterial, ringPhysMaterial, {
            restitution: 0.2,
            friction: 0.6
        });
        world.addContactMaterial(ballRingContactMaterial);
        this.ballBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0.6,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Sphere(ballRadius),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(0, ballParams.fixedY, 0),
            material: ballPhysMaterial
        });
        world.addBody(this.ballBody);
        this.lastShotPosition.y = ballParams.fixedY;
        // === ゴール支柱の作成 ===
        const baseLineX = ringCenterX - 1.575;
        const pillarBaseX = baseLineX - 0.5;
        const pillarHeight = 3.0;
        const pillarRadius = 0.1;
        const pillarGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 32);
        const pillarMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0x555555 });
        const pillarMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(pillarGeometry, pillarMaterial);
        pillarMesh.position.set(pillarBaseX, pillarHeight / 2, boardCenterZ);
        pillarMesh.castShadow = true;
        this.scene.add(pillarMesh);
        const pillarShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Cylinder(pillarRadius, pillarRadius, pillarHeight, 32);
        const pillarBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            shape: pillarShape,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(pillarBaseX, pillarHeight / 2, boardCenterZ),
        });
        world.addBody(pillarBody);
        const armLength = Math.sqrt(Math.pow(boardCenterX - pillarBaseX, 2) + Math.pow(boardCenterY - pillarHeight, 2));
        const armGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(armLength, 0.1, 0.1);
        const armMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0x555555 });
        const armMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(armGeometry, armMaterial);
        armMesh.position.set(pillarBaseX + (boardCenterX - pillarBaseX) / 2, pillarHeight + (boardCenterY - pillarHeight) / 2, boardCenterZ);
        const armAngle = Math.atan2(boardCenterY - pillarHeight, boardCenterX - pillarBaseX);
        armMesh.rotation.z = armAngle;
        this.scene.add(armMesh);
        const armShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(armLength / 2, 0.05, 0.05));
        const armBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({ mass: 0, shape: armShape });
        armBody.position.copy(armMesh.position);
        armBody.quaternion.copy(armMesh.quaternion);
        world.addBody(armBody);
        // === 地面の作成 ===
        const planeMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0xF5F5DC });
        this.planeMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(40, 40), planeMaterial);
        this.planeMesh.receiveShadow = true;
        this.planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide;
        this.planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(this.planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            material: groundMaterial
        });
        planeBody.addShape(planeShape);
        planeBody.position.set(this.planeMesh.position.x, this.planeMesh.position.y, this.planeMesh.position.z);
        planeBody.quaternion.set(this.planeMesh.quaternion.x, this.planeMesh.quaternion.y, this.planeMesh.quaternion.z, this.planeMesh.quaternion.w);
        world.addBody(planeBody);
        // === 背景の壁の作成 ===
        const wallWidth = 15;
        const wallHeight = 10;
        const wallDepth = 0.1;
        const wallPosX = boardCenterX - 3;
        const wallPosY = wallHeight / 2;
        const wallPosZ = ringCenterZ - (ringRadius / 2);
        const wallGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(wallWidth, wallHeight, wallDepth);
        const wallMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshStandardMaterial({ color: 0xF5F5DC9 });
        const wallMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(wallWidth, wallHeight, wallDepth), wallMaterial);
        wallMesh.rotation.y = Math.PI / 2;
        wallMesh.position.set(wallPosX, wallPosY, wallPosZ);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        this.scene.add(wallMesh);
        const wallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(wallWidth / 2, wallHeight / 2, wallDepth / 2));
        const wallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Body({
            mass: 0,
            shape: wallShape,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_1__.Vec3(wallPosX, wallPosY, wallPosZ)
        });
        wallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
        world.addBody(wallBody);
        // === コートのライン描画 ===
        const yPos = 0.01;
        const courtLineColor = 0xffffff;
        const ringProjectionX = ringCenterX;
        { // 制限区域
            const areaWidthAtBaseline = 4.9;
            const areaWidthAtFreeThrowLine = 3.6;
            const freeThrowLineX = 0;
            const points = [];
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineX, yPos, areaWidthAtBaseline / 2));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(freeThrowLineX, yPos, areaWidthAtFreeThrowLine / 2));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(freeThrowLineX, yPos, -areaWidthAtFreeThrowLine / 2));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineX, yPos, -areaWidthAtBaseline / 2));
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(points);
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: courtLineColor });
            const restrictedAreaLine = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
            this.scene.add(restrictedAreaLine);
        }
        { // コート外周
            const courtHalfLength = 14;
            const courtWidth = 15;
            const baseLineRearX = boardCenterX - 1.150;
            const courtPoints = [];
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX, yPos, -courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX, yPos, courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX, yPos, -courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX + courtHalfLength, yPos, -courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX + courtHalfLength, yPos, -courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX + courtHalfLength, yPos, courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX + courtHalfLength, yPos, courtWidth / 2));
            courtPoints.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineRearX, yPos, courtWidth / 2));
            const courtGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(courtPoints);
            const courtMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: 0x000000 });
            const courtLine = new three__WEBPACK_IMPORTED_MODULE_2__.LineSegments(courtGeometry, courtMaterial);
            this.scene.add(courtLine);
        }
        { // 3ポイントライン
            const threePointRadius = 6.75;
            const sidelineZ = (15 / 2) - 0.9;
            const intersectionX = ringProjectionX + Math.sqrt(threePointRadius ** 2 - sidelineZ ** 2);
            const points = [];
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineX, yPos, sidelineZ));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(intersectionX, yPos, sidelineZ));
            const arcSegments = 50;
            const startAngle = Math.asin(sidelineZ / threePointRadius);
            const endAngle = -startAngle;
            for (let i = 0; i <= arcSegments; i++) {
                const angle = startAngle + (endAngle - startAngle) * i / arcSegments;
                const x = ringProjectionX + threePointRadius * Math.cos(angle);
                const z = threePointRadius * Math.sin(angle);
                points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(x, yPos, z));
            }
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(intersectionX, yPos, -sidelineZ));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(baseLineX, yPos, -sidelineZ));
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(points);
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: courtLineColor, linewidth: 2 });
            const threePointLine = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
            this.scene.add(threePointLine);
        }
        { // フリースローライン半円
            const freeThrowCircleRadius = 1.8;
            const freeThrowLineX = 0;
            const points = [];
            const arcSegments = 32;
            for (let i = 0; i <= arcSegments; i++) {
                const theta = -Math.PI / 2 + (Math.PI * i) / arcSegments;
                const x = freeThrowCircleRadius * Math.cos(theta);
                const z = freeThrowCircleRadius * Math.sin(theta);
                points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(x, yPos, z));
            }
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(points);
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: courtLineColor });
            const freeThrowCircleLine = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
            this.scene.add(freeThrowCircleLine);
        }
        { // ノーチャージセミサークル
            const noChargeRadius = 1.25;
            const points = [];
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX, yPos, noChargeRadius));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(ringProjectionX, yPos, noChargeRadius));
            const arcSegments = 32;
            for (let i = 0; i <= arcSegments; i++) {
                const theta = (Math.PI / 2) - (Math.PI * i / arcSegments);
                const x = ringProjectionX + noChargeRadius * Math.cos(theta);
                const z = noChargeRadius * Math.sin(theta);
                points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(x, yPos, z));
            }
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(ringProjectionX, yPos, -noChargeRadius));
            points.push(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX, yPos, -noChargeRadius));
            const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(points);
            const material = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: courtLineColor });
            const noChargeLine = new three__WEBPACK_IMPORTED_MODULE_2__.Line(geometry, material);
            this.scene.add(noChargeLine);
        }
        { // バックボード外枠
            const outerLineThickness = 0.04;
            const lineOffset = 0.001;
            const lineDepth = 0.01;
            const edgeColor = 0x000000;
            const outerWidth = boardWidth - 2 * lineOffset;
            const outerHeight = boardHeight - 2 * lineOffset;
            const edgeX = boardCenterX + boardDepth / 2 + lineDepth / 2;
            const outerEdges = [
                { size: [lineDepth, outerLineThickness, outerWidth], position: [edgeX, boardCenterY + (outerHeight / 2) - outerLineThickness / 2, boardCenterZ] },
                { size: [lineDepth, outerLineThickness, outerWidth], position: [edgeX, boardCenterY - (outerHeight / 2) + outerLineThickness / 2, boardCenterZ] },
                { size: [lineDepth, outerHeight, outerLineThickness], position: [edgeX, boardCenterY, boardCenterZ + (outerWidth / 2) - outerLineThickness / 2] },
                { size: [lineDepth, outerHeight, outerLineThickness], position: [edgeX, boardCenterY, boardCenterZ - (outerWidth / 2) + outerLineThickness / 2] },
            ];
            outerEdges.forEach(({ size, position }) => {
                const geometry = new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(size[0], size[1], size[2]);
                const material = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ color: edgeColor });
                const mesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(geometry, material);
                mesh.position.set(position[0], position[1], position[2]);
                this.scene.add(mesh);
            });
        }
        { // バックボード内枠
            const innerboardWidth = 0.59;
            const innerLinePoints = [
                new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX + boardDepth, boardBottomY + 0.55, innerboardWidth / 2),
                new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX + boardDepth, boardBottomY + 0.55, -innerboardWidth / 2),
                new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX + boardDepth, boardBottomY + 0.25, -innerboardWidth / 2),
                new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX + boardDepth, boardBottomY + 0.25, innerboardWidth / 2),
                new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(boardCenterX + boardDepth, boardBottomY + 0.55, innerboardWidth / 2),
            ];
            const innerLineGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.BufferGeometry().setFromPoints(innerLinePoints);
            const innerLineMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.LineBasicMaterial({ color: 0x000000 });
            const innerLine = new three__WEBPACK_IMPORTED_MODULE_2__.Line(innerLineGeometry, innerLineMaterial);
            this.scene.add(innerLine);
        }
        // === 環境設定（ライト、ヘルパーなど） ===
        this.light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        // === キーボード入力の処理 ===
        window.addEventListener('keydown', (event) => {
            if (!this.ballBody || !this.camera)
                return;
            if (event.code === 'Space') {
                if (!this.isBallInFlight) {
                    this.lastShotPosition.copy(this.ballBody.position);
                    this.isBallInFlight = true;
                    this.ballBody.position.y = ballParams.fixedY;
                    const angleRad = shootParams.directionAngle * (Math.PI / 180);
                    const speed = shootParams.power;
                    const vx = -speed * Math.cos(angleRad);
                    const vz = -speed * Math.sin(angleRad);
                    this.ballBody.velocity.set(vx, shootParams.launchAngle, vz);
                }
            }
            if (event.key === 'r' || event.key === 'R') {
                this.isBallInFlight = false;
                this.ballBody.velocity.set(0, 0, 0);
                this.ballBody.angularVelocity.set(0, 0, 0);
                this.ballBody.position.copy(this.lastShotPosition);
            }
            const moveSpeed = 0.2;
            let movedByKey = false;
            const cameraDirection = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            cameraDirection.clone().normalize();
            const rightDirection = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3().clone().crossVectors(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 1, 0), cameraDirection).clone().normalize();
            switch (event.key) {
                case 'ArrowUp':
                    this.ballBody.position.x += cameraDirection.x * moveSpeed;
                    this.ballBody.position.z += cameraDirection.z * moveSpeed;
                    movedByKey = true;
                    break;
                case 'ArrowDown':
                    this.ballBody.position.x -= cameraDirection.x * moveSpeed;
                    this.ballBody.position.z -= cameraDirection.z * moveSpeed;
                    movedByKey = true;
                    break;
                case 'ArrowLeft':
                    this.ballBody.position.x += rightDirection.x * moveSpeed;
                    this.ballBody.position.z += rightDirection.z * moveSpeed;
                    movedByKey = true;
                    break;
                case 'ArrowRight':
                    this.ballBody.position.x -= rightDirection.x * moveSpeed;
                    this.ballBody.position.z -= rightDirection.z * moveSpeed;
                    movedByKey = true;
                    break;
            }
            if (movedByKey) {
                this.isBallInFlight = false;
                this.ballBody.velocity.set(0, 0, 0);
                this.ballBody.angularVelocity.set(0, 0, 0);
            }
        });
        // === 物理演算と描画の更新ループ ===
        let update = (time) => {
            world.step(1 / 60);
            if (this.ballBody) {
                // 着地判定
                const isLanded = this.ballBody.position.y < ballRadius + 0.1 && Math.abs(this.ballBody.velocity.y) < 0.5;
                if (this.isBallInFlight && isLanded) {
                    this.ballBody.velocity.set(0, 0, 0);
                    this.ballBody.angularVelocity.set(0, 0, 0);
                }
                // 状態に応じたボールとマーカーの制御
                if (!this.isBallInFlight) {
                    this.ballBody.position.y = ballParams.fixedY;
                    this.ballBody.velocity.y = 0;
                    ballIndicator.visible = true;
                    ballIndicator.position.x = this.ballBody.position.x;
                    ballIndicator.position.z = this.ballBody.position.z;
                    directionArrow.visible = true;
                    directionArrow.position.copy(this.ballBody.position);
                    const angleRad = shootParams.directionAngle * (Math.PI / 180);
                    const power = shootParams.power;
                    const launchY = shootParams.launchAngle;
                    const shootVector = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-power * Math.cos(angleRad), launchY, -power * Math.sin(angleRad));
                    const arrowLength = shootVector.length() * 0.2;
                    directionArrow.setLength(arrowLength, 0.5, 0.3);
                    directionArrow.setDirection(shootVector.clone().normalize());
                }
                else {
                    ballIndicator.visible = false;
                    directionArrow.visible = false;
                }
                // 見た目と物理オブジェクトの同期
                ballMesh.position.set(this.ballBody.position.x, this.ballBody.position.y, this.ballBody.position.z);
                ballMesh.quaternion.set(this.ballBody.quaternion.x, this.ballBody.quaternion.y, this.ballBody.quaternion.z, this.ballBody.quaternion.w);
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
// === プログラムの開始点 ===
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(5, 3, 4));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_lil-gui_dist_lil-gui_esm_js-nod-376d50"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5pbXBvcnQgR1VJIGZyb20gJ2xpbC1ndWknO1xuXG4vLyBUaHJlZS5qc+OBqENBTk5PTi5qc+OCkue1hOOBv+WQiOOCj+OBm+OBnzNE44K344O844Oz44KS566h55CG44GZ44KL44Kv44Op44K5XG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICAvLyA9PT0g44Kv44Op44K544Gu44OX44Ot44OR44OG44Kj5a6a576pID09PVxuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgYmFsbEJvZHk/OiBDQU5OT04uQm9keTtcbiAgICBwcml2YXRlIHBsYW5lTWVzaD86IFRIUkVFLk1lc2g7XG4gICAgcHJpdmF0ZSBpc0JhbGxJbkZsaWdodDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgbGFzdFNob3RQb3NpdGlvbjogQ0FOTk9OLlZlYzMgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMS44LCAwKTtcbiAgICBwcml2YXRlIGNhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIOOCs+ODs+OCueODiOODqeOCr+OCv+OBr+epuuOBruOBvuOBvlxuICAgIH1cblxuICAgIC8vIFRocmVlLmpz44Gu44Os44Oz44OA44Op44O844Go44Kt44Oj44Oz44OQ44K544KS5L2c5oiQ44GX44CB44Oa44O844K444Gr6L+95Yqg44GZ44KL44Oh44K944OD44OJXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgLy8g44Os44Oz44OA44Op44O844Gu5Yid5pyf6Kit5a6aXG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZDQpKTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIOOCq+ODoeODqeOBruWIneacn+ioreWumlxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICAvLyDjgqvjg6Hjg6njgrPjg7Pjg4jjg63jg7zjg6njg7zvvIjjg57jgqbjgrnjgafjga7oppbngrnmk43kvZzvvInjga7oqK3lrppcbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgb3JiaXRDb250cm9scy50YXJnZXQuc2V0KC00LjUsIDMsIDApO1xuXG4gICAgICAgIC8vIOOCt+ODvOODs+WGheOBruWFqOOCquODluOCuOOCp+OCr+ODiOOCkuOBk+OBk+OBp+S9nOaIkFxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgLy8g5o+P55S744Or44O844OX44KS6ZaL5aeLXG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgLy8g5L2c5oiQ44GX44Gf44Kt44Oj44Oz44OQ44K544Gu44K544K/44Kk44Or44KS6Kit5a6a44GX44Gm6L+U44GZXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gVGhyZWUuanPjga7jgrjjgqrjg6Hjg4jjg6rjgYvjgolDQU5OT04uanPjga5UcmltZXNo77yI6KSH6ZuR44Gq5b2i54q277yJ44KS55Sf5oiQ44GZ44KL44OY44Or44OR44O86Zai5pWwXG4gICAgcHJpdmF0ZSBjcmVhdGVUcmltZXNoRnJvbUdlb21ldHJ5ID0gKGdlb21ldHJ5OiBUSFJFRS5CdWZmZXJHZW9tZXRyeSk6IENBTk5PTi5UcmltZXNoID0+IHtcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSBBcnJheS5mcm9tKGdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXkpO1xuICAgICAgICBjb25zdCBpbmRpY2VzID0gZ2VvbWV0cnkuaW5kZXggPyBBcnJheS5mcm9tKGdlb21ldHJ5LmluZGV4LmFycmF5KSA6IFtdO1xuICAgICAgICByZXR1cm4gbmV3IENBTk5PTi5UcmltZXNoKHZlcnRpY2VzLCBpbmRpY2VzKTtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7PjgavooajnpLrjgZnjgovlhajjgabjga4zROOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi+ODoeOCveODg+ODiVxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIC8vID09PSDjgrfjg7zjg7PjgajniannkIbjg6/jg7zjg6vjg4njga7ln7rmnKzoqK3lrpogPT09XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMztcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuMztcblxuICAgICAgICAvLyA9PT0gR1VJ77yI5pON5L2c44OR44ON44Or77yJ44Gu5L2c5oiQID09PVxuICAgICAgICBjb25zdCBzaG9vdFBhcmFtcyA9IHtcbiAgICAgICAgICAgIHBvd2VyOiA0LjAsXG4gICAgICAgICAgICBsYXVuY2hBbmdsZTogNy4wLFxuICAgICAgICAgICAgZGlyZWN0aW9uQW5nbGU6IDAuMCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYmFsbFBhcmFtcyA9IHtcbiAgICAgICAgICAgIGZpeGVkWTogMS44XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGd1aSA9IG5ldyBHVUkoKTtcbiAgICAgICAgZ3VpLmFkZChzaG9vdFBhcmFtcywgJ3Bvd2VyJywgMS4wLCAxNS4wKS5uYW1lKCfjgrfjg6Xjg7zjg4jjga7lvLfjgZUnKTtcbiAgICAgICAgZ3VpLmFkZChzaG9vdFBhcmFtcywgJ2xhdW5jaEFuZ2xlJywgMS4wLCAxNS4wKS5uYW1lKCfmiZPjgaHlh7rjgZfop5LluqYnKTtcbiAgICAgICAgZ3VpLmFkZChzaG9vdFBhcmFtcywgJ2RpcmVjdGlvbkFuZ2xlJywgLTkwLCA5MCkubmFtZSgn5bem5Y+z44Gu5ZCR44GNICjluqYpJyk7XG4gICAgICAgIGd1aS5hZGQoYmFsbFBhcmFtcywgJ2ZpeGVkWScsIDAuMSwgNC4wKS5uYW1lKCfjg5zjg7zjg6vjga7pq5jjgZUgKG0pJyk7XG5cbiAgICAgICAgLy8gPT09IOODkOODg+OCr+ODnOODvOODieOBruS9nOaIkCA9PT1cbiAgICAgICAgY29uc3QgYm9hcmRXaWR0aCA9IDEuODtcbiAgICAgICAgY29uc3QgYm9hcmRIZWlnaHQgPSAxLjA1O1xuICAgICAgICBjb25zdCBib2FyZERlcHRoID0gMC4wNTtcbiAgICAgICAgY29uc3QgYm9hcmRDZW50ZXJYID0gLTQuNTcyO1xuICAgICAgICBjb25zdCBib2FyZENlbnRlclkgPSAzLjIwO1xuICAgICAgICBjb25zdCBib2FyZENlbnRlclogPSAwO1xuICAgICAgICBjb25zdCBib2FyZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KGJvYXJkRGVwdGgsIGJvYXJkSGVpZ2h0LCBib2FyZFdpZHRoKTtcbiAgICAgICAgY29uc3QgYm9hcmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIH0pO1xuICAgICAgICBjb25zdCBib2FyZE1lc2ggPSBuZXcgVEhSRUUuTWVzaChib2FyZEdlb21ldHJ5LCBib2FyZE1hdGVyaWFsKTtcbiAgICAgICAgYm9hcmRNZXNoLnBvc2l0aW9uLnNldChib2FyZENlbnRlclgsIGJvYXJkQ2VudGVyWSwgYm9hcmRDZW50ZXJaKTtcbiAgICAgICAgYm9hcmRNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChib2FyZE1lc2gpO1xuICAgICAgICBjb25zdCBib2FyZFBoeXNNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoJ2JvYXJkTWF0Jyk7XG4gICAgICAgIGNvbnN0IGJvYXJkQm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLFxuICAgICAgICAgICAgc2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhib2FyZERlcHRoIC8gMiwgYm9hcmRIZWlnaHQgLyAyLCBib2FyZFdpZHRoIC8gMikpLFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyhib2FyZENlbnRlclgsIGJvYXJkQ2VudGVyWSwgYm9hcmRDZW50ZXJaKSxcbiAgICAgICAgICAgIG1hdGVyaWFsOiBib2FyZFBoeXNNYXRlcmlhbFxuICAgICAgICB9KTtcbiAgICAgICAgd29ybGQuYWRkQm9keShib2FyZEJvZHkpO1xuXG4gICAgICAgIC8vID09PSDjg6rjg7PjgrDjgajjg5Djg4Pjgq/jg5zjg7zjg4njgpLnuYvjgZDjgqLjg7zjg6Djga7kvZzmiJAgPT09XG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1EZXB0aCA9IDAuMDU7XG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1IZWlnaHQgPSAwLjE1O1xuICAgICAgICBjb25zdCBzdXBwb3J0QXJtV2lkdGggPSAwLjE0O1xuICAgICAgICBjb25zdCBib2FyZEZyb250ID0gYm9hcmRDZW50ZXJYICsgKGJvYXJkRGVwdGggLyAyKTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybVN0YXJ0ID0gYm9hcmRGcm9udDtcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUNlbnRlclggPSBzdXBwb3J0QXJtU3RhcnQgKyAoc3VwcG9ydEFybURlcHRoIC8gMik7XG4gICAgICAgIGNvbnN0IGJvYXJkQm90dG9tWSA9IGJvYXJkQ2VudGVyWSAtIChib2FyZEhlaWdodCAvIDIpO1xuICAgICAgICBjb25zdCBzdXBwb3J0QXJtQ2VudGVyWSA9IGJvYXJkQm90dG9tWSArICgwLjE1KSArIChzdXBwb3J0QXJtSGVpZ2h0IC8gMik7XG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1DZW50ZXJaID0gMDtcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHN1cHBvcnRBcm1EZXB0aCwgc3VwcG9ydEFybUhlaWdodCwgc3VwcG9ydEFybVdpZHRoKTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4ODg4ODg4IH0pO1xuICAgICAgICBjb25zdCBzdXBwb3J0QXJtTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHN1cHBvcnRBcm1HZW9tZXRyeSwgc3VwcG9ydEFybU1hdGVyaWFsKTtcbiAgICAgICAgc3VwcG9ydEFybU1lc2gucm90YXRpb24ueiA9IE1hdGguUEkgLyAyO1xuICAgICAgICBzdXBwb3J0QXJtTWVzaC5wb3NpdGlvbi5zZXQoc3VwcG9ydEFybUNlbnRlclgsIHN1cHBvcnRBcm1DZW50ZXJZLCBzdXBwb3J0QXJtQ2VudGVyWik7XG4gICAgICAgIHN1cHBvcnRBcm1NZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChzdXBwb3J0QXJtTWVzaCk7XG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1Cb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDAsXG4gICAgICAgICAgICBzaGFwZTogbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHN1cHBvcnRBcm1EZXB0aCAvIDIsIHN1cHBvcnRBcm1IZWlnaHQgLyAyLCBzdXBwb3J0QXJtV2lkdGggLyAyKSksXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKHN1cHBvcnRBcm1DZW50ZXJYLCBzdXBwb3J0QXJtQ2VudGVyWSwgc3VwcG9ydEFybUNlbnRlclopXG4gICAgICAgIH0pO1xuICAgICAgICB3b3JsZC5hZGRCb2R5KHN1cHBvcnRBcm1Cb2R5KTtcblxuICAgICAgICAvLyA9PT0g44Oq44Oz44Kw77yI44K044O844Or77yJ44Gu5L2c5oiQID09PVxuICAgICAgICBjb25zdCByaW5nUmFkaXVzID0gMC40NSAvIDI7XG4gICAgICAgIGNvbnN0IHJpbmdUdWJlID0gMC4wNTtcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUZyb250WCA9IHN1cHBvcnRBcm1DZW50ZXJYICsgc3VwcG9ydEFybURlcHRoICogMS44O1xuICAgICAgICBjb25zdCByaW5nQ2VudGVyWCA9IHN1cHBvcnRBcm1Gcm9udFggKyByaW5nUmFkaXVzO1xuICAgICAgICBjb25zdCByaW5nQ2VudGVyWSA9IGJvYXJkQm90dG9tWSArIDAuMTUgKyAoc3VwcG9ydEFybUhlaWdodCAvIDIpO1xuICAgICAgICBjb25zdCByaW5nQ2VudGVyWiA9IDA7XG4gICAgICAgIGNvbnN0IHJpbmdHZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5KHJpbmdSYWRpdXMsIHJpbmdUdWJlIC8gMiwgMTYsIDEwMCk7XG4gICAgICAgIGNvbnN0IHJpbmdNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCB9KTtcbiAgICAgICAgY29uc3QgcmluZ01lc2ggPSBuZXcgVEhSRUUuTWVzaChyaW5nR2VvbWV0cnksIHJpbmdNYXRlcmlhbCk7XG4gICAgICAgIHJpbmdNZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJIC8gMjtcbiAgICAgICAgcmluZ01lc2gucG9zaXRpb24uc2V0KHJpbmdDZW50ZXJYLCByaW5nQ2VudGVyWSwgcmluZ0NlbnRlclopO1xuICAgICAgICByaW5nTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmluZ01lc2gpO1xuICAgICAgICBjb25zdCByaW5nUGh5c01hdGVyaWFsID0gbmV3IENBTk5PTi5NYXRlcmlhbCgncmluZ01hdCcpO1xuICAgICAgICByaW5nR2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcbiAgICAgICAgcmluZ0dlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuICAgICAgICBjb25zdCByaW5nU2hhcGUgPSB0aGlzLmNyZWF0ZVRyaW1lc2hGcm9tR2VvbWV0cnkocmluZ0dlb21ldHJ5KTtcbiAgICAgICAgY29uc3QgcmluZ0JvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCxcbiAgICAgICAgICAgIHNoYXBlOiByaW5nU2hhcGUsXG4gICAgICAgICAgICBtYXRlcmlhbDogcmluZ1BoeXNNYXRlcmlhbCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMocmluZ0NlbnRlclgsIHJpbmdDZW50ZXJZLCByaW5nQ2VudGVyWiksXG4gICAgICAgIH0pO1xuICAgICAgICByaW5nQm9keS5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcihNYXRoLlBJIC8gMiwgMCwgMCk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkocmluZ0JvZHkpO1xuXG4gICAgICAgIC8vID09PSDjgrTjg7zjg6vjg43jg4Pjg4jjga7kvZzmiJAgPT09XG4gICAgICAgIGNvbnN0IG5ldEhlaWdodCA9IDAuNDtcbiAgICAgICAgY29uc3QgbmV0VG9wUmFkaXVzID0gcmluZ1JhZGl1cztcbiAgICAgICAgY29uc3QgbmV0Qm90dG9tUmFkaXVzID0gcmluZ1JhZGl1cyAqIDAuODtcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IDEyODtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IDEyODtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjRkZGRkZGJztcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSA1O1xuICAgICAgICBmb3IgKGxldCBpID0gLWNhbnZhcy53aWR0aDsgaSA8IGNhbnZhcy53aWR0aDsgaSArPSAxNSkge1xuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKGksIC1jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGkgKyBjYW52YXMud2lkdGggKiAyLCBjYW52YXMuaGVpZ2h0ICogMik7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oaSwgY2FudmFzLmhlaWdodCAqIDIpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oaSArIGNhbnZhcy53aWR0aCAqIDIsIC1jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV0VGV4dHVyZSA9IG5ldyBUSFJFRS5DYW52YXNUZXh0dXJlKGNhbnZhcyk7XG4gICAgICAgIGNvbnN0IG5ldE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIG1hcDogbmV0VGV4dHVyZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIGFscGhhVGVzdDogMC41LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbmV0R2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeShcbiAgICAgICAgICAgIG5ldFRvcFJhZGl1cywgbmV0Qm90dG9tUmFkaXVzLCBuZXRIZWlnaHQsIDMyLCA1LCB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG5ldE1lc2ggPSBuZXcgVEhSRUUuTWVzaChuZXRHZW9tZXRyeSwgbmV0TWF0ZXJpYWwpO1xuICAgICAgICBuZXRNZXNoLnBvc2l0aW9uLnNldChyaW5nQ2VudGVyWCwgcmluZ0NlbnRlclkgLSAobmV0SGVpZ2h0IC8gMiksIHJpbmdDZW50ZXJaKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobmV0TWVzaCk7XG5cbiAgICAgICAgLy8gPT09IOODkOOCueOCseODg+ODiOODnOODvOODq+OBqOmWoumAo+OCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkCA9PT1cbiAgICAgICAgY29uc3QgYmFsbFJhZGl1cyA9IDAuMjQ1IC8gMjtcbiAgICAgICAgY29uc3QgYmFsbEdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KGJhbGxSYWRpdXMsIDMyLCAzMik7XG4gICAgICAgIGNvbnN0IGJhbGxNZXNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmE1MDAgfSk7XG4gICAgICAgIGNvbnN0IGJhbGxNZXNoID0gbmV3IFRIUkVFLk1lc2goYmFsbEdlb21ldHJ5LCBiYWxsTWVzaE1hdGVyaWFsKTtcbiAgICAgICAgYmFsbE1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIGJhbGxNZXNoLnBvc2l0aW9uLnNldCgwLCBiYWxsUGFyYW1zLmZpeGVkWSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGJhbGxNZXNoKTtcblxuICAgICAgICBjb25zdCBpbmRpY2F0b3JHZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShiYWxsUmFkaXVzLCAzMik7XG4gICAgICAgIGNvbnN0IGluZGljYXRvck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmZmZjAwLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC43IH0pO1xuICAgICAgICBjb25zdCBiYWxsSW5kaWNhdG9yID0gbmV3IFRIUkVFLk1lc2goaW5kaWNhdG9yR2VvbWV0cnksIGluZGljYXRvck1hdGVyaWFsKTtcbiAgICAgICAgYmFsbEluZGljYXRvci5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgICBiYWxsSW5kaWNhdG9yLnBvc2l0aW9uLnkgPSAwLjAxO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChiYWxsSW5kaWNhdG9yKTtcblxuICAgICAgICBjb25zdCBkaXJlY3Rpb25BcnJvdyA9IG5ldyBUSFJFRS5BcnJvd0hlbHBlcihcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0xLCAwLCAwKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApLFxuICAgICAgICAgICAgMS41LFxuICAgICAgICAgICAgMHhmZmZmMDAsXG4gICAgICAgICAgICAwLjUsXG4gICAgICAgICAgICAwLjNcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyZWN0aW9uQXJyb3cpO1xuXG4gICAgICAgIGNvbnN0IGJhbGxQaHlzTWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKCdiYWxsTWF0Jyk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1hdGVyaWFsID0gbmV3IENBTk5PTi5NYXRlcmlhbCgnZ3JvdW5kTWF0Jyk7XG4gICAgICAgIGNvbnN0IGNvbnRhY3RNYXRlcmlhbCA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKFxuICAgICAgICAgICAgYmFsbFBoeXNNYXRlcmlhbCxcbiAgICAgICAgICAgIGdyb3VuZE1hdGVyaWFsLFxuICAgICAgICAgICAgeyByZXN0aXR1dGlvbjogMC44LCBmcmljdGlvbjogMC4zIH0pO1xuICAgICAgICB3b3JsZC5hZGRDb250YWN0TWF0ZXJpYWwoY29udGFjdE1hdGVyaWFsKTtcbiAgICAgICAgY29uc3QgYmFsbFJpbmdDb250YWN0TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChiYWxsUGh5c01hdGVyaWFsLCByaW5nUGh5c01hdGVyaWFsLCB7XG4gICAgICAgICAgICByZXN0aXR1dGlvbjogMC4yLFxuICAgICAgICAgICAgZnJpY3Rpb246IDAuNlxuICAgICAgICB9KTtcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGJhbGxSaW5nQ29udGFjdE1hdGVyaWFsKTtcblxuICAgICAgICB0aGlzLmJhbGxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDAuNixcbiAgICAgICAgICAgIHNoYXBlOiBuZXcgQ0FOTk9OLlNwaGVyZShiYWxsUmFkaXVzKSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoMCwgYmFsbFBhcmFtcy5maXhlZFksIDApLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IGJhbGxQaHlzTWF0ZXJpYWxcbiAgICAgICAgfSk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkodGhpcy5iYWxsQm9keSk7XG4gICAgICAgIHRoaXMubGFzdFNob3RQb3NpdGlvbi55ID0gYmFsbFBhcmFtcy5maXhlZFk7XG5cbiAgICAgICAgLy8gPT09IOOCtOODvOODq+aUr+afseOBruS9nOaIkCA9PT1cbiAgICAgICAgY29uc3QgYmFzZUxpbmVYID0gcmluZ0NlbnRlclggLSAxLjU3NTtcbiAgICAgICAgY29uc3QgcGlsbGFyQmFzZVggPSBiYXNlTGluZVggLSAwLjU7XG4gICAgICAgIGNvbnN0IHBpbGxhckhlaWdodCA9IDMuMDtcbiAgICAgICAgY29uc3QgcGlsbGFyUmFkaXVzID0gMC4xO1xuICAgICAgICBjb25zdCBwaWxsYXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KHBpbGxhclJhZGl1cywgcGlsbGFyUmFkaXVzLCBwaWxsYXJIZWlnaHQsIDMyKTtcbiAgICAgICAgY29uc3QgcGlsbGFyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg1NTU1NTUgfSk7XG4gICAgICAgIGNvbnN0IHBpbGxhck1lc2ggPSBuZXcgVEhSRUUuTWVzaChwaWxsYXJHZW9tZXRyeSwgcGlsbGFyTWF0ZXJpYWwpO1xuICAgICAgICBwaWxsYXJNZXNoLnBvc2l0aW9uLnNldChwaWxsYXJCYXNlWCwgcGlsbGFySGVpZ2h0IC8gMiwgYm9hcmRDZW50ZXJaKTtcbiAgICAgICAgcGlsbGFyTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGlsbGFyTWVzaCk7XG4gICAgICAgIGNvbnN0IHBpbGxhclNoYXBlID0gbmV3IENBTk5PTi5DeWxpbmRlcihwaWxsYXJSYWRpdXMsIHBpbGxhclJhZGl1cywgcGlsbGFySGVpZ2h0LCAzMik7XG4gICAgICAgIGNvbnN0IHBpbGxhckJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCxcbiAgICAgICAgICAgIHNoYXBlOiBwaWxsYXJTaGFwZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMocGlsbGFyQmFzZVgsIHBpbGxhckhlaWdodCAvIDIsIGJvYXJkQ2VudGVyWiksXG4gICAgICAgIH0pO1xuICAgICAgICB3b3JsZC5hZGRCb2R5KHBpbGxhckJvZHkpO1xuXG4gICAgICAgIGNvbnN0IGFybUxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyhib2FyZENlbnRlclggLSBwaWxsYXJCYXNlWCwgMikgKyBNYXRoLnBvdyhib2FyZENlbnRlclkgLSBwaWxsYXJIZWlnaHQsIDIpKTtcbiAgICAgICAgY29uc3QgYXJtR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoYXJtTGVuZ3RoLCAwLjEsIDAuMSk7XG4gICAgICAgIGNvbnN0IGFybU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4NTU1NTU1IH0pO1xuICAgICAgICBjb25zdCBhcm1NZXNoID0gbmV3IFRIUkVFLk1lc2goYXJtR2VvbWV0cnksIGFybU1hdGVyaWFsKTtcbiAgICAgICAgYXJtTWVzaC5wb3NpdGlvbi5zZXQoXG4gICAgICAgICAgICBwaWxsYXJCYXNlWCArIChib2FyZENlbnRlclggLSBwaWxsYXJCYXNlWCkgLyAyLFxuICAgICAgICAgICAgcGlsbGFySGVpZ2h0ICsgKGJvYXJkQ2VudGVyWSAtIHBpbGxhckhlaWdodCkgLyAyLFxuICAgICAgICAgICAgYm9hcmRDZW50ZXJaXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGFybUFuZ2xlID0gTWF0aC5hdGFuMihib2FyZENlbnRlclkgLSBwaWxsYXJIZWlnaHQsIGJvYXJkQ2VudGVyWCAtIHBpbGxhckJhc2VYKTtcbiAgICAgICAgYXJtTWVzaC5yb3RhdGlvbi56ID0gYXJtQW5nbGU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFybU1lc2gpO1xuXG4gICAgICAgIGNvbnN0IGFybVNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKGFybUxlbmd0aCAvIDIsIDAuMDUsIDAuMDUpKTtcbiAgICAgICAgY29uc3QgYXJtQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAsIHNoYXBlOiBhcm1TaGFwZSB9KTtcbiAgICAgICAgYXJtQm9keS5wb3NpdGlvbi5jb3B5KGFybU1lc2gucG9zaXRpb24gYXMgYW55KTtcbiAgICAgICAgYXJtQm9keS5xdWF0ZXJuaW9uLmNvcHkoYXJtTWVzaC5xdWF0ZXJuaW9uIGFzIGFueSk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkoYXJtQm9keSk7XG5cbiAgICAgICAgLy8gPT09IOWcsOmdouOBruS9nOaIkCA9PT1cbiAgICAgICAgY29uc3QgcGxhbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweEY1RjVEQyB9KTtcbiAgICAgICAgdGhpcy5wbGFuZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSg0MCwgNDApLCBwbGFuZU1hdGVyaWFsKTtcbiAgICAgICAgdGhpcy5wbGFuZU1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgICh0aGlzLnBsYW5lTWVzaC5tYXRlcmlhbCBhcyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCkuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGU7XG4gICAgICAgIHRoaXMucGxhbmVNZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5wbGFuZU1lc2gpO1xuICAgICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpXG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IGdyb3VuZE1hdGVyaWFsXG4gICAgICAgIH0pXG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKVxuICAgICAgICBwbGFuZUJvZHkucG9zaXRpb24uc2V0KHRoaXMucGxhbmVNZXNoLnBvc2l0aW9uLngsIHRoaXMucGxhbmVNZXNoLnBvc2l0aW9uLnksIHRoaXMucGxhbmVNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbi5zZXQodGhpcy5wbGFuZU1lc2gucXVhdGVybmlvbi54LCB0aGlzLnBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHRoaXMucGxhbmVNZXNoLnF1YXRlcm5pb24ueiwgdGhpcy5wbGFuZU1lc2gucXVhdGVybmlvbi53KTtcbiAgICAgICAgd29ybGQuYWRkQm9keShwbGFuZUJvZHkpO1xuXG4gICAgICAgIC8vID09PSDog4zmma/jga7lo4Hjga7kvZzmiJAgPT09XG4gICAgICAgIGNvbnN0IHdhbGxXaWR0aCA9IDE1O1xuICAgICAgICBjb25zdCB3YWxsSGVpZ2h0ID0gMTA7XG4gICAgICAgIGNvbnN0IHdhbGxEZXB0aCA9IDAuMTtcbiAgICAgICAgY29uc3Qgd2FsbFBvc1ggPSBib2FyZENlbnRlclggLSAzO1xuICAgICAgICBjb25zdCB3YWxsUG9zWSA9IHdhbGxIZWlnaHQgLyAyO1xuICAgICAgICBjb25zdCB3YWxsUG9zWiA9IHJpbmdDZW50ZXJaIC0gKHJpbmdSYWRpdXMgLyAyKTtcbiAgICAgICAgY29uc3Qgd2FsbEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdhbGxXaWR0aCwgd2FsbEhlaWdodCwgd2FsbERlcHRoKTtcbiAgICAgICAgY29uc3Qgd2FsbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4RjVGNURDOSB9KTtcbiAgICAgICAgY29uc3Qgd2FsbE1lc2ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkod2FsbFdpZHRoLCB3YWxsSGVpZ2h0LCB3YWxsRGVwdGgpLCB3YWxsTWF0ZXJpYWwpO1xuICAgICAgICB3YWxsTWVzaC5yb3RhdGlvbi55ID0gTWF0aC5QSSAvIDI7XG4gICAgICAgIHdhbGxNZXNoLnBvc2l0aW9uLnNldCh3YWxsUG9zWCwgd2FsbFBvc1ksIHdhbGxQb3NaKTtcbiAgICAgICAgd2FsbE1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHdhbGxNZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh3YWxsTWVzaCk7XG4gICAgICAgIGNvbnN0IHdhbGxTaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyh3YWxsV2lkdGggLyAyLCB3YWxsSGVpZ2h0IC8gMiwgd2FsbERlcHRoIC8gMikpO1xuICAgICAgICBjb25zdCB3YWxsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLFxuICAgICAgICAgICAgc2hhcGU6IHdhbGxTaGFwZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMod2FsbFBvc1gsIHdhbGxQb3NZLCB3YWxsUG9zWilcbiAgICAgICAgfSk7XG4gICAgICAgIHdhbGxCb2R5LnF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKDAsIE1hdGguUEkgLyAyLCAwKTtcbiAgICAgICAgd29ybGQuYWRkQm9keSh3YWxsQm9keSk7XG5cblxuXG4gICAgICAgIC8vID09PSDjgrPjg7zjg4jjga7jg6njgqTjg7Pmj4/nlLsgPT09XG4gICAgICAgIGNvbnN0IHlQb3MgPSAwLjAxO1xuICAgICAgICBjb25zdCBjb3VydExpbmVDb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgICBjb25zdCByaW5nUHJvamVjdGlvblggPSByaW5nQ2VudGVyWDtcbiAgICAgICAgeyAvLyDliLbpmZDljLrln59cbiAgICAgICAgICAgIGNvbnN0IGFyZWFXaWR0aEF0QmFzZWxpbmUgPSA0Ljk7XG4gICAgICAgICAgICBjb25zdCBhcmVhV2lkdGhBdEZyZWVUaHJvd0xpbmUgPSAzLjY7XG4gICAgICAgICAgICBjb25zdCBmcmVlVGhyb3dMaW5lWCA9IDA7XG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IFRIUkVFLlZlY3RvcjNbXSA9IFtdO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoYmFzZUxpbmVYLCB5UG9zLCBhcmVhV2lkdGhBdEJhc2VsaW5lIC8gMikpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoZnJlZVRocm93TGluZVgsIHlQb3MsIGFyZWFXaWR0aEF0RnJlZVRocm93TGluZSAvIDIpKTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGZyZWVUaHJvd0xpbmVYLCB5UG9zLCAtYXJlYVdpZHRoQXRGcmVlVGhyb3dMaW5lIC8gMikpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoYmFzZUxpbmVYLCB5UG9zLCAtYXJlYVdpZHRoQXRCYXNlbGluZSAvIDIpKTtcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCkuc2V0RnJvbVBvaW50cyhwb2ludHMpO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogY291cnRMaW5lQ29sb3IgfSk7XG4gICAgICAgICAgICBjb25zdCByZXN0cmljdGVkQXJlYUxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQocmVzdHJpY3RlZEFyZWFMaW5lKTtcbiAgICAgICAgfVxuICAgICAgICB7IC8vIOOCs+ODvOODiOWkluWRqFxuICAgICAgICAgICAgY29uc3QgY291cnRIYWxmTGVuZ3RoID0gMTQ7XG4gICAgICAgICAgICBjb25zdCBjb3VydFdpZHRoID0gMTU7XG4gICAgICAgICAgICBjb25zdCBiYXNlTGluZVJlYXJYID0gYm9hcmRDZW50ZXJYIC0gMS4xNTA7XG4gICAgICAgICAgICBjb25zdCBjb3VydFBvaW50czogVEhSRUUuVmVjdG9yM1tdID0gW107XG4gICAgICAgICAgICBjb3VydFBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGJhc2VMaW5lUmVhclgsIHlQb3MsIC1jb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY291cnRQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVJlYXJYLCB5UG9zLCBjb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY291cnRQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVJlYXJYLCB5UG9zLCAtY291cnRXaWR0aCAvIDIpKTtcbiAgICAgICAgICAgIGNvdXJ0UG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoYmFzZUxpbmVSZWFyWCArIGNvdXJ0SGFsZkxlbmd0aCwgeVBvcywgLWNvdXJ0V2lkdGggLyAyKSk7XG4gICAgICAgICAgICBjb3VydFBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGJhc2VMaW5lUmVhclggKyBjb3VydEhhbGZMZW5ndGgsIHlQb3MsIC1jb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY291cnRQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVJlYXJYICsgY291cnRIYWxmTGVuZ3RoLCB5UG9zLCBjb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY291cnRQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVJlYXJYICsgY291cnRIYWxmTGVuZ3RoLCB5UG9zLCBjb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY291cnRQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVJlYXJYLCB5UG9zLCBjb3VydFdpZHRoIC8gMikpO1xuICAgICAgICAgICAgY29uc3QgY291cnRHZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpLnNldEZyb21Qb2ludHMoY291cnRQb2ludHMpO1xuICAgICAgICAgICAgY29uc3QgY291cnRNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwMCB9KTtcbiAgICAgICAgICAgIGNvbnN0IGNvdXJ0TGluZSA9IG5ldyBUSFJFRS5MaW5lU2VnbWVudHMoY291cnRHZW9tZXRyeSwgY291cnRNYXRlcmlhbCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChjb3VydExpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHsgLy8gM+ODneOCpOODs+ODiOODqeOCpOODs1xuICAgICAgICAgICAgY29uc3QgdGhyZWVQb2ludFJhZGl1cyA9IDYuNzU7XG4gICAgICAgICAgICBjb25zdCBzaWRlbGluZVogPSAoMTUgLyAyKSAtIDAuOTtcbiAgICAgICAgICAgIGNvbnN0IGludGVyc2VjdGlvblggPSByaW5nUHJvamVjdGlvblggKyBNYXRoLnNxcnQodGhyZWVQb2ludFJhZGl1cyAqKiAyIC0gc2lkZWxpbmVaICoqIDIpO1xuICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBUSFJFRS5WZWN0b3IzW10gPSBbXTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGJhc2VMaW5lWCwgeVBvcywgc2lkZWxpbmVaKSk7XG4gICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhpbnRlcnNlY3Rpb25YLCB5UG9zLCBzaWRlbGluZVopKTtcbiAgICAgICAgICAgIGNvbnN0IGFyY1NlZ21lbnRzID0gNTA7XG4gICAgICAgICAgICBjb25zdCBzdGFydEFuZ2xlID0gTWF0aC5hc2luKHNpZGVsaW5lWiAvIHRocmVlUG9pbnRSYWRpdXMpO1xuICAgICAgICAgICAgY29uc3QgZW5kQW5nbGUgPSAtc3RhcnRBbmdsZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGFyY1NlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IHN0YXJ0QW5nbGUgKyAoZW5kQW5nbGUgLSBzdGFydEFuZ2xlKSAqIGkgLyBhcmNTZWdtZW50cztcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gcmluZ1Byb2plY3Rpb25YICsgdGhyZWVQb2ludFJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKTtcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gdGhyZWVQb2ludFJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyh4LCB5UG9zLCB6KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhpbnRlcnNlY3Rpb25YLCB5UG9zLCAtc2lkZWxpbmVaKSk7XG4gICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhiYXNlTGluZVgsIHlQb3MsIC1zaWRlbGluZVopKTtcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCkuc2V0RnJvbVBvaW50cyhwb2ludHMpO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogY291cnRMaW5lQ29sb3IsIGxpbmV3aWR0aDogMiB9KTtcbiAgICAgICAgICAgIGNvbnN0IHRocmVlUG9pbnRMaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRocmVlUG9pbnRMaW5lKTtcbiAgICAgICAgfVxuICAgICAgICB7IC8vIOODleODquODvOOCueODreODvOODqeOCpOODs+WNiuWGhlxuICAgICAgICAgICAgY29uc3QgZnJlZVRocm93Q2lyY2xlUmFkaXVzID0gMS44O1xuICAgICAgICAgICAgY29uc3QgZnJlZVRocm93TGluZVggPSAwO1xuICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBUSFJFRS5WZWN0b3IzW10gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyY1NlZ21lbnRzID0gMzI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcmNTZWdtZW50czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhldGEgPSAtTWF0aC5QSSAvIDIgKyAoTWF0aC5QSSAqIGkpIC8gYXJjU2VnbWVudHM7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGZyZWVUaHJvd0NpcmNsZVJhZGl1cyAqIE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gZnJlZVRocm93Q2lyY2xlUmFkaXVzICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKHgsIHlQb3MsIHopKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCkuc2V0RnJvbVBvaW50cyhwb2ludHMpO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogY291cnRMaW5lQ29sb3IgfSk7XG4gICAgICAgICAgICBjb25zdCBmcmVlVGhyb3dDaXJjbGVMaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGZyZWVUaHJvd0NpcmNsZUxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHsgLy8g44OO44O844OB44Oj44O844K444K744Of44K144O844Kv44OrXG4gICAgICAgICAgICBjb25zdCBub0NoYXJnZVJhZGl1cyA9IDEuMjU7XG4gICAgICAgICAgICBjb25zdCBwb2ludHM6IFRIUkVFLlZlY3RvcjNbXSA9IFtdO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoYm9hcmRDZW50ZXJYLCB5UG9zLCBub0NoYXJnZVJhZGl1cykpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMocmluZ1Byb2plY3Rpb25YLCB5UG9zLCBub0NoYXJnZVJhZGl1cykpO1xuICAgICAgICAgICAgY29uc3QgYXJjU2VnbWVudHMgPSAzMjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGFyY1NlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aGV0YSA9IChNYXRoLlBJIC8gMikgLSAoTWF0aC5QSSAqIGkgLyBhcmNTZWdtZW50cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHJpbmdQcm9qZWN0aW9uWCArIG5vQ2hhcmdlUmFkaXVzICogTWF0aC5jb3ModGhldGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHogPSBub0NoYXJnZVJhZGl1cyAqIE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyh4LCB5UG9zLCB6KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhyaW5nUHJvamVjdGlvblgsIHlQb3MsIC1ub0NoYXJnZVJhZGl1cykpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoYm9hcmRDZW50ZXJYLCB5UG9zLCAtbm9DaGFyZ2VSYWRpdXMpKTtcbiAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCkuc2V0RnJvbVBvaW50cyhwb2ludHMpO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogY291cnRMaW5lQ29sb3IgfSk7XG4gICAgICAgICAgICBjb25zdCBub0NoYXJnZUxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobm9DaGFyZ2VMaW5lKTtcbiAgICAgICAgfVxuICAgICAgICB7IC8vIOODkOODg+OCr+ODnOODvOODieWkluaeoFxuICAgICAgICAgICAgY29uc3Qgb3V0ZXJMaW5lVGhpY2tuZXNzID0gMC4wNDtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVPZmZzZXQgPSAwLjAwMTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVEZXB0aCA9IDAuMDE7XG4gICAgICAgICAgICBjb25zdCBlZGdlQ29sb3IgPSAweDAwMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IG91dGVyV2lkdGggPSBib2FyZFdpZHRoIC0gMiAqIGxpbmVPZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCBvdXRlckhlaWdodCA9IGJvYXJkSGVpZ2h0IC0gMiAqIGxpbmVPZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCBlZGdlWCA9IGJvYXJkQ2VudGVyWCArIGJvYXJkRGVwdGggLyAyICsgbGluZURlcHRoIC8gMjtcbiAgICAgICAgICAgIGNvbnN0IG91dGVyRWRnZXMgPSBbXG4gICAgICAgICAgICAgICAgeyBzaXplOiBbbGluZURlcHRoLCBvdXRlckxpbmVUaGlja25lc3MsIG91dGVyV2lkdGhdLCBwb3NpdGlvbjogW2VkZ2VYLCBib2FyZENlbnRlclkgKyAob3V0ZXJIZWlnaHQgLyAyKSAtIG91dGVyTGluZVRoaWNrbmVzcyAvIDIsIGJvYXJkQ2VudGVyWl0gfSxcbiAgICAgICAgICAgICAgICB7IHNpemU6IFtsaW5lRGVwdGgsIG91dGVyTGluZVRoaWNrbmVzcywgb3V0ZXJXaWR0aF0sIHBvc2l0aW9uOiBbZWRnZVgsIGJvYXJkQ2VudGVyWSAtIChvdXRlckhlaWdodCAvIDIpICsgb3V0ZXJMaW5lVGhpY2tuZXNzIC8gMiwgYm9hcmRDZW50ZXJaXSB9LFxuICAgICAgICAgICAgICAgIHsgc2l6ZTogW2xpbmVEZXB0aCwgb3V0ZXJIZWlnaHQsIG91dGVyTGluZVRoaWNrbmVzc10sIHBvc2l0aW9uOiBbZWRnZVgsIGJvYXJkQ2VudGVyWSwgYm9hcmRDZW50ZXJaICsgKG91dGVyV2lkdGggLyAyKSAtIG91dGVyTGluZVRoaWNrbmVzcyAvIDJdIH0sXG4gICAgICAgICAgICAgICAgeyBzaXplOiBbbGluZURlcHRoLCBvdXRlckhlaWdodCwgb3V0ZXJMaW5lVGhpY2tuZXNzXSwgcG9zaXRpb246IFtlZGdlWCwgYm9hcmRDZW50ZXJZLCBib2FyZENlbnRlclogLSAob3V0ZXJXaWR0aCAvIDIpICsgb3V0ZXJMaW5lVGhpY2tuZXNzIC8gMl0gfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBvdXRlckVkZ2VzLmZvckVhY2goKHsgc2l6ZSwgcG9zaXRpb24gfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IGVkZ2VDb2xvciB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldChwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIHBvc2l0aW9uWzJdKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHsgLy8g44OQ44OD44Kv44Oc44O844OJ5YaF5p6gXG4gICAgICAgICAgICBjb25zdCBpbm5lcmJvYXJkV2lkdGggPSAwLjU5O1xuICAgICAgICAgICAgY29uc3QgaW5uZXJMaW5lUG9pbnRzID0gW1xuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGJvYXJkQ2VudGVyWCArIGJvYXJkRGVwdGgsIGJvYXJkQm90dG9tWSArIDAuNTUsIGlubmVyYm9hcmRXaWR0aCAvIDIpLFxuICAgICAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGJvYXJkQ2VudGVyWCArIGJvYXJkRGVwdGgsIGJvYXJkQm90dG9tWSArIDAuNTUsIC1pbm5lcmJvYXJkV2lkdGggLyAyKSxcbiAgICAgICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMyhib2FyZENlbnRlclggKyBib2FyZERlcHRoLCBib2FyZEJvdHRvbVkgKyAwLjI1LCAtaW5uZXJib2FyZFdpZHRoIC8gMiksXG4gICAgICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoYm9hcmRDZW50ZXJYICsgYm9hcmREZXB0aCwgYm9hcmRCb3R0b21ZICsgMC4yNSwgaW5uZXJib2FyZFdpZHRoIC8gMiksXG4gICAgICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoYm9hcmRDZW50ZXJYICsgYm9hcmREZXB0aCwgYm9hcmRCb3R0b21ZICsgMC41NSwgaW5uZXJib2FyZFdpZHRoIC8gMiksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgY29uc3QgaW5uZXJMaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKS5zZXRGcm9tUG9pbnRzKGlubmVyTGluZVBvaW50cyk7XG4gICAgICAgICAgICBjb25zdCBpbm5lckxpbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwMCB9KTtcbiAgICAgICAgICAgIGNvbnN0IGlubmVyTGluZSA9IG5ldyBUSFJFRS5MaW5lKGlubmVyTGluZUdlb21ldHJ5LCBpbm5lckxpbmVNYXRlcmlhbCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChpbm5lckxpbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09IOeSsOWig+ioreWumu+8iOODqeOCpOODiOOAgeODmOODq+ODkeODvOOBquOBqe+8iSA9PT1cbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cblxuICAgICAgICAvLyA9PT0g44Kt44O844Oc44O844OJ5YWl5Yqb44Gu5Yem55CGID09PVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmJhbGxCb2R5IHx8ICF0aGlzLmNhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0JhbGxJbkZsaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RTaG90UG9zaXRpb24uY29weSh0aGlzLmJhbGxCb2R5LnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0JhbGxJbkZsaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkucG9zaXRpb24ueSA9IGJhbGxQYXJhbXMuZml4ZWRZO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZVJhZCA9IHNob290UGFyYW1zLmRpcmVjdGlvbkFuZ2xlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVlZCA9IHNob290UGFyYW1zLnBvd2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2eCA9IC1zcGVlZCAqIE1hdGguY29zKGFuZ2xlUmFkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdnogPSAtc3BlZWQgKiBNYXRoLnNpbihhbmdsZVJhZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkudmVsb2NpdHkuc2V0KHZ4LCBzaG9vdFBhcmFtcy5sYXVuY2hBbmdsZSwgdnopO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ3InIHx8IGV2ZW50LmtleSA9PT0gJ1InKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0JhbGxJbkZsaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkudmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLmNvcHkodGhpcy5sYXN0U2hvdFBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbW92ZVNwZWVkID0gMC4yO1xuICAgICAgICAgICAgbGV0IG1vdmVkQnlLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IGNhbWVyYURpcmVjdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgICAgICAgICB0aGlzLmNhbWVyYS5nZXRXb3JsZERpcmVjdGlvbihjYW1lcmFEaXJlY3Rpb24pO1xuICAgICAgICAgICAgY2FtZXJhRGlyZWN0aW9uLnkgPSAwO1xuICAgICAgICAgICAgY2FtZXJhRGlyZWN0aW9uLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgY29uc3QgcmlnaHREaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpLmNyb3NzVmVjdG9ycyhuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKSwgY2FtZXJhRGlyZWN0aW9uKS5ub3JtYWxpemUoKTtcblxuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5wb3NpdGlvbi54ICs9IGNhbWVyYURpcmVjdGlvbi54ICogbW92ZVNwZWVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnogKz0gY2FtZXJhRGlyZWN0aW9uLnogKiBtb3ZlU3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkQnlLZXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnggLT0gY2FtZXJhRGlyZWN0aW9uLnggKiBtb3ZlU3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkucG9zaXRpb24ueiAtPSBjYW1lcmFEaXJlY3Rpb24ueiAqIG1vdmVTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgbW92ZWRCeUtleSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkucG9zaXRpb24ueCArPSByaWdodERpcmVjdGlvbi54ICogbW92ZVNwZWVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnogKz0gcmlnaHREaXJlY3Rpb24ueiAqIG1vdmVTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgbW92ZWRCeUtleSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnggLT0gcmlnaHREaXJlY3Rpb24ueCAqIG1vdmVTcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5wb3NpdGlvbi56IC09IHJpZ2h0RGlyZWN0aW9uLnogKiBtb3ZlU3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkQnlLZXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vdmVkQnlLZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmFsbEluRmxpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS52ZWxvY2l0eS5zZXQoMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyA9PT0g54mp55CG5ryU566X44Go5o+P55S744Gu5pu05paw44Or44O844OXID09PVxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICB3b3JsZC5zdGVwKDEgLyA2MCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJhbGxCb2R5KSB7XG4gICAgICAgICAgICAgICAgLy8g552A5Zyw5Yik5a6aXG4gICAgICAgICAgICAgICAgY29uc3QgaXNMYW5kZWQgPSB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnkgPCBiYWxsUmFkaXVzICsgMC4xICYmIE1hdGguYWJzKHRoaXMuYmFsbEJvZHkudmVsb2NpdHkueSkgPCAwLjU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNCYWxsSW5GbGlnaHQgJiYgaXNMYW5kZWQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnZlbG9jaXR5LnNldCgwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOeKtuaFi+OBq+W/nOOBmOOBn+ODnOODvOODq+OBqOODnuODvOOCq+ODvOOBruWItuW+oVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0JhbGxJbkZsaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLnkgPSBiYWxsUGFyYW1zLmZpeGVkWTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS52ZWxvY2l0eS55ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYmFsbEluZGljYXRvci52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYmFsbEluZGljYXRvci5wb3NpdGlvbi54ID0gdGhpcy5iYWxsQm9keS5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgICAgICBiYWxsSW5kaWNhdG9yLnBvc2l0aW9uLnogPSB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLno7XG5cbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uQXJyb3cudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbkFycm93LnBvc2l0aW9uLmNvcHkodGhpcy5iYWxsQm9keS5wb3NpdGlvbiBhcyBhbnkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZVJhZCA9IHNob290UGFyYW1zLmRpcmVjdGlvbkFuZ2xlICogKE1hdGguUEkgLyAxODApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3dlciA9IHNob290UGFyYW1zLnBvd2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXVuY2hZID0gc2hvb3RQYXJhbXMubGF1bmNoQW5nbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvb3RWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgICAgIC1wb3dlciAqIE1hdGguY29zKGFuZ2xlUmFkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdW5jaFksXG4gICAgICAgICAgICAgICAgICAgICAgICAtcG93ZXIgKiBNYXRoLnNpbihhbmdsZVJhZClcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcnJvd0xlbmd0aCA9IHNob290VmVjdG9yLmxlbmd0aCgpICogMC4yO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25BcnJvdy5zZXRMZW5ndGgoYXJyb3dMZW5ndGgsIDAuNSwgMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uQXJyb3cuc2V0RGlyZWN0aW9uKHNob290VmVjdG9yLm5vcm1hbGl6ZSgpKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJhbGxJbmRpY2F0b3IudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25BcnJvdy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6KaL44Gf55uu44Go54mp55CG44Kq44OW44K444Kn44Kv44OI44Gu5ZCM5pyfXG4gICAgICAgICAgICAgICAgYmFsbE1lc2gucG9zaXRpb24uc2V0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkucG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5wb3NpdGlvbi56XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBiYWxsTWVzaC5xdWF0ZXJuaW9uLnNldChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5xdWF0ZXJuaW9uLngsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbEJvZHkucXVhdGVybmlvbi55LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxCb2R5LnF1YXRlcm5pb24ueixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsQm9keS5xdWF0ZXJuaW9uLndcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgfVxufVxuXG4vLyA9PT0g44OX44Ot44Kw44Op44Og44Gu6ZaL5aeL54K5ID09PVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoNSwgMywgNCkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc19saWwtZ3VpX2Rpc3RfbGlsLWd1aV9lc21fanMtbm9kLTM3NmQ1MFwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==