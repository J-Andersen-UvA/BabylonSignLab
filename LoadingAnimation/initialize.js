
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
        // We want to adjust frame from and to for blending
        AnimationSequencer.setFrom(80);
        AnimationSequencer.setTo(100);

        //split zin with , and return as array
        animations = zin.split(",");
    }
    else {
        //we want to adjust frame from and to for blending
        AnimationSequencer.setFrom(30);
        AnimationSequencer.setTo(30);

        animations = loadSignCollectLabels(local, thema, limit, animations);
    }

    return [local, play, limit, glos, cameraAngle, movingCamera, zin, gltf, animations];
}

async function initialize(scene, engine, canvas, basePath, basePathMesh, loadedMesh, boneLock=4) {
    [scene, engine] = await createScene(
        document.getElementById("renderCanvas"), basePathMesh
    );
    loadedMesh = await loadAssetMesh(scene, basePathMesh);
    rotateMesh180(loadedMesh.mainMesh);
    if (!boneLock) { boneLock = 4; } // Make sure we have a boneLock
    setCameraOnBone(scene, canvas, loadedMesh.mainMesh, loadedMesh.skeletons[0], boneIndex=boneLock);
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