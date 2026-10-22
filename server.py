import http.server
import mimetypes

mimetypes.add_type("text/javascript", ".js")

server = http.server.ThreadingHTTPServer(
    ("localhost", 8000),
    http.server.SimpleHTTPRequestHandler
)

server.serve_forever()
