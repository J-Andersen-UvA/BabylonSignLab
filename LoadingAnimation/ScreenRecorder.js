let mediaRecorder;
let recordedChunks = [];

async function startRecording(canvasId) {
    // Get canvas ID 
    const canvas = document.getElementById(canvasId);
    const stream = canvas.captureStream(30); // Capture at 30 frames per second

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = onSaveRecording;

    mediaRecorder.start();
    console.log('Recording started');
}

async function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        console.log('Recording stopped');
    }
}

function onSaveRecording() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animation.webm"; // Specify the filename for the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Attach the functions to the window object to make them accessible from other scripts
window.startRecording = startRecording;
window.stopRecording = stopRecording;
