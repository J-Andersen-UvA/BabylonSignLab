var last_path = null;

// Function to fetch the latest path from the server
function fetchLatestPath() {
    fetch('http://localhost:5001/get_path')
        .then(response => response.json())
        .then(data => {
            if (data == null) {
                console.log("No new animation path received.");
            }
            else if (data.path) {
                if (data.path === last_path && !data.path.includes("reload")) {
                    console.log("No new animation path received.");
                }
                else {
                    console.log("Received new animation path: " + data.path);

                    if (data.path.includes("reload")) {
                        // Load the new animation by stripping the file from the path
                        var file = last_path.path.split("\\").at(-1);
                        console.log("Reloading the animation.");
                        stopLoadAndPlayAnimation("http://127.0.0.1:5000/glb/" + file, true);
                        return;
                    }

                    // Load the new animation by stripping the file from the path
                    var file = data.path.split("\\").at(-1);
                    console.log("Loading file: " + file);
                    stopLoadAndPlayAnimation("http://127.0.0.1:5000/glb/" + file, true, true);
                    last_path = data.path;
                }
            }
        })
        .catch(error => console.error("Error fetching latest path:", error));
}
