
from flask import Flask, request, jsonify
from flask_cors import CORS
from dbmodels import db

app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)
CORS(app)

@app.route ("/ping",methods=['GET'])
def pong():
    return{
        "message":"pong"
    }


# app.add_url_rule('/products', view_func=products)
# app.add_url_rule('/clients', view_func=views.index)
# app.add_url_rule('/orders', view_func=views.index)


