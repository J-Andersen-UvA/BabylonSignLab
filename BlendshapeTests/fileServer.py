from http.server import SimpleHTTPRequestHandler
from http.server import HTTPServer

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    server_address = ('', 8081)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print('Server running at http://localhost:8081/')
    httpd.serve_forever()
