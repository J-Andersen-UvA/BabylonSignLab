var createScene = async function (canvas) {
    var engine = new BABYLON.Engine(canvas, true);
    BABYLON.Animation.AllowMatricesInterpolation = true;

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, 2), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero().add(new BABYLON.Vector3(0, 1, 0)));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Add zoom functionality to the camera
    var zoomSpeed = 0.2; // Adjust this value to control the zoom speed

    canvas.addEventListener("wheel", function (event) {
        // Zoom in or out based on the direction of the mouse scroll
        if (event.deltaY > 0) {
            camera.position.z -= zoomSpeed;
        } else {
            camera.position.z += zoomSpeed;
        }
    });
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "glassesGuyUEGLTF.gltf", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "glassesGuyFBXConverted.gltf", scene);
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "scene.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "UEfbxCOCOSgltfBABYLONglb.glb", scene);

    var topLight = new BABYLON.PointLight("topLight", result.meshes[0].getAbsolutePosition().add(new BABYLON.Vector3(0, 4, 0)), scene);
    topLight.diffuse = new BABYLON.Color3(1, 1, 1); // Set light color
    topLight.intensity = 1; // Set light intensity
    
    console.log(scene.meshes[1].morphTargetManager._targets);

    // scene.meshes.forEach(function(a) {
    //     console.log(a.morphTargetManager);
    // });



    // console.log(result);

    return [scene, engine, result];
};
