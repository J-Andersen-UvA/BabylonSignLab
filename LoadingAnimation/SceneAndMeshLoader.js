
// Get Babylon engine
var fetchBabEngine = function (canvas) {
    // Fetch the canvas element
    var engine = new BABYLON.Engine(canvas, true);

    return engine;
}

// Create the scene
var createScene = function (canvas, engine) {
    // Create a basic Babylon Scene object
    var scene = new BABYLON.Scene(engine);

    // Add a camera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 4, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
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

    // Add a light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    console.log("Scene created");

    var mesh;

    BABYLON.SceneLoader.ImportMesh(null, "http://localhost:8080/MeshesAndAnims/", "GlassesGuyMesh.glb", scene, function (newMeshes) {
        mesh = newMeshes[0];
        mesh.position = new BABYLON.Vector3(0, 0, 0);
        console.log("Mesh loaded");
    });

    return [scene, mesh];
};
