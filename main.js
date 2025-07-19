/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");



class ThreeJSContainer {
    scene;
    light;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createTrimeshFromGeometry = (geometry) => {
        // Float32Array から number[] に変換する
        const vertices = Array.from(geometry.attributes.position.array);
        // インデックスも同様に number[] に変換（indexがあれば）
        const indices = geometry.index ? Array.from(geometry.index.array) : [];
        return new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Trimesh(vertices, indices);
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.3;
        world.defaultContactMaterial.restitution = 0.3;
        // --- バックボード（板） ---
        const boardWidth = 1.8; // 実際の幅 (1800mm)
        const boardHeight = 1.05; // 実際の高さ (1050mm)
        const boardDepth = 0.05; // 図面からの厚み (30mm)
        const boardCenterX = -4.572; // -4.572m
        const boardCenterY = 3.20; // 3.20m
        const boardCenterZ = 0;
        const boardGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(boardDepth, boardHeight, boardWidth); // 奥行き(X), 高さ(Y), 幅(Z)
        const boardMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xffffff, transparent: true, }); // 透明度を追加
        const boardMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(boardGeometry, boardMaterial);
        boardMesh.position.set(boardCenterX, boardCenterY, boardCenterZ);
        boardMesh.castShadow = true; //影を落とす
        this.scene.add(boardMesh);
        const boardPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material('boardMat');
        const boardBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(boardDepth / 2, boardHeight / 2, boardWidth / 2)),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(boardCenterX, boardCenterY, boardCenterZ),
            material: boardPhysMaterial
        });
        world.addBody(boardBody);
        // --- 謎の部品（サポートアーム） ---
        const supportArmDepth = 0.03; // 厚さ (3cm -> 0.03m)
        const supportArmHeight = 0.15; // 縦の長さ (15cm -> 0.15m)
        const supportArmWidth = 0.14; // 横の長さ (14cm -> 0.14m)
        // バックボードのX座標の下端
        const boardFront = boardCenterX + (boardDepth / 2); // バックボードの最も手前側のX座標
        // サポートアームのX座標
        // 「板のX座標＋板の厚み」とありますが、これはバックボードの"前面"からの距離と解釈します。
        // サポートアームの最も奥（バックボードに接する）X座標がboardFrontXになるようにします
        const supportArmStart = boardFront;
        // サポートアームの中心X座標
        const supportArmCenterX = supportArmStart + (supportArmDepth / 2);
        // バックボードの下端Y座標
        const boardBottomY = boardCenterY - (boardHeight / 2);
        // サポートアームのY座標の中心 = バックボードのY座標の下端から+15cm + サポートアームの高さの半分
        const supportArmCenterY = boardBottomY + (0.15) + (supportArmHeight / 2);
        // Z座標はバックボードと同様に中央
        const supportArmCenterZ = 0;
        const supportArmGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(supportArmDepth, supportArmHeight, supportArmWidth);
        const supportArmMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x888888 }); // グレー系の色
        const supportArmMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(supportArmGeometry, supportArmMaterial);
        supportArmMesh.rotation.z = Math.PI / 2;
        supportArmMesh.position.set(supportArmCenterX, supportArmCenterY, supportArmCenterZ);
        supportArmMesh.castShadow = true;
        this.scene.add(supportArmMesh);
        const supportArmBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(supportArmDepth / 2, supportArmHeight / 2, supportArmWidth / 2)),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(supportArmCenterX, supportArmCenterY, supportArmCenterZ)
        });
        world.addBody(supportArmBody);
        // --- リング（ゴール） ---
        const ringRadius = 0.45 / 2; // 0.225m
        const ringTube = 0.03; // 厚さ (3cm -> 0.03m)
        const supportArmFrontX = supportArmCenterX + supportArmDepth * 3;
        const ringCenterX = supportArmFrontX + ringRadius;
        // リングのY座標（中心）= バックボードのY座標の下端から+15cm
        const ringCenterY = boardBottomY + 0.15 + (supportArmHeight / 2); // リングの中心がこの高さになるように
        // Z座標は中央
        const ringCenterZ = 0;
        const ringGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.TorusGeometry(ringRadius, ringTube / 2, 16, 100); // tubeは半径で指定
        const ringMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xff0000 });
        const ringMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2; // 地面と平行に、X軸に向かって開く
        ringMesh.position.set(ringCenterX, ringCenterY, ringCenterZ);
        ringMesh.castShadow = true;
        this.scene.add(ringMesh);
        // --- 1. 追加: リング用の物理マテリアルを作成 ---
        const ringPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material('ringMat');
        //         // --- リングの物理表現を Cylinder で近似 ---
        // const numSegments = 18;
        // const expansion = 0.005;
        // for (let i = 0; i < numSegments; i++) {
        //     const angle = (i / numSegments) * Math.PI * 2;
        //     const adjustedAngle = angle + (Math.PI / numSegments / 2);
        //     const x = ringCenterX;
        //     const y = ringCenterY + Math.cos(angle) * (ringRadius + expansion);
        //     const z = ringCenterZ + Math.sin(angle) * (ringRadius + expansion);
        //     const segmentShape = new CANNON.Cylinder(
        //         ringTube / 2, ringTube / 2,
        //         ringTube * 0.5, // できるだけ短く
        //         8
        // //     );
        // //     const segmentBody = new CANNON.Body({
        // //         mass: 0,
        // //         shape: segmentShape,
        // //         position: new CANNON.Vec3(x, y, z),
        // //         material: ringPhysMaterial
        // //     });
        //     const quaternion = new CANNON.Quaternion();
        //     quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), adjustedAngle);
        //     const tilt = new CANNON.Quaternion();
        //     tilt.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
        //     quaternion.mult(tilt, quaternion);
        //     segmentBody.quaternion.copy(quaternion);
        //     world.addBody(segmentBody);
        // }
        // --- 2. 変更: Trimeshでリングの物理形状を作成 ---
        ringGeometry.computeVertexNormals(); // 法線の計算（念のため）
        ringGeometry.computeBoundingBox(); // 境界ボックス計算（念のため）
        // Trimesh作成（自作関数を使う）
        const ringShape = this.createTrimeshFromGeometry(ringGeometry);
        // リング用の物理ボディ作成
        const ringBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            shape: ringShape,
            material: ringPhysMaterial,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(ringCenterX, ringCenterY, ringCenterZ),
        });
        // TorusGeometryの向きをCANNON.jsに合わせて回転させる
        ringBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
        world.addBody(ringBody);
        // CANNON.jsのリングのボディ（簡略化のためCylinderShapeを使
        // --- バスケットボール ---
        const ballRadius = 0.245 / 2; // 小さめにしてリングを通れるようにする
        const ballGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(ballRadius, 32, 32);
        const ballMeshMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xffa500 });
        const ballMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(ballGeometry, ballMeshMaterial);
        ballMesh.castShadow = true;
        ballMesh.position.set(0, 2.5, 0);
        this.scene.add(ballMesh);
        const ballPhysMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material('ballMat');
        const groundMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material('groundMat');
        const contactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(ballPhysMaterial, groundMaterial, {
            restitution: 0.8,
            friction: 0.3
        });
        world.addContactMaterial(contactMaterial);
        // --- 4. 新規追加: ボールとリングの接触特性 ---
        const ballRingContactMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(ballPhysMaterial, ringPhysMaterial, {
            restitution: 0.2,
            friction: 0.6
        });
        world.addContactMaterial(ballRingContactMaterial);
        // Cannon-es用の剛体
        const ballBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0.6,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(ballRadius),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 2.5, 0),
            material: ballPhysMaterial
        });
        world.addBody(ballBody);
        //Ballのシュート
        ballBody.velocity.set(-5, 4.0, 2);
        // --- 支柱の追加（地面からバックボードまでの柱） ---
        const pillarHeight = boardCenterY; // 地面からバックボードの高さまでの距離
        const pillarGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.1, pillarHeight, 0.1);
        const pillarMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x555555 });
        const pillarMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(pillarGeometry, pillarMaterial);
        // 支柱の位置：バックボードのX,Z座標と同じ、Yは柱の高さの半分
        pillarMesh.position.set(boardCenterX - boardDepth, pillarHeight / 2, boardCenterZ);
        pillarMesh.castShadow = true;
        this.scene.add(pillarMesh);
        const pillarBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            shape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.05, pillarHeight / 2, 0.05)),
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(boardCenterX, pillarHeight / 2, boardCenterZ),
        });
        world.addBody(pillarBody);
        // --- バックボードのボディと支柱を固定ジョイントで繋ぐ ---
        const lockConstraint = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.LockConstraint(boardBody, pillarBody);
        world.addConstraint(lockConstraint);
        //地面作成
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial();
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(40, 40);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            material: groundMaterial
        });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        world.addBody(planeBody);
        const boardPosX = ringCenterX;
        const boardPosY = ringCenterY + 0.3;
        const boardPosZ = ringCenterZ - (ringRadius + boardDepth / 2);
        const blackLineMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.LineBasicMaterial({ color: 0x000000 });
        // --- ゴールの後ろの壁の設定 ---
        const wallWidth = 10; // 壁の横幅（リングの背面より少し大きめに）
        const wallHeight = 10; // 壁の高さ
        const wallDepth = 0.1; // 壁の厚み（奥行き）
        // 壁の位置（リングの後ろ、Z軸で調整）
        const wallPosX = boardCenterX - 1.2; // リングと同じX位置
        const wallPosY = wallHeight / 2; // リングと同じ高さか少し高め
        const wallPosZ = ringCenterZ - (ringRadius + wallDepth / 2 + 0.1); // リングの後ろに少し距離を取る
        // Three.jsの壁メッシュ
        const wallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(wallWidth, wallHeight, wallDepth);
        const wallMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.9 });
        const wallMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(wallGeometry, wallMaterial);
        wallMesh.rotation.y = Math.PI / 2;
        wallMesh.position.set(wallPosX, wallPosY, wallPosZ);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        this.scene.add(wallMesh);
        // CANNON.jsの壁剛体
        const wallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallWidth / 2, wallHeight / 2, wallDepth / 2));
        const wallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 0,
            shape: wallShape,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallPosX, wallPosY, wallPosZ)
        });
        world.addBody(wallBody);
        const margin = 0.05; // 5cm
        const outerGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry().setFromPoints([
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-boardWidth / 2 + margin, boardHeight / 2 - margin, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(boardWidth / 2 - margin, boardHeight / 2 - margin, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(boardWidth / 2 - margin, -boardHeight / 2 + margin, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-boardWidth / 2 + margin, -boardHeight / 2 + margin, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-boardWidth / 2 + margin, boardHeight / 2 - margin, 0.001),
        ]);
        const outerLine = new three__WEBPACK_IMPORTED_MODULE_1__.Line(outerGeometry, blackLineMaterial);
        outerLine.position.set(boardPosX, boardPosY, boardPosZ + boardDepth / 2 + 0.001); // 少し手前に
        this.scene.add(outerLine);
        // === 内側四角形の黒線 ===
        const rectWidth = 0.59; // 59cm
        const rectHeight = 0.45; // 45cm
        const rectBottomMargin = 0.1; // バックボードの下から10cm
        const rectLeft = -rectWidth / 2;
        const rectRight = rectWidth / 2;
        const rectBottom = -boardHeight / 2 + rectBottomMargin;
        const rectTop = rectBottom + rectHeight;
        const innerGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry().setFromPoints([
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(rectLeft, rectTop, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(rectRight, rectTop, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(rectRight, rectBottom, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(rectLeft, rectBottom, 0.001),
            new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(rectLeft, rectTop, 0.001),
        ]);
        const innerLine = new three__WEBPACK_IMPORTED_MODULE_1__.Line(innerGeometry, blackLineMaterial);
        innerLine.position.set(boardPosX, boardPosY, boardPosZ + boardDepth / 2 + 0.001);
        this.scene.add(innerLine);
        // グリッド表示
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(10);
        this.scene.add(gridHelper);
        // 軸表示
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        let update = (time) => {
            world.step(1 / 60); // 実際の時間に基づいて補間
            ballMesh.position.set(ballBody.position.x, ballBody.position.y, ballBody.position.z);
            ballMesh.quaternion.set(ballBody.quaternion.x, ballBody.quaternion.y, ballBody.quaternion.z, ballBody.quaternion.w);
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(5, 5, 5));
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tICdjYW5ub24tZXMnO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgfVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy/jgrfjg6Pjg4njgqbjg57jg4Pjg5fjgpLmnInlirnjgavjgZnjgotcblxuICAgICAgICAvL+OCq+ODoeODqeOBruioreWumlxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlVHJpbWVzaEZyb21HZW9tZXRyeSA9IChnZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnkpOiBDQU5OT04uVHJpbWVzaCA9PiB7XG4gICAgICAgIC8vIEZsb2F0MzJBcnJheSDjgYvjgokgbnVtYmVyW10g44Gr5aSJ5o+b44GZ44KLXG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gQXJyYXkuZnJvbShnZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5KTtcblxuICAgICAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjgoLlkIzmp5jjgasgbnVtYmVyW10g44Gr5aSJ5o+b77yIaW5kZXjjgYzjgYLjgozjgbDvvIlcbiAgICAgICAgY29uc3QgaW5kaWNlcyA9IGdlb21ldHJ5LmluZGV4ID8gQXJyYXkuZnJvbShnZW9tZXRyeS5pbmRleC5hcnJheSkgOiBbXTtcblxuICAgICAgICByZXR1cm4gbmV3IENBTk5PTi5UcmltZXNoKHZlcnRpY2VzLCBpbmRpY2VzKTtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIGNvbnN0IHdvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7IGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCkgfSk7XG4gICAgICAgIHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwuZnJpY3Rpb24gPSAwLjM7XG4gICAgICAgIHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjM7XG4gICAgICAgIC8vIC0tLSDjg5Djg4Pjgq/jg5zjg7zjg4nvvIjmnb/vvIkgLS0tXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSAxLjg7IC8vIOWun+mam+OBruW5hSAoMTgwMG1tKVxuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IDEuMDU7IC8vIOWun+mam+OBrumrmOOBlSAoMTA1MG1tKVxuICAgICAgICBjb25zdCBib2FyZERlcHRoID0gMC4wNTsgLy8g5Zuz6Z2i44GL44KJ44Gu5Y6a44G/ICgzMG1tKVxuXG4gICAgICAgIGNvbnN0IGJvYXJkQ2VudGVyWCA9IC00LjU3MjsgLy8gLTQuNTcybVxuICAgICAgICBjb25zdCBib2FyZENlbnRlclkgPSAzLjIwOyAgIC8vIDMuMjBtXG4gICAgICAgIGNvbnN0IGJvYXJkQ2VudGVyWiA9IDA7XG5cbiAgICAgICAgY29uc3QgYm9hcmRHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShib2FyZERlcHRoLCBib2FyZEhlaWdodCwgYm9hcmRXaWR0aCk7IC8vIOWlpeihjOOBjShYKSwg6auY44GVKFkpLCDluYUoWilcbiAgICAgICAgY29uc3QgYm9hcmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiwgdHJhbnNwYXJlbnQ6IHRydWUsIH0pOyAvLyDpgI/mmI7luqbjgpLov73liqBcbiAgICAgICAgY29uc3QgYm9hcmRNZXNoID0gbmV3IFRIUkVFLk1lc2goYm9hcmRHZW9tZXRyeSwgYm9hcmRNYXRlcmlhbCk7XG4gICAgICAgIGJvYXJkTWVzaC5wb3NpdGlvbi5zZXQoYm9hcmRDZW50ZXJYLCBib2FyZENlbnRlclksIGJvYXJkQ2VudGVyWik7XG4gICAgICAgIGJvYXJkTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTsgLy/lvbHjgpLokL3jgajjgZlcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYm9hcmRNZXNoKTtcblxuICAgICAgICBjb25zdCBib2FyZFBoeXNNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoJ2JvYXJkTWF0Jyk7XG5cbiAgICAgICAgY29uc3QgYm9hcmRCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDAsXG4gICAgICAgICAgICBzaGFwZTogbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKGJvYXJkRGVwdGggLyAyLCBib2FyZEhlaWdodCAvIDIsIGJvYXJkV2lkdGggLyAyKSksXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKGJvYXJkQ2VudGVyWCwgYm9hcmRDZW50ZXJZLCBib2FyZENlbnRlclopLFxuICAgICAgICAgICAgbWF0ZXJpYWw6IGJvYXJkUGh5c01hdGVyaWFsXG4gICAgICAgIH0pO1xuICAgICAgICB3b3JsZC5hZGRCb2R5KGJvYXJkQm9keSk7XG5cblxuICAgICAgICAvLyAtLS0g6KyO44Gu6YOo5ZOB77yI44K144Od44O844OI44Ki44O844Og77yJIC0tLVxuICAgICAgICBjb25zdCBzdXBwb3J0QXJtRGVwdGggPSAwLjAzOyAvLyDljprjgZUgKDNjbSAtPiAwLjAzbSlcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUhlaWdodCA9IDAuMTU7IC8vIOe4puOBrumVt+OBlSAoMTVjbSAtPiAwLjE1bSlcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybVdpZHRoID0gMC4xNDsgLy8g5qiq44Gu6ZW344GVICgxNGNtIC0+IDAuMTRtKVxuXG4gICAgICAgIC8vIOODkOODg+OCr+ODnOODvOODieOBrljluqfmqJnjga7kuIvnq69cbiAgICAgICAgY29uc3QgYm9hcmRGcm9udCA9IGJvYXJkQ2VudGVyWCArIChib2FyZERlcHRoIC8gMik7IC8vIOODkOODg+OCr+ODnOODvOODieOBruacgOOCguaJi+WJjeWBtOOBrljluqfmqJlcblxuICAgICAgICAvLyDjgrXjg53jg7zjg4jjgqLjg7zjg6Djga5Y5bqn5qiZXG4gICAgICAgIC8vIOOAjOadv+OBrljluqfmqJnvvIvmnb/jga7ljprjgb/jgI3jgajjgYLjgorjgb7jgZnjgYzjgIHjgZPjgozjga/jg5Djg4Pjgq/jg5zjg7zjg4njga5cIuWJjemdolwi44GL44KJ44Gu6Led6Zui44Go6Kej6YeI44GX44G+44GZ44CCXG4gICAgICAgIC8vIOOCteODneODvOODiOOCouODvOODoOOBruacgOOCguWlpe+8iOODkOODg+OCr+ODnOODvOODieOBq+aOpeOBmeOCi++8iVjluqfmqJnjgYxib2FyZEZyb250WOOBq+OBquOCi+OCiOOBhuOBq+OBl+OBvuOBmVxuICAgICAgICBjb25zdCBzdXBwb3J0QXJtU3RhcnQgPSBib2FyZEZyb250O1xuXG4gICAgICAgIC8vIOOCteODneODvOODiOOCouODvOODoOOBruS4reW/g1jluqfmqJlcbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUNlbnRlclggPSBzdXBwb3J0QXJtU3RhcnQgKyAoc3VwcG9ydEFybURlcHRoIC8gMik7XG5cbiAgICAgICAgLy8g44OQ44OD44Kv44Oc44O844OJ44Gu5LiL56uvWeW6p+aomVxuICAgICAgICBjb25zdCBib2FyZEJvdHRvbVkgPSBib2FyZENlbnRlclkgLSAoYm9hcmRIZWlnaHQgLyAyKTtcblxuICAgICAgICAvLyDjgrXjg53jg7zjg4jjgqLjg7zjg6Djga5Z5bqn5qiZ44Gu5Lit5b+DID0g44OQ44OD44Kv44Oc44O844OJ44GuWeW6p+aomeOBruS4i+err+OBi+OCiSsxNWNtICsg44K144Od44O844OI44Ki44O844Og44Gu6auY44GV44Gu5Y2K5YiGXG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1DZW50ZXJZID0gYm9hcmRCb3R0b21ZICsgKDAuMTUpICsgKHN1cHBvcnRBcm1IZWlnaHQgLyAyKTtcblxuICAgICAgICAvLyBa5bqn5qiZ44Gv44OQ44OD44Kv44Oc44O844OJ44Go5ZCM5qeY44Gr5Lit5aSuXG4gICAgICAgIGNvbnN0IHN1cHBvcnRBcm1DZW50ZXJaID0gMDtcblxuICAgICAgICBjb25zdCBzdXBwb3J0QXJtR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoc3VwcG9ydEFybURlcHRoLCBzdXBwb3J0QXJtSGVpZ2h0LCBzdXBwb3J0QXJtV2lkdGgpO1xuICAgICAgICBjb25zdCBzdXBwb3J0QXJtTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg4ODg4ODggfSk7IC8vIOOCsOODrOODvOezu+OBruiJslxuICAgICAgICBjb25zdCBzdXBwb3J0QXJtTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHN1cHBvcnRBcm1HZW9tZXRyeSwgc3VwcG9ydEFybU1hdGVyaWFsKTtcbiAgICAgICAgc3VwcG9ydEFybU1lc2gucm90YXRpb24ueiA9IE1hdGguUEkgLyAyO1xuICAgICAgICBzdXBwb3J0QXJtTWVzaC5wb3NpdGlvbi5zZXQoc3VwcG9ydEFybUNlbnRlclgsIHN1cHBvcnRBcm1DZW50ZXJZLCBzdXBwb3J0QXJtQ2VudGVyWik7XG4gICAgICAgIHN1cHBvcnRBcm1NZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChzdXBwb3J0QXJtTWVzaCk7XG5cbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCxcbiAgICAgICAgICAgIHNoYXBlOiBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoc3VwcG9ydEFybURlcHRoIC8gMiwgc3VwcG9ydEFybUhlaWdodCAvIDIsIHN1cHBvcnRBcm1XaWR0aCAvIDIpKSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoc3VwcG9ydEFybUNlbnRlclgsIHN1cHBvcnRBcm1DZW50ZXJZLCBzdXBwb3J0QXJtQ2VudGVyWilcbiAgICAgICAgfSk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkoc3VwcG9ydEFybUJvZHkpO1xuXG4gICAgICAgIC8vIC0tLSDjg6rjg7PjgrDvvIjjgrTjg7zjg6vvvIkgLS0tXG4gICAgICAgIGNvbnN0IHJpbmdSYWRpdXMgPSAwLjQ1IC8gMjsgLy8gMC4yMjVtXG4gICAgICAgIGNvbnN0IHJpbmdUdWJlID0gMC4wMzsgLy8g5Y6a44GVICgzY20gLT4gMC4wM20pXG5cbiAgICAgICAgY29uc3Qgc3VwcG9ydEFybUZyb250WCA9IHN1cHBvcnRBcm1DZW50ZXJYICsgc3VwcG9ydEFybURlcHRoICogMztcbiAgICAgICAgY29uc3QgcmluZ0NlbnRlclggPSBzdXBwb3J0QXJtRnJvbnRYICsgcmluZ1JhZGl1cztcblxuICAgICAgICAvLyDjg6rjg7PjgrDjga5Z5bqn5qiZ77yI5Lit5b+D77yJPSDjg5Djg4Pjgq/jg5zjg7zjg4njga5Z5bqn5qiZ44Gu5LiL56uv44GL44KJKzE1Y21cbiAgICAgICAgY29uc3QgcmluZ0NlbnRlclkgPSBib2FyZEJvdHRvbVkgKyAwLjE1ICsgKHN1cHBvcnRBcm1IZWlnaHQgLyAyKTsgLy8g44Oq44Oz44Kw44Gu5Lit5b+D44GM44GT44Gu6auY44GV44Gr44Gq44KL44KI44GG44GrXG5cbiAgICAgICAgLy8gWuW6p+aomeOBr+S4reWkrlxuICAgICAgICBjb25zdCByaW5nQ2VudGVyWiA9IDA7XG5cbiAgICAgICAgY29uc3QgcmluZ0dlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkocmluZ1JhZGl1cywgcmluZ1R1YmUgLyAyLCAxNiwgMTAwKTsgLy8gdHViZeOBr+WNiuW+hOOBp+aMh+WumlxuICAgICAgICBjb25zdCByaW5nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgICAgIGNvbnN0IHJpbmdNZXNoID0gbmV3IFRIUkVFLk1lc2gocmluZ0dlb21ldHJ5LCByaW5nTWF0ZXJpYWwpO1xuICAgICAgICByaW5nTWVzaC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7IC8vIOWcsOmdouOBqOW5s+ihjOOBq+OAgVjou7jjgavlkJHjgYvjgaPjgabplovjgY9cbiAgICAgICAgcmluZ01lc2gucG9zaXRpb24uc2V0KHJpbmdDZW50ZXJYLCByaW5nQ2VudGVyWSwgcmluZ0NlbnRlclopO1xuICAgICAgICByaW5nTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmluZ01lc2gpO1xuXG4gICAgICAgIC8vIC0tLSAxLiDov73liqA6IOODquODs+OCsOeUqOOBrueJqeeQhuODnuODhuODquOCouODq+OCkuS9nOaIkCAtLS1cbiAgICAgICAgY29uc3QgcmluZ1BoeXNNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoJ3JpbmdNYXQnKTtcblxuICAgICAgICAvLyAgICAgICAgIC8vIC0tLSDjg6rjg7PjgrDjga7niannkIbooajnj77jgpIgQ3lsaW5kZXIg44Gn6L+R5Ly8IC0tLVxuICAgICAgICAvLyBjb25zdCBudW1TZWdtZW50cyA9IDE4O1xuICAgICAgICAvLyBjb25zdCBleHBhbnNpb24gPSAwLjAwNTtcblxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNlZ21lbnRzOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBudW1TZWdtZW50cykgKiBNYXRoLlBJICogMjtcbiAgICAgICAgLy8gICAgIGNvbnN0IGFkanVzdGVkQW5nbGUgPSBhbmdsZSArIChNYXRoLlBJIC8gbnVtU2VnbWVudHMgLyAyKTtcbiAgICAgICAgLy8gICAgIGNvbnN0IHggPSByaW5nQ2VudGVyWDtcbiAgICAgICAgLy8gICAgIGNvbnN0IHkgPSByaW5nQ2VudGVyWSArIE1hdGguY29zKGFuZ2xlKSAqIChyaW5nUmFkaXVzICsgZXhwYW5zaW9uKTtcbiAgICAgICAgLy8gICAgIGNvbnN0IHogPSByaW5nQ2VudGVyWiArIE1hdGguc2luKGFuZ2xlKSAqIChyaW5nUmFkaXVzICsgZXhwYW5zaW9uKTtcblxuICAgICAgICAvLyAgICAgY29uc3Qgc2VnbWVudFNoYXBlID0gbmV3IENBTk5PTi5DeWxpbmRlcihcbiAgICAgICAgLy8gICAgICAgICByaW5nVHViZSAvIDIsIHJpbmdUdWJlIC8gMixcbiAgICAgICAgLy8gICAgICAgICByaW5nVHViZSAqIDAuNSwgLy8g44Gn44GN44KL44Gg44GR55+t44GPXG4gICAgICAgIC8vICAgICAgICAgOFxuICAgICAgICAvLyAvLyAgICAgKTtcbiAgICAgICAgLy8gLy8gICAgIGNvbnN0IHNlZ21lbnRCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgLy8gLy8gICAgICAgICBtYXNzOiAwLFxuICAgICAgICAvLyAvLyAgICAgICAgIHNoYXBlOiBzZWdtZW50U2hhcGUsXG4gICAgICAgIC8vIC8vICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyh4LCB5LCB6KSxcbiAgICAgICAgLy8gLy8gICAgICAgICBtYXRlcmlhbDogcmluZ1BoeXNNYXRlcmlhbFxuICAgICAgICAvLyAvLyAgICAgfSk7XG5cbiAgICAgICAgLy8gICAgIGNvbnN0IHF1YXRlcm5pb24gPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKTtcbiAgICAgICAgLy8gICAgIHF1YXRlcm5pb24uc2V0RnJvbUF4aXNBbmdsZShuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMSksIGFkanVzdGVkQW5nbGUpO1xuICAgICAgICAvLyAgICAgY29uc3QgdGlsdCA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xuICAgICAgICAvLyAgICAgdGlsdC5zZXRGcm9tQXhpc0FuZ2xlKG5ldyBDQU5OT04uVmVjMygxLCAwLCAwKSwgTWF0aC5QSSAvIDIpO1xuICAgICAgICAvLyAgICAgcXVhdGVybmlvbi5tdWx0KHRpbHQsIHF1YXRlcm5pb24pO1xuXG4gICAgICAgIC8vICAgICBzZWdtZW50Qm9keS5xdWF0ZXJuaW9uLmNvcHkocXVhdGVybmlvbik7XG4gICAgICAgIC8vICAgICB3b3JsZC5hZGRCb2R5KHNlZ21lbnRCb2R5KTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAtLS0gMi4g5aSJ5pu0OiBUcmltZXNo44Gn44Oq44Oz44Kw44Gu54mp55CG5b2i54q244KS5L2c5oiQIC0tLVxuICAgICAgICByaW5nR2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTsgIC8vIOazlee3muOBruioiOeul++8iOW/teOBruOBn+OCge+8iVxuICAgICAgICByaW5nR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7ICAgIC8vIOWig+eVjOODnOODg+OCr+OCueioiOeul++8iOW/teOBruOBn+OCge+8iVxuXG4gICAgICAgIC8vIFRyaW1lc2jkvZzmiJDvvIjoh6rkvZzplqLmlbDjgpLkvb/jgYbvvIlcbiAgICAgICAgY29uc3QgcmluZ1NoYXBlID0gdGhpcy5jcmVhdGVUcmltZXNoRnJvbUdlb21ldHJ5KHJpbmdHZW9tZXRyeSk7XG5cbiAgICAgICAgLy8g44Oq44Oz44Kw55So44Gu54mp55CG44Oc44OH44Kj5L2c5oiQXG4gICAgICAgIGNvbnN0IHJpbmdCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDAsIC8vIOmdmeeahOOCquODluOCuOOCp+OCr+ODiFxuICAgICAgICAgICAgc2hhcGU6IHJpbmdTaGFwZSxcbiAgICAgICAgICAgIG1hdGVyaWFsOiByaW5nUGh5c01hdGVyaWFsLFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyhyaW5nQ2VudGVyWCwgcmluZ0NlbnRlclksIHJpbmdDZW50ZXJaKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVG9ydXNHZW9tZXRyeeOBruWQkeOBjeOCkkNBTk5PTi5qc+OBq+WQiOOCj+OBm+OBpuWbnui7ouOBleOBm+OCi1xuICAgICAgICByaW5nQm9keS5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcihNYXRoLlBJIC8gMiwgMCwgMCk7XG5cbiAgICAgICAgd29ybGQuYWRkQm9keShyaW5nQm9keSk7XG5cbiAgICAgICAgLy8gQ0FOTk9OLmpz44Gu44Oq44Oz44Kw44Gu44Oc44OH44Kj77yI57Ch55Wl5YyW44Gu44Gf44KBQ3lsaW5kZXJTaGFwZeOCkuS9v1xuXG4gICAgICAgIC8vIC0tLSDjg5DjgrnjgrHjg4Pjg4jjg5zjg7zjg6sgLS0tXG4gICAgICAgIGNvbnN0IGJhbGxSYWRpdXMgPSAwLjI0NSAvIDI7IC8vIOWwj+OBleOCgeOBq+OBl+OBpuODquODs+OCsOOCkumAmuOCjOOCi+OCiOOBhuOBq+OBmeOCi1xuICAgICAgICBjb25zdCBiYWxsR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoYmFsbFJhZGl1cywgMzIsIDMyKTtcbiAgICAgICAgY29uc3QgYmFsbE1lc2hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGZmYTUwMCB9KTtcbiAgICAgICAgY29uc3QgYmFsbE1lc2ggPSBuZXcgVEhSRUUuTWVzaChiYWxsR2VvbWV0cnksIGJhbGxNZXNoTWF0ZXJpYWwpO1xuICAgICAgICBiYWxsTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgYmFsbE1lc2gucG9zaXRpb24uc2V0KDAsIDIuNSwgMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGJhbGxNZXNoKTtcblxuICAgICAgICBjb25zdCBiYWxsUGh5c01hdGVyaWFsID0gbmV3IENBTk5PTi5NYXRlcmlhbCgnYmFsbE1hdCcpO1xuICAgICAgICBjb25zdCBncm91bmRNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoJ2dyb3VuZE1hdCcpO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhY3RNYXRlcmlhbCA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKFxuICAgICAgICAgICAgYmFsbFBoeXNNYXRlcmlhbCxcbiAgICAgICAgICAgIGdyb3VuZE1hdGVyaWFsLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjgsXG4gICAgICAgICAgICAgICAgZnJpY3Rpb246IDAuM1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChjb250YWN0TWF0ZXJpYWwpO1xuXG4gICAgICAgIC8vIC0tLSA0LiDmlrDopo/ov73liqA6IOODnOODvOODq+OBqOODquODs+OCsOOBruaOpeinpueJueaApyAtLS1cbiAgICAgICAgY29uc3QgYmFsbFJpbmdDb250YWN0TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChiYWxsUGh5c01hdGVyaWFsLCByaW5nUGh5c01hdGVyaWFsLCB7XG4gICAgICAgICAgICByZXN0aXR1dGlvbjogMC4yLFxuICAgICAgICAgICAgZnJpY3Rpb246IDAuNlxuICAgICAgICB9KTtcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGJhbGxSaW5nQ29udGFjdE1hdGVyaWFsKTtcblxuXG4gICAgICAgIC8vIENhbm5vbi1lc+eUqOOBruWJm+S9k1xuICAgICAgICBjb25zdCBiYWxsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLjYsXG4gICAgICAgICAgICBzaGFwZTogbmV3IENBTk5PTi5TcGhlcmUoYmFsbFJhZGl1cyksXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKDAsIDIuNSwgMCksXG4gICAgICAgICAgICBtYXRlcmlhbDogYmFsbFBoeXNNYXRlcmlhbFxuICAgICAgICB9KTtcbiAgICAgICAgd29ybGQuYWRkQm9keShiYWxsQm9keSk7XG4gICAgICAgIC8vQmFsbOOBruOCt+ODpeODvOODiFxuICAgICAgICBiYWxsQm9keS52ZWxvY2l0eS5zZXQoLTUsIDQuMCwgMik7XG5cbiAgICAgICAgLy8gLS0tIOaUr+afseOBrui/veWKoO+8iOWcsOmdouOBi+OCieODkOODg+OCr+ODnOODvOODieOBvuOBp+OBruafse+8iSAtLS1cbiAgICAgICAgY29uc3QgcGlsbGFySGVpZ2h0ID0gYm9hcmRDZW50ZXJZOyAvLyDlnLDpnaLjgYvjgonjg5Djg4Pjgq/jg5zjg7zjg4njga7pq5jjgZXjgb7jgafjga7ot53pm6JcblxuICAgICAgICBjb25zdCBwaWxsYXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjEsIHBpbGxhckhlaWdodCwgMC4xKTtcbiAgICAgICAgY29uc3QgcGlsbGFyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg1NTU1NTUgfSk7XG4gICAgICAgIGNvbnN0IHBpbGxhck1lc2ggPSBuZXcgVEhSRUUuTWVzaChwaWxsYXJHZW9tZXRyeSwgcGlsbGFyTWF0ZXJpYWwpO1xuICAgICAgICAvLyDmlK/mn7Hjga7kvY3nva7vvJrjg5Djg4Pjgq/jg5zjg7zjg4njga5YLFrluqfmqJnjgajlkIzjgZjjgIFZ44Gv5p+x44Gu6auY44GV44Gu5Y2K5YiGXG4gICAgICAgIHBpbGxhck1lc2gucG9zaXRpb24uc2V0KGJvYXJkQ2VudGVyWCAtIGJvYXJkRGVwdGgsIHBpbGxhckhlaWdodCAvIDIsIGJvYXJkQ2VudGVyWik7XG4gICAgICAgIHBpbGxhck1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBpbGxhck1lc2gpO1xuXG4gICAgICAgIGNvbnN0IHBpbGxhckJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCwgLy8g6Z2Z55qE44Gq5pSv5p+x44Gq44Gu44Gn6LOq6YePMFxuICAgICAgICAgICAgc2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygwLjA1LCBwaWxsYXJIZWlnaHQgLyAyLCAwLjA1KSksXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKGJvYXJkQ2VudGVyWCwgcGlsbGFySGVpZ2h0IC8gMiwgYm9hcmRDZW50ZXJaKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkocGlsbGFyQm9keSk7XG5cbiAgICAgICAgLy8gLS0tIOODkOODg+OCr+ODnOODvOODieOBruODnOODh+OCo+OBqOaUr+afseOCkuWbuuWumuOCuOODp+OCpOODs+ODiOOBp+e5i+OBkCAtLS1cbiAgICAgICAgY29uc3QgbG9ja0NvbnN0cmFpbnQgPSBuZXcgQ0FOTk9OLkxvY2tDb25zdHJhaW50KGJvYXJkQm9keSwgcGlsbGFyQm9keSk7XG4gICAgICAgIHdvcmxkLmFkZENvbnN0cmFpbnQobG9ja0NvbnN0cmFpbnQpO1xuXG5cbiAgICAgICAgLy/lnLDpnaLkvZzmiJBcbiAgICAgICAgY29uc3QgcGhvbmdNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpO1xuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNDAsIDQwKTtcbiAgICAgICAgY29uc3QgcGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGhvbmdNYXRlcmlhbCk7XG4gICAgICAgIHBsYW5lTWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTsgLy8g5Lih6Z2iXG4gICAgICAgIHBsYW5lTWVzaC5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lTWVzaCk7XG5cbiAgICAgICAgY29uc3QgcGxhbmVTaGFwZSA9IG5ldyBDQU5OT04uUGxhbmUoKVxuICAgICAgICBjb25zdCBwbGFuZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgbWFzczogMCxcbiAgICAgICAgICAgIG1hdGVyaWFsOiBncm91bmRNYXRlcmlhbFxuICAgICAgICB9KVxuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSlcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICBwbGFuZU1lc2gucXVhdGVybmlvbi54LFxuICAgICAgICAgICAgcGxhbmVNZXNoLnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICBwbGFuZU1lc2gucXVhdGVybmlvbi53XG4gICAgICAgICk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkocGxhbmVCb2R5KVxuXG4gICAgICAgIGNvbnN0IGJvYXJkUG9zWCA9IHJpbmdDZW50ZXJYO1xuICAgICAgICBjb25zdCBib2FyZFBvc1kgPSByaW5nQ2VudGVyWSArIDAuMztcbiAgICAgICAgY29uc3QgYm9hcmRQb3NaID0gcmluZ0NlbnRlclogLSAocmluZ1JhZGl1cyArIGJvYXJkRGVwdGggLyAyKTtcbiAgICAgICAgY29uc3QgYmxhY2tMaW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMDAgfSk7XG5cblxuICAgICAgICAvLyAtLS0g44K044O844Or44Gu5b6M44KN44Gu5aOB44Gu6Kit5a6aIC0tLVxuICAgICAgICBjb25zdCB3YWxsV2lkdGggPSAxMDsgIC8vIOWjgeOBruaoquW5he+8iOODquODs+OCsOOBruiDjOmdouOCiOOCiuWwkeOBl+Wkp+OBjeOCgeOBq++8iVxuICAgICAgICBjb25zdCB3YWxsSGVpZ2h0ID0gMTA7IC8vIOWjgeOBrumrmOOBlVxuICAgICAgICBjb25zdCB3YWxsRGVwdGggPSAwLjE7ICAvLyDlo4Hjga7ljprjgb/vvIjlpaXooYzjgY3vvIlcblxuICAgICAgICAvLyDlo4Hjga7kvY3nva7vvIjjg6rjg7PjgrDjga7lvozjgo3jgIFa6Lu444Gn6Kq/5pW077yJXG4gICAgICAgIGNvbnN0IHdhbGxQb3NYID0gYm9hcmRDZW50ZXJYIC0gMS4yOyAgLy8g44Oq44Oz44Kw44Go5ZCM44GYWOS9jee9rlxuICAgICAgICBjb25zdCB3YWxsUG9zWSA9IHdhbGxIZWlnaHQgLyAyOyAgLy8g44Oq44Oz44Kw44Go5ZCM44GY6auY44GV44GL5bCR44GX6auY44KBXG4gICAgICAgIGNvbnN0IHdhbGxQb3NaID0gcmluZ0NlbnRlclogLSAocmluZ1JhZGl1cyArIHdhbGxEZXB0aCAvIDIgKyAwLjEpOyAvLyDjg6rjg7PjgrDjga7lvozjgo3jgavlsJHjgZfot53pm6LjgpLlj5bjgotcblxuICAgICAgICAvLyBUaHJlZS5qc+OBruWjgeODoeODg+OCt+ODpVxuICAgICAgICBjb25zdCB3YWxsR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2FsbFdpZHRoLCB3YWxsSGVpZ2h0LCB3YWxsRGVwdGgpO1xuICAgICAgICBjb25zdCB3YWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHg0NDQ0NDQsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjkgfSk7XG4gICAgICAgIGNvbnN0IHdhbGxNZXNoID0gbmV3IFRIUkVFLk1lc2god2FsbEdlb21ldHJ5LCB3YWxsTWF0ZXJpYWwpO1xuICAgICAgICB3YWxsTWVzaC5yb3RhdGlvbi55ID0gTWF0aC5QSSAvIDI7XG4gICAgICAgIHdhbGxNZXNoLnBvc2l0aW9uLnNldCh3YWxsUG9zWCwgd2FsbFBvc1ksIHdhbGxQb3NaKTtcbiAgICAgICAgd2FsbE1lc2guY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICAgIHdhbGxNZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh3YWxsTWVzaCk7XG5cbiAgICAgICAgLy8gQ0FOTk9OLmpz44Gu5aOB5Ymb5L2TXG4gICAgICAgIGNvbnN0IHdhbGxTaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyh3YWxsV2lkdGggLyAyLCB3YWxsSGVpZ2h0IC8gMiwgd2FsbERlcHRoIC8gMikpO1xuICAgICAgICBjb25zdCB3YWxsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAwLCAgLy8g5YuV44GL44Gq44GE5aOB44Gq44Gu44Gn6LOq6YePMFxuICAgICAgICAgICAgc2hhcGU6IHdhbGxTaGFwZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMod2FsbFBvc1gsIHdhbGxQb3NZLCB3YWxsUG9zWilcbiAgICAgICAgfSk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkod2FsbEJvZHkpO1xuXG4gICAgICAgIGNvbnN0IG1hcmdpbiA9IDAuMDU7ICAvLyA1Y21cbiAgICAgICAgY29uc3Qgb3V0ZXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpLnNldEZyb21Qb2ludHMoW1xuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLWJvYXJkV2lkdGggLyAyICsgbWFyZ2luLCBib2FyZEhlaWdodCAvIDIgLSBtYXJnaW4sIDAuMDAxKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGJvYXJkV2lkdGggLyAyIC0gbWFyZ2luLCBib2FyZEhlaWdodCAvIDIgLSBtYXJnaW4sIDAuMDAxKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGJvYXJkV2lkdGggLyAyIC0gbWFyZ2luLCAtYm9hcmRIZWlnaHQgLyAyICsgbWFyZ2luLCAwLjAwMSksXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtYm9hcmRXaWR0aCAvIDIgKyBtYXJnaW4sIC1ib2FyZEhlaWdodCAvIDIgKyBtYXJnaW4sIDAuMDAxKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC1ib2FyZFdpZHRoIC8gMiArIG1hcmdpbiwgYm9hcmRIZWlnaHQgLyAyIC0gbWFyZ2luLCAwLjAwMSksXG4gICAgICAgIF0pO1xuICAgICAgICBjb25zdCBvdXRlckxpbmUgPSBuZXcgVEhSRUUuTGluZShvdXRlckdlb21ldHJ5LCBibGFja0xpbmVNYXRlcmlhbCk7XG4gICAgICAgIG91dGVyTGluZS5wb3NpdGlvbi5zZXQoYm9hcmRQb3NYLCBib2FyZFBvc1ksIGJvYXJkUG9zWiArIGJvYXJkRGVwdGggLyAyICsgMC4wMDEpOyAgLy8g5bCR44GX5omL5YmN44GrXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG91dGVyTGluZSk7XG5cbiAgICAgICAgLy8gPT09IOWGheWBtOWbm+inkuW9ouOBrum7kue3miA9PT1cbiAgICAgICAgY29uc3QgcmVjdFdpZHRoID0gMC41OTsgLy8gNTljbVxuICAgICAgICBjb25zdCByZWN0SGVpZ2h0ID0gMC40NTsgLy8gNDVjbVxuICAgICAgICBjb25zdCByZWN0Qm90dG9tTWFyZ2luID0gMC4xOyAvLyDjg5Djg4Pjgq/jg5zjg7zjg4njga7kuIvjgYvjgokxMGNtXG4gICAgICAgIGNvbnN0IHJlY3RMZWZ0ID0gLXJlY3RXaWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IHJlY3RSaWdodCA9IHJlY3RXaWR0aCAvIDI7XG4gICAgICAgIGNvbnN0IHJlY3RCb3R0b20gPSAtYm9hcmRIZWlnaHQgLyAyICsgcmVjdEJvdHRvbU1hcmdpbjtcbiAgICAgICAgY29uc3QgcmVjdFRvcCA9IHJlY3RCb3R0b20gKyByZWN0SGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IGlubmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKS5zZXRGcm9tUG9pbnRzKFtcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHJlY3RMZWZ0LCByZWN0VG9wLCAwLjAwMSksXG4gICAgICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMyhyZWN0UmlnaHQsIHJlY3RUb3AsIDAuMDAxKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHJlY3RSaWdodCwgcmVjdEJvdHRvbSwgMC4wMDEpLFxuICAgICAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMocmVjdExlZnQsIHJlY3RCb3R0b20sIDAuMDAxKSxcbiAgICAgICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHJlY3RMZWZ0LCByZWN0VG9wLCAwLjAwMSksXG4gICAgICAgIF0pO1xuICAgICAgICBjb25zdCBpbm5lckxpbmUgPSBuZXcgVEhSRUUuTGluZShpbm5lckdlb21ldHJ5LCBibGFja0xpbmVNYXRlcmlhbCk7XG4gICAgICAgIGlubmVyTGluZS5wb3NpdGlvbi5zZXQoYm9hcmRQb3NYLCBib2FyZFBvc1ksIGJvYXJkUG9zWiArIGJvYXJkRGVwdGggLyAyICsgMC4wMDEpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChpbm5lckxpbmUpO1xuXG5cblxuICAgICAgICAvLyDjgrDjg6rjg4Pjg4nooajnpLpcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwLCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgICAgIC8vIOi7uOihqOekulxuICAgICAgICBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGNvbnN0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIHdvcmxkLnN0ZXAoMSAvIDYwKTsgLy8g5a6f6Zqb44Gu5pmC6ZaT44Gr5Z+644Gl44GE44Gm6KOc6ZaTXG5cbiAgICAgICAgICAgIGJhbGxNZXNoLnBvc2l0aW9uLnNldChcbiAgICAgICAgICAgICAgICBiYWxsQm9keS5wb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgIGJhbGxCb2R5LnBvc2l0aW9uLnksXG4gICAgICAgICAgICAgICAgYmFsbEJvZHkucG9zaXRpb24uelxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgYmFsbE1lc2gucXVhdGVybmlvbi5zZXQoXG4gICAgICAgICAgICAgICAgYmFsbEJvZHkucXVhdGVybmlvbi54LFxuICAgICAgICAgICAgICAgIGJhbGxCb2R5LnF1YXRlcm5pb24ueSxcbiAgICAgICAgICAgICAgICBiYWxsQm9keS5xdWF0ZXJuaW9uLnosXG4gICAgICAgICAgICAgICAgYmFsbEJvZHkucXVhdGVybmlvbi53XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG5cbn1cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDUsIDUsIDUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==