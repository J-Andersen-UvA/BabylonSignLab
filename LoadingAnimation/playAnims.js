// Import the BABYLON module
// Get a list of loaded animations
function getLoadedAnimations(loadedResults) {
    const loadedAnimations = [];

    // Store each animation group
    loadedResults.animationGroups.forEach(animationGroup => {
        loadedAnimations.push(animationGroup);
    });

    return loadedAnimations;
}

// Get a list of loaded meshes
function getLoadedMeshes(loadedResults) {
    const loadedMeshes = [];

    // Store each mesh
    for (let mesh in loadedResults.meshes) {
        loadedMeshes.push(loadedResults.meshes[mesh]);
    }

    return loadedMeshes;
}

async function playAnims(scene, loadedResults, animationIndex) {

    // Check if animationIndex is not null
    if (animationIndex === null) {
        animationIndex = 0;    }


    if (!scene || !loadedResults || !loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("Invalid input. Unable to play animations.");
        return;
    }

    // Play the animation at the specified index
    if (animationIndex >= 0 && animationIndex < loadedResults.animationGroups.length) {
        const animationGroup = loadedResults.animationGroups[animationIndex];
        if (!animationGroup.targetedAnimations || animationGroup.targetedAnimations.some(ta => ta.target === null)) {
            console.error("Animation target missing for some animations in the group:", animationGroup.name);
            return;
        }


        // //get number of frames from this animation
        // const frameStart = animationGroup.from;
        // const frameEnd = animationGroup.to;
        // const totalFrames = frameEnd - frameStart;


        // Set the start frame of the animation group
        animationGroup.from = animationGroup.from+30;
        animationGroup.to = animationGroup.to-30;

        await new Promise((resolve) => {
            animationGroup.onAnimationEndObservable.addOnce(resolve);
            //first stop any animation
            scene.stopAnimation(scene.meshes[0]);
            //then play the animation
            animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
        });
        console.log("Animation played:", animationGroup.name);
        return true;
    } else {
        console.error("Invalid animation index:", animationIndex);
        return false;
    }

}
