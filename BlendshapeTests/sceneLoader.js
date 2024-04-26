var createScene = async function (canvas, file) {
    console.log("Loading Scene!");
    var engine = new BABYLON.Engine(canvas);

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    return [scene, engine];
};

var setCameraOnBone = function (scene, canvas, targetMesh, boneIndex=4, visualizeSphere=false) {
    /* Creating a camera that we set to the position of the bone attached to the mesh's neck bone:
    * 1. Create an empty object that we visualize as a sphere
    * 2. Attach the sphere to the bone
    * 3. Create a camera that we aim at the sphere
    * 4. Profit
    */

    // Create a sphere that we attach to the bone
    console.log("Initializing camera...");
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    sphere.attachToBone(scene.skeletons[0].bones[boneIndex], targetMesh);

    // Comment this code to visualise the sphere:
    sphere.setEnabled(visualizeSphere);

    // Initializes an ArcRotateCamera named "camera1" in the scene.
    // This camera is positioned to rotate around a target point defined by the vector (0, 0, -1).
    // The 'alpha' parameter, set as Math.PI / -2, positions the camera at -90 degrees on the XZ plane,
    // effectively placing it on the negative X-axis and facing towards the origin.
    // The 'beta' parameter of 1 radian tilts the camera slightly downward from the vertical top view.
    // The 'radius' parameter of 3 units sets the distance from the camera to the target point, placing it 3 units away.

    // This setup provides a unique side and slightly elevated view of the scene centered around the target point on the negative Z-axis.
    camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / -2, 1, 3, new BABYLON.Vector3(0, 0, -2), scene);
    camera.attachControl(canvas, true);
    camera.target = sphere;
};

var loadAsset = async function (scene, path="http://localhost:8081/meshes/", fileName) {
    console.log("Loading mesh from" + path + fileName + "...");

    const asset = {
        fetched: await BABYLON.SceneLoader.ImportMeshAsync(null, path, fileName, scene),
        mainMesh: null,
        faceMesh: null
    };

    // stop and remove embedded animation group
    if (scene.animationGroups.length > 0) {
        scene.animationGroups[0].stop();
        scene.animationGroups[0].dispose();
    }

    // Find the root mesh and the face mesh for its morph target manager
    for (mesh of asset.fetched.meshes) {
        if (mesh.name === "__root__") {
            asset.mainMesh = mesh;
        } else if (mesh.name === "newNeutral_primitive1") {
            asset.faceMesh = mesh;
        }
    }

    if (asset.faceMesh !== null) {
        console.log(asset.faceMesh.morphTargetManager);
    }

    return asset;
};