var createScene = async function (canvas) {
    var engine = new BABYLON.Engine(canvas, true);

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 4, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Add zoom functionality to the camera
    var zoomSpeed = 0.1; // Adjust this value to control the zoom speed

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

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "GlassesGuyMesh.glb", scene);

    console.log("ImportMeshAsync results:")
    console.log(result);

    return [scene, engine, result];
};
