// import '@babylonjs/gui'
// document.addEventListener("fullscreenchange", () => {
//     console.error("fullscreenchange");
//     resizeLogic();
// });

// window.addEventListener("resize", () => {
//     console.error("resize");
//     resizeLogic();
// });

function resizeLogic() {
    gui.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
    if (engine.getRenderHeight() >= 580) {
        gui.rootContainer.getChildByName("grid").getChildByName("animSlider").height = "2%";
        gui.rootContainer.getChildByName("grid").getChildByName("playPause").top = "-3%";
    } else if (engine.getRenderHeight() < 220) {
        gui.rootContainer.getChildByName("grid").getChildByName("animSlider").height = "8%";
        gui.rootContainer.getChildByName("grid").getChildByName("playPause").top = "-7%";
    } else {
        gui.rootContainer.getChildByName("grid").getChildByName("animSlider").height = "5%";
        gui.rootContainer.getChildByName("grid").getChildByName("playPause").top = "-5%";
    }

    var percentage = window.innerWidth * 0.03;
    gui.rootContainer.getChildByName("grid").getChildByName("playPause").width = percentage + "px";
    gui.rootContainer.getChildByName("grid").getChildByName("playPause").height = percentage + "px";
}

function createRootContainer(gui) {
    var rootContainer = new BABYLON.GUI.Grid("grid");
    rootContainer.width = "100%";
    rootContainer.height = "100%";
    gui.addControl(rootContainer);
    
    // rootContainer.addRowDefinition(0.9);
    // rootContainer.addRowDefinition(0.2);

    // var animBtnsPanel = new BABYLON.GUI.StackPanel("animBtns");
    // animBtnsPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    // animBtnsPanel.width = "30%";
    // animBtnsPanel.spacing = "2%"; // Use percentage for spacing
    // rootContainer.addControl(animBtnsPanel, 0);
    // rootContainer.animBtnsPanel = animBtnsPanel;

    return rootContainer;
}

function animSlider(animationGroup, rootContainer, scene) {
    // Remove previous controls
    rootContainer.clearControls();
    console.log("animationGroup: ", animationGroup);

    var currGroup = animationGroup;

    // Add a slider to control the animation
    var slider = new BABYLON.GUI.Slider("animSlider");
    slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    slider.width = "50%";
    // Check if screen too small for slider 2% is minimum
    if (engine.getRenderHeight() >= 580) {
        slider.height = "2%";
    } else if (engine.getRenderHeight() < 220) {
        slider.height = "8%";
    } else {
        slider.height = "5%";
    }
    slider.top = "-5%";
    slider.color = "white";
    slider.thumbWidth = "0%"; // Use percentage for thumb width
    slider.isThumbCircle = true;
    rootContainer.addControl(slider, 1);
    rootContainer.animSlider = slider;
    rootContainer.playing = true;

    slider.onValueChangedObservable.add(function (value) {
        // header.text = ((value) | 0);
        currGroup.goToFrame(value);
        slider.minimum = currGroup.from;
        slider.maximum = currGroup.to;
    });

    slider.onPointerDownObservable.add(() => {
        animationGroup.pause();
    });

    slider.onPointerUpObservable.add(() => {
        if (rootContainer.playing) {
            animationGroup.play();
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        if (currGroup) {
            var ta = currGroup.targetedAnimations;
            if (ta && ta.length) {
                var ra = ta[0].animation.runtimeAnimations;
                if (ra && ra.length) {
                    slider.value = ra[0].currentFrame;
                }
            }
        }
    });
}

function pausePlayButton(animationGroup, rootContainer) {
    var playColor = new BABYLON.Color3(1/255, 255/255, 150/255).toHexString();
    var pauseColor = new BABYLON.Color3(1/255, 150/255, 255/255).toHexString();

    // Create the button container and set the position of the button based on the window size
    const playBtn = new BABYLON.GUI.Container("playPause");
    playBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    playBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    var percentage = window.innerWidth * 0.03;
    playBtn.width = percentage + "px";
    playBtn.height = percentage + "px";
    playBtn.left = "-20%";
    if (engine.getRenderHeight() >= 580) {
        playBtn.top = "-3%";
    } else if (engine.getRenderHeight() < 220) {
        playBtn.top = "-7%";
    } else {
        playBtn.top = "-5%";
    }
    playBtn.background = "transparent";

    // Create the ellipse to hold the button and set the color based on the current state of the animation
    var ellipse = new BABYLON.GUI.Ellipse();
    ellipse.width = "100%";
    ellipse.height = "100%";
    ellipse.background = "transparent";
    ellipse.thickness = 0;

    // Create the clickable button and add the play/pause image to it
    var clickable = new BABYLON.GUI.Button('clickable');
    clickable.width = "100%";
    clickable.height = "100%";
    clickable.background = "transparent";
    clickable.thickness = 0;
    ellipse.addControl(clickable); 
    var playImage = new BABYLON.GUI.Image("playImage", "icons/pause.svg");
    playImage.width = "60%";
    playImage.height = "60%";
    playImage.shadowColor = pauseColor;
    playImage.shadowBlur = 1;
    playImage.shadowOffsetX = 3;
    playImage.shadowOffsetY = 2.5;
    clickable.addControl(playImage);

    // Function to handle play/pause logic
    function togglePlayPause() {
        if (animationGroup.isPlaying) {
            animationGroup.pause();
            rootContainer.playing = false;
            playImage.source = "icons/play.svg";
            playImage.shadowColor = playColor;
        } else {
            animationGroup.play();
            rootContainer.playing = true;
            playImage.source = "icons/pause.svg";
            playImage.shadowColor = pauseColor;
        }
    }

    // When the button is clicked, pause or play the animation based on the current state
    clickable.onPointerClickObservable.add(togglePlayPause);

    // Add event listener for the spacebar to toggle play/pause
    window.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            togglePlayPause();
            // Prevent default spacebar behavior (e.g., scrolling down)
            event.preventDefault();
        }
    });

    // Change the color of the button when the mouse hovers over it
    clickable.pointerEnterAnimation = () => {
        playImage.shadowColor = "white";
    }

    // Change the color of the button when the mouse leaves it
    clickable.pointerOutAnimation = () => {
        if (animationGroup.isPlaying) {
            playImage.shadowColor = pauseColor;
        } else {
            playImage.shadowColor = playColor;
        }
    }

    playBtn.addControl(ellipse); 
    rootContainer.addControl(playBtn);
}

function hideShowGui(rootContainer, show) {
    if (show == null) {
        rootContainer.isVisible = !rootContainer.isVisible;
        return;
    }

    rootContainer.isVisible = show;
}
