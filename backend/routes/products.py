
from flask import request, jsonify
from dbmodels import db, Product
from routes.app import app

# Funcion ver todos los productos
@app.route ("/products",methods=['GET'])
def products():
    return jsonify ([
        a_product.serialize() for a_product in Product.query.all()
    ])

#Funcion para ver solo un producto
@app.route("/products/<int:product_id>", methods=['GET'])
def get_product(product_id):
    a_product = Product.query.get_or_404(product_id)
    return jsonify(a_product.serialize())

# Funcion para crear producto
@app.route ("/products",methods=['POST'])
def new_product():
    data = request.json
    try:
        a_product = Product(
            data['name'],
            data['description'],
            data['price'],
            data['availability']
        )
        db.session.add(a_product)
        db.session.commit()
        return jsonify({"message": "success", "id":a_product.id}),200
    except Exception as ex:
        return 400, {
            "message": "No saved",
            'error': str(ex)
        }  
    
# funcion para actualizar producto
@app.route("/products/<int:product_id>", methods=['PUT'])
def update_product(product_id):
    data = request.json
    try:
        product = Product.query.get(product_id)

        if product is None:
            return jsonify({"message": "Product not found"}), 404
        
        if 'name' in data:
            product.product_name = data['name']
        if 'description' in data:
            product.product_description = data['description']
        if 'price' in data:
            product.product_price = data['price']
        if 'availability' in data:
            product.availability = data['availability']

        db.session.commit()

        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Update failed",
            'error': str(ex)
        }), 400

#Funcion para eliminar producto
@app.route("/products/<int:product_id>", methods=['DELETE'])
def delete_product(product_id):
    
    data = request.json
    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['availability']
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    try:
        product = Product.query.get(product_id)

        if product is None:
            return jsonify({"message": "Product not found"}), 404
        
        product.availability = data['availability']
        db.session.commit()

        return jsonify({"message": "Product update successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400
