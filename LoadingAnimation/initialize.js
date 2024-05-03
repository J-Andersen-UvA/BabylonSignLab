
function setParams(local, play, limit, glos, cameraAngle, movingCamera, zin, gltf, animations) {
    // No babylon database storage when testing locally
    if (local != 1) {
        BABYLON.Database.IDBStorageEnabled = true;
    }

    if (!play) {
        play = true;
    }

    if (!limit) {
        limit = 5;
    }

    if (glos == null) {
        glos = "ERROR-SC";
    }

    if (cameraAngle) {
        createCameraRotationAnimation(camera, cameraAngle, cameraAngle, 1);
    }

    if (movingCamera) {
        createCameraRotationAnimation(camera, 220, 340, 600); // Rotates from 0 to 180 degrees over 100 frames

        /*        async function playLoadedAnims() {
                    if (scene && loaded) {
                        
                        await playAnims(scene, loaded, 0);
                    } else {
                        console.error('Scene or loaded variables are not set.');*/
    }

    if (zin) {
        //we want to adjust frame from and to for blending
        animationGroupFrom = 80;
        animationGroupTo = 100;

        //split zin with , and return as array
        animations = zin.split(",");
    }
    else {
        //we want to adjust frame from and to for blending
        animationGroupFrom = 30; //start frame + 30
        animationGroupTo = 30; //end frame - 30
        animations = loadSignCollectLabels(local, thema, limit, animations);
    }

    return [local, play, limit, glos, cameraAngle, movingCamera, zin, gltf, animations];
}

async function initialize(scene, engine, canvas, basePath, basePathMesh, loadedMesh) {
    [scene, engine] = await createScene(
        document.getElementById("renderCanvas"), basePathMesh
    );
    loadedMesh = await loadAssetMesh(scene, basePathMesh);
    rotateMesh180(loadedMesh.mainMesh);
    setCameraOnBone(scene, canvas, loadedMesh.mainMesh);
    createPineapple(scene, basePath, loadedMesh.mainMesh);

    // Run the render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize the canvas when the window is resized
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return [scene, engine, loadedMesh];
}