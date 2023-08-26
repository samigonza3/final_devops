from flask import request, jsonify
from routes.app import app
from dbmodels import db, User

import jwt
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorate(*args, **kwargs):
        token = None
        if 'jwt-token' in request.headers:
            token = request.headers['jwt-token']
        
        if not(token):
            return jsonify({
                "message": "token is missing!"
            }), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(
                slug = data['slug']
            ).first()
        except Exception as e:
            return jsonify({
                "message": "token is invalid"
            }), 403
        
        return f(current_user, *args, **kwargs)
    return decorate

# Funcion ver todos los productos
@app.route ("/users",methods=['GET'])
@token_required
def users():
    return jsonify ([
        a_user.serialize() for a_user in User.query.all()
    ])