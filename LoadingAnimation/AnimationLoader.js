// Import animations for BabylonJS
var getAnims = async function (scene, mesh) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return;
    }

    // TODO: When clicking the button twice, the animation first frame loads
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name == "gltf" || loader.name == "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });

    const result = await BABYLON.SceneLoader.ImportAnimationsAsync("http://localhost:8080/MeshesAndAnims/", "3NoMesh.glb", scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync, null);

    console.log("ImportAnimationsAsync results:");
    console.log(result);

    // Check if animations are loaded
    if (!result || !result.animationGroups || result.animationGroups.length === 0) {
        console.error("No animations found or unable to load animations.");
        return;
    }

    // Add animations to the mesh's animation group
    mesh.animationGroups = result.animationGroups;

    // Output message to console
    console.log("Animations added to animation group:");
    console.log(mesh.animationGroups);
}
