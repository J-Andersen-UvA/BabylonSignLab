// Load for dynamic filename
var getAnims = async function (scene, loadedResults, animFilename) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return;
    }
    const basePath = "http://localhost:8080/MeshesAndAnims/olines_anims/";
  
    const result = await BABYLON.SceneLoader.ImportAnimationsAsync(basePath, animFilename, scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync, null);

    if (!result || !result.animationGroups || result.animationGroups.length === 0) {
        console.error("No animations found or unable to load animations for ", animFilename);
        return;
    }

    loadedResults.animationGroups = result.animationGroups;
}

