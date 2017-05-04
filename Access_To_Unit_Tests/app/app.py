# import flask
from flask import Flask, render_template, request
from pprint import pprint
# initilize flask
app = Flask(__name__)


# setup the route
@app.route('/')
def index():
    return "Hello World!"

@app.route('/hi', methods=['GET'])
def greeter():
    result = ''
    if request.method == 'GET':
        query = request.args.get('query')
        hidden = request.args.get('hidden')
        nx = request.args.get('nx')
        if query is not None:
            result += '<div id="id_echo">'+query+'</div>';
        if hidden is not None:
            result += '<div id="id_hidden">'+hidden+'</div>';
    return render_template('index.html',query=query,nx=nx,hidden=hidden)

# run the server
if __name__ == '__main__':
    app.run(host='127.0.0.1',port=7070,debug=True)

# boom!