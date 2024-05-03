// Import the BABYLON module

/*
The following functions are deprecated and should not be used.
We are fetching this information on load of the model itself.

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
*/

async function initializeAnimationGroups(loadedResults) {
    loadedResults.animationGroups.forEach(animationGroup => {
        if (!animationGroup.initialized) {
            // animationGroup.normalize(0, 200); //messes up more
            animationGroup.from += animationGroupFrom; // for estimation of frames, we would need tool of amit to determine mid frame
            animationGroup.to -= animationGroupTo;
            animationGroup.initialized = true;
            //console.log("Retargeting animation group: " + animationGroup.name);
            animationGroup.targetedAnimations.forEach((targetedAnimation) =>
            {
                //this can be used to inject seed noise for randomization in coordinates/rotation of bones

                // const newTargetBone = targetSkeleton.bones.filter((bone) => { return bone.name === targetedAnimation.target.name })[0];
                // // //console.log("Retargeting bone: " + target.name + "->" + newTargetBone.name);
                // targetedAnimation.target = newTargetBone ? newTargetBone.getTransformNode() : null;
                // console.log(targetedAnimation.target);
            });
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
    if (animationIndex >= 0 && animationIndex <= loadedResults.animationGroups.length) {
        animationIndex -= 1;
        const animationGroup = loadedResults.animationGroups[animationIndex];
        console.error(loadedResults.animationGroups[animationIndex]);

        // Only blend if there are more than one animation groups
        if (animationIndex != loadedResults.animationGroups.length) {
            animationGroup.enableBlending = true;
        }
        // animationGroup.normalize = true;

        if (!animationGroup.targetedAnimations || animationGroup.targetedAnimations.some(ta => ta.target === null)) {
            console.error("Animation target missing for some animations in the group:", animationGroup.name);
            return false;
        }

        return new Promise((resolve, reject) => {
            // Listen to the animation frame advance
            scene.onBeforeRenderObservable.add((eventData, eventState) => {
                animationGroup.targetedAnimations.forEach(targetedAnimation => {
                    const target = targetedAnimation.target;
                    if (target && target.rotationQuaternion) {
                        target.rotationQuaternion.normalize(); // Normalize the quaternion every frame
                    }
                });
            
            });

            animationGroup.onAnimationEndObservable.addOnce(() => {
                scene.onBeforeRenderObservable.clear();  // Remove the observer to clean up
                resolve(true);
            });

            // Play the animation
            animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
        });
    } else {
        console.error("Invalid animation index:", animationIndex, "for loadedResults.animationGroups.length:", loadedResults.animationGroups.length, "animations.");
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


async function removeAnims(scene, loadedResults) {
    // Validate the input parameters
    if (!scene || !loadedResults || !loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("Invalid input. Unable to remove animations.");
        return false;
    }

    scene.animationGroups = []

    console.log("All animations have been removed.");
    return true;
}
