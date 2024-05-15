const ParamsManager = {
    local: null,
    play: null,
    limit: null,
    glos: null,
    zin: null,
    gltf: null,
    animations: null,

    setParams(local, play, limit, glos, zin, gltf, recording) {
        // No babylon database storage when testing locally
        if (local !== 1) {
            BABYLON.Database.IDBStorageEnabled = true;
        }

        this.local = local;
        this.play = play !== undefined ? play : true; // Set play if we have play, else default to true
        this.limit = limit !== null ? limit : 5; // Set limit if we have limit, else default to 5
        this.glos = glos !== null ? glos : "ERROR-SC"; // Set glos if we have glos, else default to "ERROR-SC"
        this.zin = zin;

        if (zin) {
            // We want to adjust frame from and to for blending
            AnimationSequencer.setFrom(80);
            AnimationSequencer.setTo(100);

            // Split zin with , and return as array
            this.animations = zin.split(",");
            console.log("Animations zin loaded:", this.animations);
        } else {
            // We want to adjust frame from and to for blending
            AnimationSequencer.setFrom(30);
            AnimationSequencer.setTo(30);

            this.animations = loadSignCollectLabels(this.local, thema, this.limit, []).then((animations) => {
                console.log("Animations loaded:", animations);
                return animations;
            });
        }

        this.gltf = gltf;

        return [this.local, this.play, this.limit, this.glos, this.zin, this.gltf, this.animations];
    }
};

// singleton for engine related items
const EngineController = (function () {
    let engine = null;
    let scene = null;
    let loadedMesh = null;

    function setEngine(newEngine) {
        engine = newEngine;
    }

    function getEngine() {
        return engine;
    }

    function setScene(newScene) {
        scene = newScene;
    }

    function getScene() {
        return scene;
    }

    function setLoadedMesh(newLoadedMesh) {
        loadedMesh = newLoadedMesh;
    }

    function getLoadedMesh() {
        return loadedMesh;
    }

    return {
        set engine(newEngine) {
            setEngine(newEngine);
        },
        get engine() {
            return getEngine();
        },
        set scene(newScene) {
            setScene(newScene);
        },
        get scene() {
            return getScene();
        },
        set loadedMesh(newLoadedMesh) {
            setLoadedMesh(newLoadedMesh);
        },
        get loadedMesh() {
            return getLoadedMesh();
        }
    };
})();


// Usage:
// ParamsManager.setParams(local, play, limit, glos, zin, gltf, animations);

// function setParams(local, play, limit, glos, zin, gltf, animations) {
//     // No babylon database storage when testing locally
//     if (local != 1) {
//         BABYLON.Database.IDBStorageEnabled = true;
//     }

//     if (!play) {
//         play = true;
//     }

//     if (!limit) {
//         limit = 5;
//     }

//     if (glos == null) {
//         glos = "ERROR-SC";
//     }

//     if (zin) {
//         // We want to adjust frame from and to for blending
//         AnimationSequencer.setFrom(80);
//         AnimationSequencer.setTo(100);

//         //split zin with , and return as array
//         animations = zin.split(",");
//     }
//     else {
//         //we want to adjust frame from and to for blending
//         AnimationSequencer.setFrom(30);
//         AnimationSequencer.setTo(30);

//         animations = loadSignCollectLabels(local, thema, limit, animations);
//     }

//     return [local, play, limit, glos, zin, gltf, animations];
// }

async function initialize(scene, engine, canvas, basePath, basePathMesh, loadedMesh, cameraAngle, cameraAngleBeta, movingCamera, boneLock=4) {
    [scene, engine] = await createScene(
        document.getElementById("renderCanvas")
    );
    loadedMesh = await loadAssetMesh(scene, basePathMesh, filename="scene.glb");

    // for all meshes in disable frustum culling
    loadedMesh.fetched.meshes.forEach(mesh => {
        mesh.alwaysSelectAsActiveMesh = true;
    });

    rotateMesh180(loadedMesh.mainMesh);
    if (!boneLock) { boneLock = 4; } // Make sure we have a boneLock

    // Create first camera, then access it through the singleton
    var camera = CameraController.getInstance();
    CameraController.setNearPlane(0.1);
    CameraController.setCameraOnBone(scene, loadedMesh.mainMesh, loadedMesh.skeletons[0], boneIndex=boneLock);
    CameraController.setCameraParams(scene, cameraAngle, cameraAngleBeta, movingCamera);
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
