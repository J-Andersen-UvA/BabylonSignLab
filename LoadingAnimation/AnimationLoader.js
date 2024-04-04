var getAnims = function(scene, mesh) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return;
    }

    // BABYLON.SceneLoader.OnPluginActivatedObservable.add(function(loader) {
    //     if (loader.name == "gltf" || loader.name == "glb") {
    //         loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
    //     }
    // });

    // let animations = [];
    // let animationGroup = new BABYLON.AnimationGroup("group1");

    // const importPromise = new Promise((resolve, reject) => {
    //     BABYLON.SceneLoader.ImportAnimationsAsync("http://localhost:8080/MeshesAndAnims/", "3.glb", scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Clean, null,
    //         onSucces = function(animatables) {
    //             console.log("Animations loaded successfully I think.");
    //             animations = animatables;
    //             if (animatables.length > 0) {
    //                 resolve(animatables);
    //             } else {
    //                 reject("No animations found.");
    //             }
    //         },
    //         onProgress = function() {
    //             console.log("Loading animations...");
    //         },
    //         onError = function(error) {
    //             console.error("Error loading animations: " + error);
    //             reject(error);
    //         }
    //     );
    // });

    // importPromise.then((animatables) => {
    //     console.log("Animations loaded, adding to anim group");
    //     console.log(animatables[0]);
    //     animationGroup.addTargetedAnimation(animatables[0], mesh);
    // }).catch((error) => {
    //     console.error(error);
    // });
    // BABYLON.SceneLoader.ImportMeshAsync("", "/3.glb", scene);
    BABYLON.SceneLoader.ImportMesh(null, "http://localhost:8080/MeshesAndAnims/", "onzinverhaal.glb", scene, function (newMeshes, particleSystems, skeletons) {
        console.log("Mesh loaded");
        console.log(skeletons);
        // Check if skeletons array is not empty
        if (skeletons.length > 0) {
            // Extract animations from the first skeleton
            var animations = skeletons[0].getAnimations();
            console.log(animations);
        } else {
            console.log("No animations found.");
        }
    });
    // .then(function (result) {
    //     _engine.hideLoadingUI();
    //     //
    //     assignAnimations(result.animationGroups)
    // })
    // .catch(function (error) {
    //     console.error(_TAG + error);
    // }
};
