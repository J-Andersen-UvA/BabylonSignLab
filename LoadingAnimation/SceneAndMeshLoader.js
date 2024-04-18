var createScene = async function (canvas, basePathMesh) {

    var options = {
        antialias: true, // Enable or disable antialiasing
        powerPreference: "high-performance",
        stencil: true,
    };


    var engine = new BABYLON.Engine(canvas, options);
    engine.disableManifestCheck = true //disable manifest checking for

    BABYLON.Animation.AllowMatricesInterpolation = true;

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // TODO: When clicking the button twice, the animation first frame loads
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
        if (loader.name == "gltf" || loader.name == "glb") {
            loader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
        }
    });




    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);


    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "glassesGuyUEGLTF.gltf", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "glassesGuyFBXConverted.gltf", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "http://localhost:8080/MeshesAndAnims/", "UEfbxCOCOSgltfBABYLONglb.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "GlassesGuyBabylon.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "glassesGuyBabylonCleanedExtraTransformNodes.glb", scene);
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "Nemu/Nemu.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "HeadTwistMesh.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "glassesGuyBabylonCleaned.glb", scene);
    // const result = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "glassesGuyBabylonCleaned2.glb", scene);

    if (result.meshes.length > 0) {
        mesh = result.meshes[0]; // Get the first mesh from the imported meshes
        mesh.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(180), BABYLON.Tools.ToRadians(0));
    }

    var glassesGuy = result.meshes[0].getChildren()[0];
    glassesGuy.parent = null;
    result.meshes[0].dispose();
    result.meshes[0] = null;
    // console.error(result);
    // console.error(scene);
    // for each mesh in glassesGuy, console error the morphTargetManager
    // console.error(glassesGuy.getChildren());
    // console.error(glassesGuy.meshes[0].name);
    // console.error(glassesGuy.meshes[0].morphTargetManager._targets);


    var topLight = new BABYLON.PointLight("topLight", glassesGuy.getAbsolutePosition().add(new BABYLON.Vector3(0, 4, 0)), scene);
    topLight.diffuse = new BABYLON.Color3(1, 1, 1); // Set light color
    topLight.intensity = 1; // Set light intensity





    /* Creating a camera that we set to the position of the bone attached to the mesh's neck bone:
        * 1. Create an empty object that we visualize as a sphere
        * 2. Attach the sphere to the bone
        * 3. Create a camera that we aim at the sphere
        * 4. Profit
    */
    // Create a sphere that we attach to the bone
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    sphere.attachToBone(scene.skeletons[0].bones[4], scene.meshes[1]);

    // Comment this code to visualise the sphere:
    sphere.setEnabled(false);

    //🍍
    const pineappleResult = await BABYLON.SceneLoader.ImportMeshAsync(null, basePathMesh, "pineapple.glb", scene);

    if (pineappleResult.meshes.length > 0) {
        const pineappleMesh = pineappleResult.meshes[0]; // Get the first mesh from the imported meshes
        pineappleMesh.rotation = new BABYLON.Vector3(BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0));
        pineappleMesh.name = "Pineapple"; // Give the mesh a name "Pineapple"
        //give pineapple a position

        //explain the position of the mesh
        //x,y,z? 
        //x: left to right
        //y: up and down
        //z: forward and backward


        pineappleMesh.position = new BABYLON.Vector3(0, 0, 10);

        // Function to generate key items


        // Generate keys using sine wave
        var keys = [];
        for (var frame = 0; frame <= 200; frame++) {
            if (frame < 40) {
                var value = Math.max(Math.sin(frame * Math.PI / 10) * 0.5, 0); // Adjust the amplitude and frequency as needed
                keys.push(generateKey(frame, value));
            } else {
                keys.push(generateKey(frame, 0.1));
            }
        }
        // console.log(keys);

        // Add bouncing animation to pineapple
        var animationBox = new BABYLON.Animation("myAnimation", "position.y", 15, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        animationBox.setKeys(keys);
        pineappleMesh.animations = [];
        pineappleMesh.animations.push(animationBox);
        scene.beginAnimation(pineappleMesh, 0, 200, true);


        //what if we have enough of Pineapple? 
        //we give it a animation to bounce towards the actor and then let it disappear
        document.addEventListener('keypress', function (event) {
            if (event.key === '1') {
                var keysZ = []; // Keyframes for the z-axis
                var keysY = []; // Keyframes for the y-axis
                var originalPositionZ = pineappleMesh.position.z; // Get current Z position
                var originalPositionY = pineappleMesh.position.y; // Get current Y position
                var bounceDistanceZ = 10; // Distance to bounce towards actor on z-axis
                var bounceHeightY = 5;  // Maximum height of the bounce on y-axis

                //get z and y position of the first mesh (the actor)
                var actorMesh = result.meshes[0];
                var actorPositionZ = actorMesh.position.z;
                var actorPositionY = actorMesh.position.y;

                //stop any animation of pineapple
                scene.stopAnimation(pineappleMesh);


                // Bounce towards position z = 0 and make it "fly" on y-axis
                for (var frame = 0; frame <= 40; frame++) {
                    var zValue = originalPositionZ - (Math.sin(frame * Math.PI / 80) * bounceDistanceZ);
                    var yValue = originalPositionY + (Math.sin(frame * Math.PI / 40) * bounceHeightY); // Sine wave for smooth up and down motion
                    keysZ.push({ frame: frame, value: zValue });
                    keysY.push({ frame: frame, value: yValue });
                }

                // Set the final position at z = 0 and y returning to original
                keysZ.push({ frame: 40, value: actorPositionZ });
                keysY.push({ frame: 40, value: actorPositionY });

                // Create the animation for z-axis
                var animationZ = new BABYLON.Animation(
                    "bounceToActorZ",
                    "position.z",
                    40,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                // Create the animation for y-axis
                var animationY = new BABYLON.Animation(
                    "bounceToActorY",
                    "position.y",
                    40,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                animationZ.setKeys(keysZ);
                animationY.setKeys(keysY);

                pineappleMesh.animations = [animationZ, animationY]; // Set the new animations
                scene.beginAnimation(pineappleMesh, 0, 40, false); // Start animation with no looping

                // Make the pineapple disappear after the animation
                // Observable to detect when the frame 40 is reached
                var observer = scene.onBeforeRenderObservable.add(() => {
                    if (scene.getAnimationRatio() * 40 >= 40) {
                        //change pineapple in another mesh


                        scene.onBeforeRenderObservable.remove(observer); // Remove observer to avoid repeated execution
                        pineappleMesh.dispose(); // Remove the mesh from the scene
                        console.log("Pineapple mesh has been removed from the scene.");
                    }
                });
            }
        });




    }



    var pineappleLight = new BABYLON.PointLight("pineappleLight", pineappleResult.meshes[0].getAbsolutePosition().add(new BABYLON.Vector3(0, 4, 0)), scene);
    pineappleLight.diffuse = new BABYLON.Color3(1, 1, 1); // Set light color
    pineappleLight.intensity = 1; // Set light intensity
    //🍍


    // Initializes an ArcRotateCamera named "camera1" in the scene.
    // This camera is positioned to rotate around a target point defined by the vector (0, 0, -1).
    // The 'alpha' parameter, set as Math.PI / -2, positions the camera at -90 degrees on the XZ plane,
    // effectively placing it on the negative X-axis and facing towards the origin.
    // The 'beta' parameter of 1 radian tilts the camera slightly downward from the vertical top view.
    // The 'radius' parameter of 3 units sets the distance from the camera to the target point, placing it 3 units away.


    // This setup provides a unique side and slightly elevated view of the scene centered around the target point on the negative Z-axis.



    camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / -2, 1, 3, new BABYLON.Vector3(0, 0, -2), scene);
    camera.attachControl(canvas, true);
    camera.target = sphere;

    camera.wheelPrecision = 50; //Mouse wheel speed




    // Display axis of the sphere
    localAxes(5, sphere, scene);

    //  myAnimationGroup = new BABYLON.AnimationGroup("My New Animation Group");
    // console.log(myAnimationGroup.start(true))

    return [scene, engine, result];
};


//Local Axes
function localAxes(size, mesh, scene) {
    var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);

    pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);

    var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);

    var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", { size: 1 }, scene);
    local_origin.isVisible = false;

    pilot_local_axisX.parent = mesh;
    pilot_local_axisY.parent = mesh;
    pilot_local_axisZ.parent = mesh;
}


function generateKey(frame, value) {
    return {
        frame: frame,
        value: value
    };
}