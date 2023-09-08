from flask import request, jsonify
from routes.app import app
from dbmodels import db, User

import jwt
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
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

# Funcion para crear producto
@app.route ("/users",methods=['POST'])
def new_user():
    data = request.json
    try:
        a_user = User(
            name=data['name'],
            email=data['email'],
            slug=str(uuid.uuid4()),
            password=generate_password_hash(data['password'])
        )
        db.session.add(a_user)
        db.session.commit()
        return jsonify({"message": "success", "slug":a_user.slug}),200
    except Exception as ex:
        return jsonify({
            "message": "No saved",
            'error': str(ex)
        }), 400
    
@app.route ("/login",methods=['POST'])
def auth():
    data = request.json
    if not('email' in data) or not('password' in data):
        return jsonify({
            "message": "email or password required",
        }), 400
    
    user = User.query.filter_by(email = data['email']).first()
    if not(user):
        return jsonify({
            "message": "user not found",
        }), 404
    
    if check_password_hash(user.password, data['password']):
        token = jwt.encode({
            'slug':user.slug,
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
        }, app.config['SECRET_KEY'])

        return jsonify({
            "message": "success",
            "token": token
        }), 200
    
    return jsonify({
        "message": "could not verify, wrong password",
    }), 200
    