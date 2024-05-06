var CameraController = (function() {
    // Private variables and functions
    var camera;
    
    function setAngleAlpha(angle) {
        camera.alpha = BABYLON.Tools.ToRadians(angle);
    }

    function setAngleBeta(angle) {
        camera.beta = BABYLON.Tools.ToRadians(angle);
    }

    function getAngleAlpha() {
        return BABYLON.Tools.ToDegrees(camera.alpha);
    }

    function getAngleBeta() {
        return BABYLON.Tools.ToDegrees(camera.beta);
    }

    function setCameraParams(scene, cameraAngle, cameraAngleBeta, movingCamera) {
        // cameraAngle is in degrees so we set it to radians
        if (cameraAngle) {
            setAngleAlpha(cameraAngle);
        }
    
        // cameraAngleBeta is in degrees so we set it to radians
        if (cameraAngleBeta) {
            setAngleBeta(cameraAngleBeta);
        }
    
        if (movingCamera) {
            createCameraRotationAnimation(scene, 220, 340, 600); // Rotates from 0 to 180 degrees over 100 frames
    
            /*        async function playLoadedAnims() {
                        if (scene && loaded) {
                            
                            await playAnims(scene, loaded, 0);
                        } else {
                            console.error('Scene or loaded variables are not set.');*/
        }
    }
    
    function setCameraOnBone(scene, targetMesh, skeleton, boneIndex = 4, visualizeSphere = false) {
        /* Creating a camera that we set to the position of the bone attached to the mesh's neck bone:
        * 1. Create an empty object that we visualize as a sphere
        * 2. Attach the sphere to the bone
        * 3. Create a camera that we aim at the sphere
        * 4. Profit
        */
    
        // Create a sphere that we attach to the bone
        console.log("Setting camera on bone...");
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        sphere.attachToBone(skeleton.bones[boneIndex], targetMesh);
    
        sphere.setEnabled(visualizeSphere);
    
        // Initializes an ArcRotateCamera named "camera1" in the scene.
        // This camera is positioned to rotate around a target point defined by the vector (0, 0, -1).
        // The 'alpha' parameter, set as Math.PI / -2, positions the camera at -90 degrees on the XZ plane,
        // effectively placing it on the negative X-axis and facing towards the origin.
        // The 'beta' parameter of 1 radian tilts the camera slightly downward from the vertical top view.
        // The 'radius' parameter of 3 units sets the distance from the camera to the target point, placing it 3 units away.
    
        // This setup provides a unique side and slightly elevated view of the scene centered around the target point on the negative Z-axis.
        camera.target = sphere;
    };

    function createCameraRotationAnimation(scene, startDegree, endDegree, duration) {
        // Convert degrees to radians for the alpha property
        var startRadians = BABYLON.Tools.ToRadians(startDegree);
        var endRadians = BABYLON.Tools.ToRadians(endDegree);

        // Create a new animation object for the alpha property
        var alphaAnimation = new BABYLON.Animation(
            "alphaAnimation", 
            "alpha", 
            30, 
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE // Loop mode
        );

        // Define key frames for the animation
        var keys = []; 
        keys.push({ frame: 0, value: startRadians });
        keys.push({ frame: duration/2, value: endRadians });
        keys.push({ frame: duration, value: startRadians });
        alphaAnimation.setKeys(keys);

        // Add easing function for smooth animation (optional)
        // var easingFunction = new BABYLON.CubicEase();
        // easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        // alphaAnimation.setEasingFunction(easingFunction);

        // Apply the animation to the camera
        camera.animations = [];
        camera.animations.push(alphaAnimation);

        // Begin the animation
        scene.beginAnimation(camera, 0, 600, true, 1);
    };

    // Public interface
    return {
        setCameraParams: setCameraParams,
        setCameraOnBone: setCameraOnBone,
        setAngleAlpha: setAngleAlpha,
        setAngleBeta: setAngleBeta,
        getAngleAlpha: getAngleAlpha,
        getAngleBeta: getAngleBeta,
        getInstance: function(scene, canvas) {
            if (!camera) {
                console.log("Initializing camera instance...");
                camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / -2, 1, 3, new BABYLON.Vector3(0, 0, -2), scene);
                camera.attachControl(canvas, true);
                camera.wheelPrecision = 50; //Mouse wheel speed
            }

            return camera;
        }
    };
})();

function addAngle(angle) {
    console.log(CameraController.getAngleAlpha());
    CameraController.setAngleAlpha(CameraController.getAngleAlpha() + angle);
}