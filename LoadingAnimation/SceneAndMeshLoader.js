var createScene = async function (canvas, basePathMesh) {
    var engine = new BABYLON.Engine(canvas, true);
    BABYLON.Animation.AllowMatricesInterpolation = true;

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // TODO: When clicking the button twice, the animation first frame loads
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name == "gltf" || loader.name == "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });

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
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "UEfbxCOCOSgltfBABYLONglb.glb", scene);

    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "GlassesGuyBabylon.glb", scene);



    var topLight = new BABYLON.PointLight("topLight", result.meshes[0].getAbsolutePosition().add(new BABYLON.Vector3(0, 4, 0)), scene);
    topLight.diffuse = new BABYLON.Color3(1, 1, 1); // Set light color
    topLight.intensity = 1; // Set light intensity
    

    
    /* Creating a camera that we set to the position of the bone attached to the mesh's neck bone:
        * 1. Create an empty object that we visualize as a sphere
        * 2. Attach the sphere to the bone
        * 3. Create a camera that we aim at the sphere
        * 4. Profit
    */
    // Create a sphere that we attach to the bone
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	sphere.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    sphere.attachToBone(scene.skeletons[0].bones[4], scene.meshes[1]);

    // Comment this code to visualise the sphere:
    // sphere.setEnabled(false);

    var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / -2, 1, 3, new BABYLON.Vector3(0, 0, -1), scene);
    camera.attachControl(canvas, true);
    camera.target = sphere;

    // Display axis of the sphere
    localAxes(5, sphere, scene);

    return [scene, engine, result];
};


//Local Axes
function localAxes(size, mesh, scene) {
    var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [ 
    new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
    new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);

    pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);

    var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);

    var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {size:1}, scene);
    local_origin.isVisible = false;

    pilot_local_axisX.parent = mesh;
    pilot_local_axisY.parent = mesh;
    pilot_local_axisZ.parent = mesh; 
}