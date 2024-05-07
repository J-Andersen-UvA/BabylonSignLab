//Play the animation that is currently loaded
function playLoadedAnims(scene, loaded) {
    if (scene && loaded) {
        // Initialize animation with standard vars, start frame + 30 frames, end frame - 30 frames
        initializeAnimationGroups(loaded);

        if (keepAnimating) {
            playAnimationForever(scene, loaded);
        } else {
            playAnims(scene, loaded, 0);
        }
    } else {
        console.error("Scene or loaded variables are not set.");
    }
}

function playAnimationForever(scene, loaded) {
    playAnims(scene, loaded, 0) // 1 comes from loaded animation of gloss, 0 comes from baked-in animation of avatar.glb
        .then(animationPlayed => {
            if (animationPlayed) {
                // Replay the animation after 1 second timeout and after it stopped
                playAnimationForever(scene, loaded);
            }
        })
        .catch(err => {
            console.error("Error playing animation:", err);
        });
}

// Define an object to encapsulate animation sequencing logic
// That way, we can have the starting and stopping of the animation in this file instead
// of the main file. And we dont need to use a global continueloop variable.
const AnimationSequencer = (function () {
    let continueLoop = false;
    let notSequencing = false;
    let animationGroupFrom = 80;
    let animationGroupTo = 100;

    async function startAnimationLoop(basePath, scene, loadedMesh, animations) {
        continueLoop = true;

        // Load and initialize animations
        if (await preloadAndInitializeAnimations(basePath, scene, loadedMesh, animations)) {
            console.log("All animations preloaded and initialized.");
            await hideModal();

            recordingFile = zinArray.join(' ');
            if (recording && recordingMethod == "zin") await startRecording('renderCanvas', recordingFile); // Start recording;

            for (let i = 0; i < loadedMesh.animationGroups.length; i++) {
                if (!continueLoop) break;

                glos = loadedMesh.animationGroups[i].glos;

                if (recording && recordingMethod != "zin") await startRecording('renderCanvas', glos); // Start recording;

                console.log(`Now playing: ${glos}`);
                if (await playAnims(scene, loadedMesh, i)) {
                    console.log(`Playing complete: ${glos}`);
                    if (recording == "glos") stopRecording();
                } else {
                    console.log(`Failed to play animation: ${glos}`);
                }

                if (i == loadedMesh.animationGroups.length - 1 && keepPlaying == false) {
                    keepAnimating = true;
                    playLoadedAnims(scene, loadedMesh);
                }
                else if (i == loadedMesh.animationGroups.length - 1 && keepPlaying == true) {
                    if (recordingMethod == "zin" && recording) stopRecording();
                    recording = false;
                    //here i want to restart the for loop to 0
                    i = -1;
                    console.log("restart")
                }
            }
        } else {
            console.error("Failed to preload and initialize animations.");
        }
    }

    function stopAnimationLoop() {
        continueLoop = false;
    }

    function setAnimationGroupFrom(value) {
        animationGroupFrom = value;
    }

    function setAnimationGroupTo(value) {
        animationGroupTo = value;
    }

    function getAnimationGroupFrom() {
        return animationGroupFrom;
    }

    function getAnimationGroupTo() {
        return animationGroupTo;
    }

    function sequencing() {
        return notSequencing;
    }

    function setSequencing(value) {
        notSequencing = value;
    }

    return {
        start: startAnimationLoop,
        stop: stopAnimationLoop,
        setFrom: setAnimationGroupFrom,
        setTo: setAnimationGroupTo,
        getFrom: getAnimationGroupFrom,
        getTo: getAnimationGroupTo,
        getSequencing: sequencing,
        setSequencing: setSequencing
    };
})();

async function initializeAnimationGroups(loadedResults) {
    loadedResults.animationGroups.forEach(animationGroup => {
        if (!animationGroup.initialized && AnimationSequencer.getSequencing()) {
            // animationGroup.normalize(0, 200); //messes up more
            animationGroup.from += AnimationSequencer.getFrom(); // for estimation of frames, we would need tool of amit to determine mid frame
            animationGroup.to -= AnimationSequencer.getTo();
            animationGroup.initialized = true;
            //console.log("Retargeting animation group: " + animationGroup.name);
            animationGroup.targetedAnimations.forEach((targetedAnimation) => {
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
        // console.log(scene, loadedResults, loadedResults.animationGroups, loadedResults.animationGroups.length);
        console.error("Invalid input. Unable to play animations.");
        return false;
    }

    // Check the range of the animation index
    if (animationIndex >= 0 && animationIndex <= loadedResults.animationGroups.length) {
        // animationIndex -= 1;
        const animationGroup = loadedResults.animationGroups[animationIndex];
        console.error(loadedResults.animationGroups);

        // Only blend if there are more than one animation groups
        if (animationIndex+1 != loadedResults.animationGroups.length) {
            animationGroup.enableBlending = true;
        }
        // animationGroup.normalize = true;

        if (!animationGroup.targetedAnimations || animationGroup.targetedAnimations.some(ta => ta.target === null)) {
            console.error("Animation target missing for some animations in the group:", animationGroup.name);
            // return false;
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
    loadedResults.fetched.meshes.forEach(mesh => {
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
