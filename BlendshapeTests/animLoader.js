/*
    Load the animations from a file and return them as an asset.
    We can add on more details to the asset later if we need to.
    For now it only contains the animation groups that we can use to manually
    retarget the animations onto other skeletons.
*/
var loadAssetOnlyAnimation = async function (scene, path="http://localhost:8081/anims/", fileName) {
    console.log("Loading animation only from: " + path + fileName + "...");

    // Load the animations from the file
    const asset = {
        fetched: await BABYLON.SceneLoader.ImportAnimationsAsync(path, fileName, scene),
        animationGroups: []
    };

    // Find all animation groups
    for (animGroup of asset.fetched.animationGroups) {
        asset.animationGroups.push(animGroup);
    }

    return asset;
}

/*
    The following code is deprecated and should not be used.
    It is kept here for reference purposes only.
    We use loadAssetOnlyAnimation instead, because we dont want to load a mesh and delete it
    for only its animations.
*/
var loadAssetAnimationWithMesh = async function (scene, path="http://localhost:8081/anims/", fileName) {
    console.log("Loading animation from: " + path + fileName + "...");

    const asset = {
        fetched: await BABYLON.SceneLoader.ImportMeshAsync(null, path, fileName, scene),
        // fetched: await BABYLON.SceneLoader.ImportAnimationsAsync(path, fileName, scene),
        morphTargetManagers: [],
        animationGroups: [],
        skeletons: []
    };

    // Find all meshes with morph target managers
    for (mesh of asset.fetched.meshes) {
        if (mesh.name === "__root__") {
            asset.mainMesh = mesh;
        }
        
        if (mesh.morphTargetManager) {
            asset.morphTargetManagers.push(mesh.morphTargetManager);
        }
    }

    // Find all animation groups
    for (animGroup of scene.animationGroups) {
        asset.animationGroups.push(animGroup);
    }

    // Find all skeletons
    for (skeleton of asset.fetched.skeletons) {
        asset.skeletons.push(skeleton);
    }

    return asset;
};