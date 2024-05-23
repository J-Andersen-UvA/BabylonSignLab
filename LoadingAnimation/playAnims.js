//Play the animation that is currently loaded
async function playLoadedAnims(scene, loaded) {
    if (scene && loaded) {
        // Initialize animation with standard vars, start frame + 30 frames, end frame - 30 frames
        await initializeAnimationGroups(loaded);

        if (keepAnimating) {
            await playAnimationForever(scene, loaded);
        } else {
            await playAnims(scene, loaded, 0);
        }
    } else {
        console.error("Scene or loaded variables are not set.");
    }
}

async function playAnimationForever(scene, loaded) {
    await playAnims(scene, loaded, 0) // 1 comes from loaded animation of gloss, 0 comes from baked-in animation of avatar.glb
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
    let blending = true;

    async function startAnimationLoop(basePath, scene, loadedMesh, animations, recording=false, recordingMethod="", keepPlaying=false) {
        continueLoop = true;
        console.log("recording: ", recording);

        // Load and initialize animations
        if (await preloadAndInitializeAnimations(basePath, scene, loadedMesh, animations)) {
            console.log("All animations preloaded and initialized.");
            await hideModal();

            recordingFile = zinArray.join(' ');
            if (recording && recordingMethod == "zin") await startRecording('renderCanvas', recordingFile); // Start recording;

            for (let i = 0; i < loadedMesh.animationGroups.length; i++) {
                if (!continueLoop) break;

                glos = loadedMesh.animationGroups[i].name;

                if (recording && recordingMethod != "zin") {
                    console.log("recording with method: ", recording, recordingMethod, glos);
                    await startRecording('renderCanvas', glos); // Start recording;
                }

                console.log(`Now playing: ${glos}`);
                if (await playAnims(scene, loadedMesh, i)) {
                    console.log(`Playing complete: ${glos}`);
                    // if (recording == "glos") { stopRecording(); }
                    if (recording != "zin") { stopRecording(); }
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

        return;
    }

    function stopAnimationLoop() {
        continueLoop = false;
    }

    function setBlending(value) {
        blending = value;
    }

    function getBlending() {
        return blending;
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
        setSequencing: setSequencing,
        getBlending: getBlending,
        setBlending: setBlending
    };
})();

async function initializeAnimationGroups(loadedResults) {
    console.log("Initializing animation groups...");
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
        console.error("Invalid input. Unable to play animations.");
        return false;
    }

    // Check the range of the animation index
    if (animationIndex >= 0 && animationIndex <= loadedResults.animationGroups.length) {
        // animationIndex -= 1;
        const animationGroup = loadedResults.animationGroups[animationIndex];
        console.error(loadedResults.animationGroups);

        // Only blend if there are more than one animation groups
        if (animationIndex + 1 != loadedResults.animationGroups.length && EngineController.blending) {
            animationGroup.enableBlending = true;
        }
        animationGroup.normalize = true;

        if (!animationGroup.targetedAnimations || animationGroup.targetedAnimations.some(ta => ta.target === null)) {
            console.error("Animation target missing for some animations in the group:", animationGroup.name);
            // return false;
        }

        return new Promise((resolve) => {
            animationGroup.onAnimationEndObservable.addOnce(() => {
                console.log(`Animation ${animationGroup.name} has ended.`);
                scene.onBeforeRenderObservable.clear();  // Remove the observer to clean up
                resolve(true);
            });

            // Listen to the animation frame advance
            // scene.onBeforeRenderObservable.add((eventData, eventState) => {
            //     animationGroup.targetedAnimations.forEach(targetedAnimation => {
            //         // if null skip
            //         if (targetedAnimation.target) { 
            //             const target = targetedAnimation.target;
            //             if (target && target.rotationQuaternion) {
            //                 target.rotationQuaternion.normalize(); // Normalize the quaternion every frame
            //             }
            //         }
            //     });
            // });

            // Play the animation
            animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
            // animationGroup.start();
        });
    } else {
        console.error("Invalid animation index:", animationIndex, "for loadedResults.animationGroups.length:", loadedResults.animationGroups.length, "animations.");
        return false;
    }
}

function stopAnims(scene, loadedResults) {
    // Validate the input parameters
    if (!scene) {
        console.error("Scene is not set.");
        console.log(scene);
        return false;
    }

    if (!loadedResults) {
        console.error("loadedResults is not set.");
        console.log(loadedResults);
        return false;
    }

    if (!loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("AnimGroups are not present and therefore already stopped.");
        console.log(loadedResults.animationGroups);
        console.log(loadedResults.animationGroups.length);
        return true;
    }

    // Stop animations on all meshes
    loadedResults.fetched.meshes.forEach(mesh => {
        scene.stopAnimation(mesh);
    });

    // If you need to stop animation groups as well
    loadedResults.animationGroups.forEach(animationGroup => {
        animationGroup.stop();  // Stops the animation group from playing
        // For each animation in the group stop it as well
        animationGroup.targetedAnimations.forEach(targetedAnimation => {
            scene.stopAnimation(targetedAnimation.target);
        });
    });

    scene.animationGroups.forEach(animationGroup => {
        animationGroup.stop();  // Stops the animation group from playing
    });

    console.log("All animations have been stopped.");
    return true;
}


async function preloadAndInitializeAnimations(basePath, scene, loaded, animations) {
    if (animations === null || animations.length === 0) {
        console.error("No animations to preload.");
        return false;
    }

    console.log(animations)
    for (let animName of animations) {
        console.log(`Preloading animation: ${animName}`);
        //add animName to modal 
        $('#errorModalLabel').append(`<p>${animName}</p>`);
        let result = await getAnims(basePath, scene, loaded, animName);
        if (!result) {
            console.error(`Failed to preload animation: ${animName}`);
            return false;
        }
    }
    await initializeAnimationGroups(loaded);  // Initialize all at once after loading

    return true;
}

function signFetcher() {
    $("#glossModal").modal("show")
}

function stopLoadAndPlayAnimation(path) {
    console.log(path);
    console.log(EngineController.scene);

    // Stop the currently playing animation
    stopAnims(EngineController.scene, EngineController.loadedMesh);

    // Remove the currently loaded animation
    removeAnims(EngineController.scene, loadedMesh);
    removeAnims(EngineController.scene, scene);

    // Fetch the new animation and play
    getAnims(path, EngineController.scene, EngineController.loadedMesh, ParamsManager.glos, ParamsManager.gltf, fullPath = true)
        .then(anim => {
            console.log("getAnims returned: ", anim);
            anim.animationGroups.push(retargetAnimWithBlendshapes(EngineController.loadedMesh, anim.animationGroups[0], "freshAnim"));
            // console.log(anim.animationGroups);
            keepOnlyAnimationGroup(EngineController.scene, anim, EngineController.loadedMesh, "freshAnim");
            EngineController.loadedMesh.animationGroups = anim.animationGroups;
            EngineController.scene.animationGroups = anim.animationGroups;

            playAnims(EngineController.scene, EngineController.loadedMesh, 0, true);
            
            // wait for the EngineController.loadedMesh.animationGroups[0].isPlaying to start playing then refocus camera
            new Promise(resolve => {
                const checkPlaying = setInterval(() => {
                    if (EngineController.loadedMesh.animationGroups[0].isPlaying) {
                        clearInterval(checkPlaying);
                        resolve();
                    }
                }, 1000);
            }).then(() => {
                // Code to execute after the animation starts playing
                // Refocus the camera
                CameraController.reFocusCamera();
            });

        })
        .catch(error => {
            console.error('Failed to load animations:', error);
        });
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
