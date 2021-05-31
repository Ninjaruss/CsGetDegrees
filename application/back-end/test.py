from flask_cors import CORS
from flask import Flask

app = Flask(__name__)
CORS(app) #Prevents CORS errors

@app.route(‘/’)
def index():
    return “Hello, World!”

if __name__ == '__main__':
    from gevent.pywsgi import WSGIServer
    app.debug = True
    http_server = WSGIServer(('', 8000), app)
    http_server.serve_forever()
