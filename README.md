![Deploy on Leffe](https://github.com/J-Andersen-UvA/BabylonSignLab/actions/workflows/main.yml/badge.svg)

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
var externalAnim = urlParams.get("externalAnim") // externalAnim="https://leffe.science.uva.nl:8043/gebarenoverleg_media/fbx/appel.glb", if you want to load animations from external source
var noGui = urlParams.get("noGui") // noGui=1, if you don't want to see the GUI
var meshRotation = urlParams.get("meshRotation") // meshRotation=0-360, if you want to rotate the mesh container y-rotation
var onboard = urlParams.get("onboard") // onboard=0 or false, if you dont want to play the onboard animation
var meshURL = urlParams.get("mesh") // mesh=meshURL, for if you want a specific mesh to be loaded
var noExtraButtons = urlParams.get("noExtraButtons") // noExtraButtons=1 or true, for if you want no extra buttons
var receiveFramesOutside = urlParams.get("receiveFramesOutside") // receiveFramesOutside=1 or true, for if you want to receive frames from outside
```

## Flask Local Server for Babylon.js Loading Animations

The `flaskLocalServer.py` script provides a backend service for hosting and managing assets for a Babylon.js-based loading animations project. It serves static files, manages animation updates, and acts as a proxy for communication with a WebSocket server. Below is a detailed description of its features:

### Features

1. **Static File Hosting**:
   - Serves the main HTML file (`main.html`) and other assets such as `.glb` files, icons, and animations.
   - Supports directory-specific routes for better organization:
     - `/glb/<filename>`: Serves `.glb` files from the `D:/RecordingsUE/glb/` directory.
     - `/icons/<filename>`: Serves icons from the `icons/` subdirectory.
     - `/MeshesAndAnims/<filename>`: Serves meshes and animations from the `MeshesAndAnims/` subdirectory.

3. **Animation Path Updates**:
   - The `/send-path` endpoint allows the server to receive a new animation path.
   - The `/get-latest-path` endpoint fetches the latest animation path for the client to update animations dynamically.

4. **Frame and Percentage Updates**:
   - The `/send-frame` endpoint supports sending either a frame number or a percentage value for animation progress updates.
   - The `/get-latest-frame` endpoint retrieves the most recent frame or percentage value, helping the client synchronize animation playback.

### How to Run

1. **Prerequisites**:
   - Python 3 or above.
   - Install the required Python packages:
     ```bash
     pip install flask flask-cors websocket-client
     ```

2. **Start the Server**:
   - Run the `flaskLocalServer.py` script:
     ```bash
     python flaskLocalServer.py
     ```
   - By default, the server runs on `http://0.0.0.0:5000`.

## Updating frames outside of the webapp
The `flaskLocalServer.py` script provides functionality for controlling animation frames from external applications via API endpoints. By combining the script with the URL parameter `receiveFramesOutside`, you can dynamically update the animation frame from outside the web app.

### How It Works
1. Receiving Frames from External Applications:

External applications can send the desired animation frame to the server using the `/send-frame` endpoint.
The endpoint accepts either a specific frame number or a percentage value representing the animation's progress.

2. Web App Integration:

Within the web app, the `receiveFramesOutside` parameter determines whether the animation should use externally provided frame updates.
If receiveFramesOutside is set to true, the web app periodically checks the `/get-latest-frame` endpoint to fetch the latest frame or percentage value provided by the external application.

### Example Workflow
An external application sends a POST request to the `/send-frame` endpoint with a JSON payload:

```json
{
  "frame": 42
}
```
or:

```json
{
  "percentage": 75
}
```
The server updates its internal state with the latest frame or percentage.
The web app polls the `/get-latest-frame` endpoint to retrieve the most recent value and updates the animation accordingly.



