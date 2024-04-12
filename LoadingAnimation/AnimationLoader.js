// Import animations for BabylonJS
var getAnims = async function (scene, loadedResults) {
    if (!scene) {
        console.error("Scene is undefined. Unable to import animations.");
        return;
    }

    // const baseUrl = "https://thomlucc.github.io/Assets/AvatarDemo/";
    // const sillyDance = BABYLON.SceneLoader.ImportAnimations(baseUrl, "SillyDance.glb", scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Clean, null,
    //     onSuccess=function (skeletons) {
    //         console.log("Animations loaded");
    //     },
    //     onProgress=function () {
    //         console.log("Loading animations...");
    //     }
    // );

    // TODO: When clicking the button twice, the animation loads, otherwise it doesnt load
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name == "gltf" || loader.name == "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });

    BABYLON.SceneLoader.ImportAnimations("http://localhost:8080/MeshesAndAnims/", "3.glb", scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Sync, null,
        onSuccess=function (skeletons) {
            console.log("Animations loaded");
        },
        onProgress=function () {
            console.log("Loading animations...");
        }
    );
}