![CI status](https://github.com/github/docs/actions/workflows/main.yml/badge.svg)

# LoadingAnimation Implementation

## Overview
The `loadinganimation` implementation provides a comprehensive set of tools for managing and manipulating 3D animations. These animations are recorded through the 3D-LEX pipeline and converted to GLB format using npm before being uploaded to SignCollect. This implementation enables a variety of animation-related functionalities and offers a seamless experience for viewing and interacting with 3D animations.

## Features
- **Display Animations**: Includes support for blendshapes/morphs.
- **View Control**: Rotate around the avatar mesh to view from different angles.
- **Scriptable Viewing Angles**: Change viewing angles programmatically.
- **Web Fetching**: Fetch animations from the web.
- **Retargeting**: Basic retargeting capabilities (current implementation is too crude for most purposes).
- **Sequence Loading**: Load animations in sequence.
- **Blending**: Blend between sequenced animations.
- **Screen Recording**: Automatically screen record after each animation and save locally, facilitating the conversion of 3D animations into 2D screen recordings for MediaPipe.
- **Noise Generation**: Generate various types of noise over the recordings for enhanced data generation.

## Avatars
The repository currently supplies two avatars. This may change in the future as retargeting support evolves.

## Usage
- **Live Demo**: View the page on our server at [this link](https://leffe.science.uva.nl:8043/jari/BabylonSignLab/LoadingAnimation/main.html).
- **Local Setup**: To run the implementation locally, download the repository. Before accessing `main.html`, ensure to run the `fileServer.py` script provided in the repository.

  ```sh
  python fileServer.py
  ```
### URL Parameters
The implementation supports various URL parameters to customize the behavior of the application. Below is a list of supported parameters:

```javascript
var glos = urlParams.get("glos"); // glos=AAP
var thema = urlParams.get("thema"); // thema=oline
var cameraAngle = urlParams.get("cameraAngle"); // cameraAngle=270
var cameraAngleBeta = urlParams.get("cameraAngleBeta"); // cameraAngle=270
var movingCamera = urlParams.get("movingCamera"); // movingCamera=1, if you want the camera to keep moving
var boneLock = urlParams.get("boneLock"); // boneLock=4, 0 == hip, 4 == neck, etc.
var play = urlParams.get("play"); // play=no, if you don't want to play the animation
var zin = urlParams.get("zin"); // zin=IK,BEN,AAP
var limit = urlParams.get("limit"); // limit=50, if you want to limit the number of animations
var gltf = urlParams.get("gltf"); // gltf=1, if you want to load animations with gltf extension
var local = urlParams.get("local"); // local=1, if you want to load animations from a local folder
var blending = urlParams.get("blending"); // blending=1, if you want to blend animations
var debug = urlParams.get("debug"); // debug=1, if you want to see the debug terminal
var lockRot = urlParams.get("lockRot"); // lockRot=1, if you want to lock the animation hips to not rotate (useful when you want the animation to always be centered)
```
