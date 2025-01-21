"""
File: flaskLocalServer.py

Description: This file contains the code for a Flask server that serves a simple HTML page and acts as a proxy for a WebSocket server.
In addition to simply serving the local files, the server listens for POST requests to the /proxy_retarget endpoint, which forwards the
message to the WebSocket server and returns the response (a location of the retargeted file) to the client. Lastly, the server listens
for new animation paths from another WebSocket server. On receiving a new path, the server sends a message to the client to update the
animation live.
"""

from flask import Flask, send_from_directory, request, jsonify, abort, make_response
from flask_cors import CORS  # Import the CORS package
import websocket
import os

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

latest_path = None
new_path = False
EXTERNAL_DIRECTORY = 'D:/RecordingsUE/glb/'
BASE_DIRECTORY = '.'  # The base directory for internal files
latest_frame = 0
max_frame = 0
globPercentage = 0
usingPercentage = False

@app.route('/')
def serve_html():
    return send_from_directory(BASE_DIRECTORY, 'main.html')

@app.route('/glb/<path:filename>')  # Handle files in external directory
def serve_glb_files(filename):
    # Normalize the filename to avoid directory traversal issues
    safe_filename = os.path.normpath(filename).lstrip('/\\')

    # Construct the path to the external file
    external_path = os.path.join(EXTERNAL_DIRECTORY, safe_filename)
    print(f"Checking for file in external directory: {external_path}")


    # Check if the file exists in the external directory
    if os.path.isfile(external_path):
        print(f"Sending file from external directory: {safe_filename}")
        response = send_from_directory(EXTERNAL_DIRECTORY, safe_filename)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    abort(404)

@app.route('/icons/<path:filename>')  # Specific route for icons if needed
def serve_icons(filename):
    # Normalize the filename to avoid directory traversal issues
    safe_filename = os.path.normpath(filename).lstrip('/\\')

    # Check if the file exists in the base directory or its subdirectories
    base_path = os.path.join(BASE_DIRECTORY, 'icons', safe_filename)
    if os.path.isfile(base_path):
        print(f"Sending file from icons subdirectory: {safe_filename}")
        response = make_response(send_from_directory(os.path.join(BASE_DIRECTORY, 'icons'), safe_filename))
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    # If file is not found in the base directory or icons subdirectory
    abort(404)

@app.route('/MeshesAndAnims/<path:filename>')  # Specific route for MeshesAndAnims if needed
def serve_meshes_and_anims(filename):
    # Normalize the filename to avoid directory traversal issues
    safe_filename = os.path.normpath(filename).lstrip('/\\')

    # Check if the file exists in the base directory or its subdirectories
    base_path = os.path.join(BASE_DIRECTORY, 'MeshesAndAnims', safe_filename)
    if os.path.isfile(base_path):
        print(f"Sending file from MeshesAndAnims subdirectory: {safe_filename}")
        response = make_response(send_from_directory(os.path.join(BASE_DIRECTORY, 'MeshesAndAnims'), safe_filename))
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    # If file is not found in the base directory or MeshesAndAnims subdirectory
    abort(404)

@app.route('/<path:filename>')  # Handle files in base directory, including subdirectories
def serve_base_files(filename):
    # Normalize the filename to avoid directory traversal issues
    safe_filename = os.path.normpath(filename).lstrip('/\\')

    # Check if the file exists in the base directory or its subdirectories
    base_path = os.path.join(BASE_DIRECTORY, safe_filename)
    if os.path.isfile(base_path):
        print(f"Sending file from base directory: {safe_filename}")
        response = make_response(send_from_directory(BASE_DIRECTORY, safe_filename))
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    # If file is not found in the base directory
    abort(404)

@app.route('/proxy_retarget', methods=['POST'])
def proxy_retarget():
    try:
        data = request.json
        message_type = data.get('messageType')
        message_content = data.get('messageContent')
        
        # Construct the WebSocket request URL
        ws_url = f"ws://retarget_server:8069"

        # Create WebSocket connection
        ws = websocket.WebSocket()
        ws.connect(ws_url)

        # Send the message
        ws.send(f"{message_type}:{message_content}")
        print(f"Sent message: {message_type}:{message_content}")

        response = []

        # Listen for messages from the server until the connection is closed
        try:
            while True:
                result = ws.recv()  # This will block until a message is received
                if result:
                    print(f"Received: {result}")
                    response.append(result)
        except websocket.WebSocketConnectionClosedException:
            print("WebSocket connection was closed by the server.")
        except websocket.WebSocketTimeoutException:
            print("WebSocket connection timed out.")
        finally:
            # Close the WebSocket connection
            ws.close()
            print("WebSocket connection closed")

        return jsonify({'status': 'success', 'response': response[-1]})

    except websocket.WebSocketException as e:
        print(f"WebSocket error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

    except Exception as e:
        print(f"General error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/send-path', methods=['POST'])
def receive_path():
    global new_path
    new_path = True
    global latest_path
    data = request.json
    latest_path = data.get('path')
    return "Path received", 200

@app.route('/get-latest-path', methods=['GET'])
def get_latest_path():
    global new_path
    global latest_path
    if new_path:
        new_path = False
        return jsonify({'path': latest_path}), 200
    return jsonify({'path': None}), 200

@app.route('/get-latest-frame', methods=['GET'])
def get_latest_frame():
    global latest_frame
    global globPercentage
    global usingPercentage

    if usingPercentage:
        return jsonify({'frame': None, 'percentage': globPercentage, 'usingPercentage': usingPercentage}), 200

    return jsonify({'frame': latest_frame, 'percentage': globPercentage, 'usingPercentage': usingPercentage}), 200

@app.route('/send-frame', methods=['POST'])
def send_frame():
    """
    Endpoint to receive the current frame from an external source.
    Can also receive a percentage to use instead of a frame number.
    """
    global latest_frame
    global usingPercentage
    global globPercentage

    data = request.json

    # Extract the frame from the request
    frame = data.get('frame')
    if frame is None:
        percentage = data.get('percentage')
        if percentage is None:
            return jsonify({"status": "error", "message": "No frame or percentage provided"}), 400

    if percentage is not None:
        usingPercentage = True
        globPercentage = percentage
        return jsonify({"status": "success", "message": f"Percentage {percentage} received"}), 200
    else:
        usingPercentage = False
        latest_frame = f"frame:{frame}"
        return jsonify({"status": "success", "message": f"Frame {frame} received"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
