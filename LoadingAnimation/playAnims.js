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

async function initializeAnimationGroups(loadedResults) {
    loadedResults.animationGroups.forEach(animationGroup => {
        if (!animationGroup.initialized) {
            animationGroup.from += 30; //we subtract frames from 
            animationGroup.to -= 30;
            animationGroup.initialized = true;
        }
    });
    return true;
}



async function playAnims(scene, loadedResults, animationIndex) {
    // Validate the input parameters
    if (!scene || !loadedResults || !loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("Invalid input. Unable to play animations.");
        return false;
    }

    // Check the range of the animation index
    if (animationIndex >= 0 && animationIndex < loadedResults.animationGroups.length) {
        const animationGroup = loadedResults.animationGroups[animationIndex];
        if (!animationGroup.targetedAnimations || animationGroup.targetedAnimations.some(ta => ta.target === null)) {
            console.error("Animation target missing for some animations in the group:", animationGroup.name);
            return false;
        }

        const midFrame = (animationGroup.from + animationGroup.to) / 2;  // Calculate midpoint frame
        let midRotationCaptured = false;  // Flag to ensure rotation is captured only once

        return new Promise((resolve, reject) => {
            // Listen to the animation frame advance
            scene.onBeforeRenderObservable.add((eventData, eventState) => {
                if (!midRotationCaptured && animationGroup.targetedAnimations.some(ta => {
                    return ta.target && ta.animation.runtimeAnimations.some(ra => {
                        // Check if the current frame is around the midpoint
                        return ra.currentFrame >= midFrame;
                    });
                })) {
                    // Capture and apply the midpoint rotation for each target
                    animationGroup.targetedAnimations.forEach(targetedAnimation => {
                        const target = targetedAnimation.target;
                        if (target && target.rotationQuaternion) {
                            target.rotationQuaternion = target.rotationQuaternion.clone();
                        }
                    });
                    midRotationCaptured = true;  // Set the flag to avoid multiple captures
                }
            });

            animationGroup.onAnimationEndObservable.addOnce(() => {
                scene.onBeforeRenderObservable.clear();  // Remove the observer to clean up
                console.log("Animation played:", animationGroup.name);
                resolve(true);
            });

            // Play the animation
            animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
        });
    } else {
        console.error("Invalid animation index:", animationIndex);
        return false;
    }
}




async function stopAnims(scene, loadedResults) {
    // Validate the input parameters
    if (!scene || !loadedResults || !loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("Invalid input. Unable to stop animations.");
        return false;
    }

    // Stop animations on all meshes
    loadedResults.meshes.forEach(mesh => {
        scene.stopAnimation(mesh);
    });

    // If you need to stop animation groups as well
    loadedResults.animationGroups.forEach(animationGroup => {
        animationGroup.stop();  // Stops the animation group from playing
    });

    console.log("All animations have been stopped.");
    return true;
}


async function preloadAndInitializeAnimations(basePath, scene, loaded, animations) {
    for (let animName of animations) {
        console.log(`Preloading animation: ${animName}`);
        //add animName to modal 
        $('#errorModalLabel').append(`<p>${animName}</p>`)
        let result = await getAnims(basePath, scene, loaded, animName);
        if (!result) {
            console.error(`Failed to preload animation: ${animName}`);
            return false;
        }
    }
    initializeAnimationGroups(loaded);  // Initialize all at once after loading
    return true;
}