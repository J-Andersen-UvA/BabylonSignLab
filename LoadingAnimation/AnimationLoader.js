// Import animations for BabylonJS
async function getAnims(basePath, scene, loadedResults, glos) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return false;
    }
    const basePath = "http://localhost:8080/MeshesAndAnims/olines_anims/";
  
    const result = await BABYLON.SceneLoader.ImportAnimationsAsync(basePath, animFilename, scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync, null);

    // Only allow glTF and glB loaders to not play animations automatically
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name === "gltf" || loader.name === "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });

    // Import animations asynchronously without auto-starting them
    try {
        const result = await BABYLON.SceneLoader.ImportAnimationsAsync(
            basePath,
            glos + ".glb",
            scene,
            false,
            BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync,
            null
        );

        if (!result || !result.animationGroups || result.animationGroups.length === 0) {
            console.error("No animations found or unable to load animations.");
            return false;
        }

        // Empty the animationGroups array in loadedResults
        loadedResults.animationGroups = [];
        lastIndex = result.animationGroups.length -1;
        result.animationGroups[lastIndex].glos=glos;

        // Add animations to the loadedResults's animation group
        loadedResults.animationGroups = result.animationGroups;
        console.log("Animations loaded for " + glos);
        return true;
    } catch (error) {
        console.error("Failed to load animations:", error);
        return false;
    }
}
