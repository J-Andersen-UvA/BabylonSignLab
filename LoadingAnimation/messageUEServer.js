function sendMessageUE(messageType, messageContent, host = retargetServerHost, port = retargetServerPort) {
    return new Promise((resolve, reject) => {
        // WebSocket connection
        const socket = new WebSocket(`ws://${host}:${port}`);
        var response = null;

        // Connection opened
        socket.addEventListener('open', function (event) {
            console.log('WebSocket connected');
            
            // Create the message string
            const message = `${messageType}:${messageContent}`;
            
            // Send the message
            socket.send(message);
            console.log(`Sent message: ${message}`);
        });

        // Listen for messages from the server
        socket.addEventListener('message', function (event) {
            console.log(`Received: ${event.data}`);
            response = event.data; // Resolve the promise with received data
        });

        // Listen for connection close
        socket.addEventListener('close', function (event) {
            console.log('Connection closed');
            resolve(response);
        });

        // Listen for errors
        socket.addEventListener('error', function (event) {
            console.error('WebSocket error:', event);
            reject(new Error('WebSocket error'));
        });
    });
}
/**
 * Sends a command to import a mesh in Unreal Engine.
 * 
 * @param {string} meshURL - The URL of the mesh to import.
 * @returns {Promise<boolean>} - A promise that resolves to true if the command is successfully sent, or false if there is an error.
 */
function sendCommandUEMesh(meshURL) {
    const meshName = meshURL.split('/').pop().split('.')[0];

    return sendMessageUE('import_fbx_from_url', meshURL)
        .then(meshPath => {
            // Response form "File downloaded successfully path(/usr/src/your_project/imports/ERROR-SC.fbx)." Only the path is needed
            meshPath = meshPath.split(' ').pop().slice(0, -2);
            // Remove path( from the beginning
            meshPath = meshPath.slice(5);
            return sendMessageUE('import_fbx', meshPath);
        })
        .then(meshPathUE => {
            return true;
        })
        .catch(error => {
            console.error("Error in sendCommandUEMeshRig:", error);
            return false;
        });
}

function sendCommandUEAnim(animURL, skeletonPath = null) {
    const animName = animURL.split('/').pop().split('.')[0].replace('.fbx', '');
    UEDestPath = `/Game/ImportedAssets/`;

    return sendMessageUE('import_fbx_from_url', animURL)
        .then(animPath => {
            // Response form "File downloaded successfully path(/usr/src/your_project/imports/ERROR-SC.fbx)." Only the path is needed
            animPath = animPath.split(' ').pop().slice(0, -2);
            // Remove path( from the beginning
            animPath = animPath.slice(5);
            if (skeletonPath) {
                return sendMessageUE('import_fbx_animation', animPath + "," + UEDestPath + "," + animName + "," + skeletonPath);
            }

            return sendMessageUE('import_fbx_animation', animPath + "," + UEDestPath + "," + animName);
        })
        .then(res => {
            return true;
        })
        .catch(error => {
            console.error("Error in sendCommandUEAnim:", error);
            return false;
        });
}

function sendCommandUEAnimRetarget(sourceMeshPath, targetMeshPath, animURL) {
    // first send anim to UE with sendCommandUEAnim
    sendCommandUEAnim(animURL);
    const animPath = `/Game/ImportedAssets/${animURL.split('/').pop().split('.')[0].replace('.fbx', '')}`;

    return sendMessageUE('rig_retarget_send', sourceMeshPath + "," + targetMeshPath + "," + animPath)
        .then(sourceMeshPathUE => {
            return sendMessageUE('import_fbx', targetMeshPath);
        })
        .then(targetMeshPathUE => {
            return sendMessageUE('import_fbx', animPath);
        })
        .then(animPathUE => {
            return sendMessageUE('retarget_animation', `${sourceMeshPath} ${targetMeshPath} ${animPath}`);
        })
        .then(retargetedAnimPath => {
            return true;
        })
        .catch(error => {
            console.error("Error in sendCommandUEAnimRetarget:", error);
            return false;
        });
}

// Example usage
// sendCommandUEMeshRig('http://example.com/mesh.fbx');
