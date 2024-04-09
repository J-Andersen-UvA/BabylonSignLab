var playAnims = async function(scene, loadedResults) {
    if (!scene) {
        console.error("Scene is undefined. Unable to play animations.");
        return;
    }
    else if (!loadedResults) {
        console.error("loadedResults is undefined. Unable to play animations.");
        return;
    }
    else if (!loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("No animations found. Unable to play animations.");
        return;
    }

    const rotationQuaternion = new BABYLON.Quaternion.RotationYawPitchRoll(0, 180, 0);

    // for mesh in result.meshes rotate
    for (mesh in loadedResults.meshes) { // Rotate all meshes
        console.log(loadedResults.meshes[mesh].rotation);
        loadedResults.meshes[mesh].rotation = new BABYLON.Vector3(0, 180, 0);
        // loadedResults.meshes[mesh].rotate(BABYLON.Axis.X, 180, BABYLON.Space.LOCAL);
        // loadedResults.meshes[mesh].rotation = new BABYLON.Vector3(Math.PI, 0, 0);
        console.log(loadedResults.meshes[mesh].rotation);
    }

    // Play each animation group
    loadedResults.animationGroups.forEach(animationGroup => {
        // Start playing the animation
        animationGroup.start(true);
    });
}
