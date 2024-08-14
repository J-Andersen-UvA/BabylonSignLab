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

        # Check if the WebSocket connection is open
        if ws.sock and ws.sock.connected:
            # Send the message
            ws.send(f"{message_type}:{message_content}")
            print(f"Sent message: {message_type}:{message_content}")
        else:
            raise websocket.WebSocketException("WebSocket connection is not open")

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
        finally:
            # Make sure the connection is closed
            if ws.sock and ws.sock.connected:
                ws.close()
                print("WebSocket connection closed")

        return jsonify({'status': 'success', 'response': response[-1]})

    except websocket.WebSocketException as e:
        print(f"WebSocket error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

    except Exception as e:
        print(f"General error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
