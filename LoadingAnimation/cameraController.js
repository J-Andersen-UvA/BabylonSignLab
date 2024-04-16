var createCameraRotationAnimation = function(camera, startDegree, endDegree, duration) {
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