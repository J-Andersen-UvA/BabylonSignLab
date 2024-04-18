// Import animations for BabylonJS
async function getAnims(basePath, scene, loadedResults, glos, gltf) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return false;
    }
    // basePath = "http://localhost:8080/MeshesAndAnims/olines_anims/";

    // const result = await BABYLON.SceneLoader.ImportAnimationsAsync(basePath, animFilename, scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync, null);

    // Only allow glTF and glB loaders to not play animations automatically
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name === "gltf" || loader.name === "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });

    console.log("Loading animations for " + glos + "...")
    // Import animations asynchronously without auto-starting them
    try {
        const result = await BABYLON.SceneLoader.ImportAnimationsAsync(
            basePath,
            glos + (gltf==1 ? ".gltf" : ".glb"),
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
        lastIndex = result.animationGroups.length - 1;
        result.animationGroups[lastIndex].glos = glos;

        // Add animations to the loadedResults's animation group
        loadedResults.animationGroups = result.animationGroups;
        console.log("Animations loaded for " + glos);
        
        // ***************************************** //
        // practicing blendshapes
        // Get blendshape animation data
        console.log("Data: ", result);
        // Check if animations were successfully imported
        if (result && result.animationGroups) {
            // Iterate over each animation group
            result.animationGroups.forEach(animationGroup => {
                // Check if this animation group affects blendshapes
                console.log(animationGroup.targetedAnimations[0].target);
                if (animationGroup.targetedAnimations[0].target instanceof BABYLON.MorphTargetManager) {
                    // Access blendshape animations
                    var blendshapeManager = animationGroup.targetedAnimations[0].target;
                    
                    // Iterate over blendshape animations
                    blendshapeManager.targets.forEach((blendshape, index) => {
                        // Access keyframes for this blendshape
                        var keys = blendshape.animations[0].getKeys(); // Assuming blendshape animations are stored in the first animation track
                        
                        // Log out key values for this blendshape
                        console.log("Blendshape " + index + " keys:");
                        keys.forEach(function(key, index) {
                            console.log("Key " + index + ": Time = " + key.frame + ", Value = " + key.value);
                        });
                    });
                }
            });
        } else {
            console.error("Failed to load animations or unexpected data structure.");
        }

        // getMeshMorphs("Face");
        checkMorphTargetAnims(scene);
        // ***************************************** //
        
        return true;
    } catch (error) {
        console.error("Failed to load animations:", error);
        return false;
    }
}

function getMeshMorphs(meshName) {
    // Get the mesh named "Face" from the scene
    var mesh = scene.getMeshByName(meshName);

    if (mesh) {
        // Check if the mesh has a morph target manager
        if (mesh.morphTargetManager) {
            // Access the morph target manager
            var morphTargetManager = mesh.morphTargetManager;

            // Iterate over the morph targets
            for (var i = 0; i < morphTargetManager.numTargets; i++) {
                // Access the i-th morph target
                var morphTarget = morphTargetManager.getTarget(i);

                // Log information about the morph target
                console.log("Morph Target " + i + ":");
                console.log("Name: " + morphTarget.name);
                console.log("Position: ", morphTarget.getPositions()); // Example: Log positions of the morph target
                // Add more properties you want to access here
            }
        } else {
            console.log("The mesh named 'Face' does not have a morph target manager.");
        }
    } else {
        console.log("Mesh named 'Face' not found in the scene.");
    }
}

function checkMorphTargetAnims(scene) {
    // Iterate over all meshes in the scene
    scene.meshes.forEach(function(mesh) {
        // Check if the mesh has a morph target manager
        if (mesh.morphTargetManager) {
            // Access the morph target manager
            var morphTargetManager = mesh.morphTargetManager;

            // Log information about the mesh
            console.log("Mesh: " + mesh.name);

            // Check if the morph target manager has animations
            if (morphTargetManager.animations && morphTargetManager.animations.length > 0) {
                // Iterate over the animations of the morph target manager
                morphTargetManager.animations.forEach(function(animation, index) {
                    // Log information about the animation
                    console.log("Morph Target Animation " + index + " of " + mesh.name + ":");
                    console.log("Name: " + animation.name);
                    console.log("Keys:", animation.getKeys()); // Log animation keys
                    // Add more properties you want to access here
                });
            } else {
                console.log("No animations found for the morph target manager of " + mesh.name);
            }

            // // Log information about each morph target
            // for (var i = 0; i < morphTargetManager.numTargets; i++) {
            //     var morphTarget = morphTargetManager.getTarget(i);
            //     console.log("Morph Target " + i + " of " + mesh.name + ":");
            //     console.log("Name: " + morphTarget.name);
            //     console.log("Positions:", morphTarget.getPositions()); // Log morph target positions
            //     // Add more properties you want to access here
            // }
        }
    });
}