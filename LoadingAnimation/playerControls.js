// import '@babylonjs/gui'

function createRootContainer(gui) {
    var rootContainer = new BABYLON.GUI.Grid("grid");
    rootContainer.width = "100%";
    rootContainer.height = "100%";
    gui.addControl(rootContainer);
    
    rootContainer.addRowDefinition(0.9);
    rootContainer.addRowDefinition(0.2);

    var animBtnsPanel = new BABYLON.GUI.StackPanel("animBtns");
    animBtnsPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    animBtnsPanel.width = "30%";
    animBtnsPanel.spacing = 10;
    rootContainer.addControl(animBtnsPanel, 0);
    rootContainer.animBtnsPanel = animBtnsPanel;

    return rootContainer;
}

function animSlider(animationGroup, rootContainer, scene) {
    // Remove previous controls
    rootContainer.clearControls();
    console.log("animationGroup: ", animationGroup);

    var currGroup = animationGroup;
    var groupBtn = BABYLON.GUI.Button.CreateSimpleButton(currGroup.name, currGroup.name);
    groupBtn.width = 0.9;
    groupBtn.height = "60px";
    groupBtn.color = "white";
    groupBtn.cornerRadius = "10";
    groupBtn.background = "Grey";
    rootContainer.animBtnsPanel.addControl(groupBtn);

    // Add a slider to control the animation
    var slider = new BABYLON.GUI.Slider("animSlider");
    slider.width = "30%";
    slider.heightInPixels = 20;
    slider.color = "white";
    slider.thumbWidth = "40px";
    slider.isThumbCircle = true;
    rootContainer.addControl(slider, 1);
    rootContainer.playing = true;
    
    // Code for frame display, im personally not a fan of it but its here if we need it
    // var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("Header");
    // var header = new BABYLON.GUI.TextBlock();
    // header.heightInPixels = 150;
    // header.color = "white";
    // header.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    // header.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // advancedTexture.addControl(header);

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


    // var panel = new BABYLON.GUI.StackPanel();
    // panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    // panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // panel.isVertical = false;
    // panel.height = "60px";
    // advancedTexture.addControl(panel);
}

function pausePlayButton(animationGroup, scene) {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("Header");
    var panel = new BABYLON.GUI.StackPanel();
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.isVertical = false;
    panel.height = "60px";
    var playColor = new BABYLON.Color3(1/255, 255/255, 150/255).toHexString();
    var pauseColor = new BABYLON.Color3(1/255, 150/255, 255/255).toHexString();

    //Continue button
    var playBtn = BABYLON.GUI.Button.CreateImageOnlyButton("button1", "icons/pause.svg");
    playBtn.width = '40px';
    playBtn.height = "40px";
    playBtn.color = "white";
    playBtn.background = pauseColor;
    playBtn.cornerRadius = "2";
    playBtn.padding = "20px";
    panel.addControl(playBtn);

    playBtn.onPointerClickObservable.add(() => {
        if (animationGroup.isPlaying) {
            animationGroup.pause();
            rootContainer.playing = false;
            playBtn.image.source = "icons/play.svg";
            playBtn.background = playColor;
        } else {
            animationGroup.play();
            rootContainer.playing = true;
            playBtn.image.source = "icons/pause.svg";
            playBtn.background = pauseColor;
        }
    });

    playBtn.pointerEnterAnimation = () => {
        playBtn.background = "white";
    }

    playBtn.pointerOutAnimation = () => {
        if (animationGroup.isPlaying) {
            playBtn.background = pauseColor;
        } else {
            playBtn.background = playColor;
        }
    }

    advancedTexture.addControl(panel);
}

function hideShowGui(rootContainer, show) {
    if (show == null) {
        rootContainer.isVisible = !rootContainer.isVisible;
        return;
    }

    rootContainer.isVisible = show;
}
