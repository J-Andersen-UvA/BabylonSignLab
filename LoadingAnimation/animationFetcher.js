// Import animations for BabylonJS
async function getAnims(basePath, scene, loadedResults, glos, gltf) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return false;
    }

    console.log("Loading animations for " + glos + "...")
    // Import animations asynchronously without auto-starting them
    try {
        const result = {
            fetched: await BABYLON.SceneLoader.ImportAnimationsAsync(
                basePath,
                glos + (gltf == 1 ? ".gltf" : ".glb"),
                scene,
                false,
                BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync,
                null),
            animationGroups: []
        };

        // Find all animation groups, makes accessing it later easier
        for (animGroup of result.fetched.animationGroups) {
            result.animationGroups.push(animGroup);
        }

        if (!result.fetched || !result.animationGroups || result.animationGroups.length === 0) {
            console.error("No animations found or unable to load animations.");
            return false;
        }

        // // Empty the animationGroups array in loadedResults
        // loadedResults.animationGroups = [];
        // lastIndex = result.animationGroups.length - 1;
        // result.animationGroups[lastIndex].glos = glos;

        // Add animations to the loadedResults's animation group
        loadedResults.animationGroups = result.animationGroups;
        console.log("Animations loaded for " + glos);

        return result;
    } catch (error) {
        console.error("Failed to load animations:", error);
        return null;
    }
}

// Keep only a single animation group
// This function is not done yet, we cant remove animation groups while looping over the groups
function keepOnlyAnimationGroup(scene, groupName="anim") {
    // Remove all animation groups except the one with the specified name
    for (let i = 0; i < scene.animationGroups.length; i++) {
        if (scene.animationGroups[i].name === groupName) {
            scene.animationGroups = scene.animationGroups[i];
            return;
        }
    }
}
