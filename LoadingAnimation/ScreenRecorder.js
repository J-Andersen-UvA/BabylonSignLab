let mediaRecorder;
let recordedChunks = [];
let recordStartTime;
let skipDuration = 330; // milliseconds to skip, approx 10 frames at 30 fps

async function startRecording(canvasId, animFilename) {
    const canvas = document.getElementById(canvasId);
    const stream = canvas.captureStream(30); // Capture at 30 frames per second

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = function(event) {
        const currentTime = Date.now();
        const elapsed = currentTime - recordStartTime;

        // Skip the first and last 0.33 seconds of recording
        if (elapsed > skipDuration && !mediaRecorder.paused) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        }
    };

    mediaRecorder.onstop = function() {
        onSaveRecording(animFilename); // Pass the animFilename to the onSaveRecording function
    };

    // Delay recording start to skip first 0.33 seconds
    setTimeout(() => {
        mediaRecorder.start();
        console.log('Recording started');
        recordStartTime = Date.now(); // Initialize start time after delay
    }, skipDuration);
}

async function stopRecording() {
    if (mediaRecorder) {
        // Stop recording earlier to skip last 0.33 seconds
        setTimeout(() => {
            mediaRecorder.stop();
            console.log('Recording stopped');
        }, -skipDuration);
    }
}

function onSaveRecording(animFilename) {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const filenameWithoutExtension = animFilename.replace(/\.glb$/, ''); 

    a.download = filenameWithoutExtension + ".webm"; 

    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Attach the functions to the window object to make them accessible from other scripts
window.startRecording = startRecording;
window.stopRecording = stopRecording;
