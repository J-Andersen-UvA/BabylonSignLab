from flask import Flask, send_from_directory, request, jsonify
import websocket

app = Flask(__name__)

@app.route('/')
def serve_html():
    return send_from_directory('.', 'main.html')

@app.route('/<path:filename>')
def serve_static(filename):
    print(f"Serving file: {filename}")
    return send_from_directory('.', filename)

# New endpoint to handle WebSocket proxying
@app.route('/proxy_retarget', methods=['POST'])
def proxy_retarget():
    try:
        data = request.json
        message_type = data.get('messageType')
        message_content = data.get('messageContent')
        
        # Construct the WebSocket request URL
        ws_url = f"ws://retarget_server:8069"

        # Create WebSocket connection
        ws = websocket.create_connection(ws_url)

        # Send the message
        ws.send(f"{message_type}:{message_content}")
        
        # Wait for response
        response = ws.recv()

        # Close the WebSocket connection
        ws.close()

        return jsonify({'status': 'success', 'response': response})
    
    except Exception as e:
        print(f"Error during WebSocket communication: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
