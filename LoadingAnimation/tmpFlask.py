from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/')
def serve_html():
    return send_from_directory('.', 'main.html')

@app.route('/<path:filename>')
def serve_static(filename):
    print(f"Serving file: {filename}")  # Debug line
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
