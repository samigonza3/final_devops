from flask import request, jsonify
from dbmodels import db, Client
from routes.app import app

# Funcion ver todos los clientes
@app.route ("/clients",methods=['GET'])
def Clients():
    return jsonify ([
        a_client.serialize() for a_client in Client.query.all()

    ])

#Funcion para ver solo un cliente
@app.route("/clients/<int:client_id>", methods=['GET'])
def get_client(client_id):
    a_client = Client.query.get_or_404(client_id)
    return jsonify(a_client.serialize())

# Funcion para crear cliente
@app.route ("/clients",methods=['POST'])
def new_client():
    data = request.json
    try:
        a_client = Client(
            data['name'],
            data['email'],
            data['address']
        )
        db.session.add(a_client)
        db.session.commit()
        return jsonify({"message": "success", "id":a_client.id}),200
    except Exception as ex:
        return 400, {
            "message": "No saved",
            'error': str(ex)
        }  

# funcion para actualizar cliente
@app.route("/clients/<int:client_id>", methods=['PUT'])
def update_client(client_id):
    data = request.json
    try:
        client = Client.query.get(client_id)

        if client is None:
            return jsonify({"message": "Client not found"}), 404
        
        if 'name' in data:
            client.client_name = data['name']
        if 'description' in data:
            client.client_email = data['email']
        if 'price' in data:
            client.client_address = data['address']

        db.session.commit()

        return jsonify({"message": "client updated successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Update failed",
            'error': str(ex)
        }), 400

#Funcion para eliminar cliente
@app.route("/clients/<int:client_id>", methods=['DELETE'])
def delete_client(client_id):
    try:
        client = Client.query.get(client_id)

        if client is None:
            return jsonify({"message": "client not found"}), 404

        db.session.delete(client)
        db.session.commit()

        return jsonify({"message": "Client deleted successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400
