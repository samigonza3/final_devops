from flask import request, jsonify
from dbmodels import db, Product, Order, Client, Deliveries, DetailOrder
from routes.app import app


# Funcion ver todas las ordenes
@app.route ("/orders",methods=['GET'])
def Orders():
    return jsonify ([
        a_order.serialize() for a_order in Order.query.all()

    ])

#Funcion para ver una sola orden
@app.route("/orders/<int:order_id>", methods=['GET'])
def get_order(order_id):
    a_order = Order.query.get_or_404(order_id)
    return jsonify(a_order.serialize())

# Funcion para crear orden
@app.route ("/orders",methods=['POST'])
def new_order():
    data = request.json

    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['client_id', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
        
    try:
        client = db.session.query(Client).filter_by(id=data['client_id']).first()

        if client is None:
            return jsonify({"message": "client does not exist"}), 404
        
        a_order = Order(
            #order_date=data['date'],
            data['client_id'],
            data['status']
        )

        db.session.add(a_order)
        db.session.commit()

        return jsonify({"message": "Order created successfully"}),201
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400

# funcion para actualizar orden
@app.route("/orders/<int:order_id>", methods=['PUT'])
def update_order(order_id):
    data = request.json
    try:
        order = Orders.query.get(order_id)

        if order is None:
            return jsonify({"message": "Order not found"}), 404
        
        if 'date' in data:
            order.order_date = data['date']
        if 'client_id' in data:
            order.client_id = data['client_id']
        if 'status' in data:
            order.order_status = data['status']

        db.session.commit()

        return jsonify({"message": "order updated successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Update failed",
            'error': str(ex)
        }), 400

#Funcion para inactivar orden
@app.route("/orders/<int:order_id>", methods=['DELETE'])
def disable_order(order_id):
    try:
        order = Order.query.get(order_id)

        if order is None:
            return jsonify({"message": "order not found"}), 404

        order.order_status = 0
        db.session.commit()

        return jsonify({"message": "Disable order successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400

# Funcion ver todas los envios
@app.route ("/deliveries",methods=['GET'])
def get_Deliveries():
    return jsonify ([
        a_delivery.serialize() for a_delivery in Deliveries.query.all()
    ])

#Funcion para ver un solo envio por id_envio
@app.route("/deliveries/<int:delivery_id>", methods=['GET'])
def get_delivery(delivery_id):
    a_delivery = Deliveries.query.get_or_404(delivery_id)
    return jsonify(a_delivery.serialize())

# Funcion para crear envio
@app.route ("/deliveries",methods=['POST'])
def new_deliveries():
    data = request.json

    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['address', 'status', 'order_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
        
    try:
        order = db.session.query(Order).filter_by(id=data['order_id']).first()

        if order is None:
            return jsonify({"message": "order does not exist"}), 404
        
        a_delivery = Deliveries(
            #order_date=data['date'],
            data['address'],
            data['status'],
            data['order_id']
        )

        db.session.add(a_delivery)
        db.session.commit()

        return jsonify({"message": "Delivery created successfully"}),201
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400
    
#Funcion para cambiar estado de envio
@app.route("/deliveries/<int:delivery_id>", methods=['DELETE'])
def update_delivery(delivery_id):
    data = request.json

    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['status']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
        

    try:
        delivery = Deliveries.query.get(delivery_id)

        if delivery is None:
            return jsonify({"message": "delivery not found"}), 404

        delivery.delivery_status = data['status']
        db.session.commit()

        return jsonify({"message": "Delivery update successfully"}), 200
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400    

# Funcion ver todos los detalles de ordenes
@app.route ("/detailorders",methods=['GET'])
def get_DetailOrders():
    return jsonify ([
        a_detailorder.serialize() for a_detailorder in DetailOrder.query.all()
    ])

#Funcion para ver detalle de order por id_detailorder
@app.route("/detailorders/<int:detailorder_id>", methods=['GET'])
def get_detailOrders(detailorder_id):
    a_detailorder = DetailOrder.query.get_or_404(detailorder_id)
    return jsonify(a_detailorder.serialize())

# Funcion para crear detalle de orden
@app.route ("/detailorders",methods=['POST'])
def new_detailOrder():
    data = request.json

    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['order_id', 'product_id', 'count']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
        
    try:
        # Verificar si existe la orden y el producto
        order = Order.query.get(data['order_id'])
        product = Product.query.get(data['product_id'])

        if not order or not product:
            return jsonify({'error': 'Order or product not found'}), 404

        detailorder_count = data['count']

        # Obtener el precio unitario del producto
        detailorder_price_uni = product.product_price 

        existing_detail_order = DetailOrder.query.filter_by(order_id=data['order_id'], product_id=data['product_id']).first()

        # Si el detalle de orden ya existe, actualizarlo
        if existing_detail_order:

            countCurrent = existing_detail_order.detailorder_count
            countBefore =  detailorder_count - countCurrent 

            print("Cantidad actual:")
            print(existing_detail_order.detailorder_count)
            print(countBefore)

            if product.availability >= countBefore:

                existing_detail_order.detailorder_count = detailorder_count
                existing_detail_order.detailorder_price_uni = detailorder_price_uni 
                existing_detail_order.detailorder_price_total = detailorder_count * detailorder_price_uni

                # Resta cantidad disponible de producto
                product.availability = product.availability - countBefore

                db.session.commit()
                return jsonify({"message": "Order detail update successfully"}),201  
            else:
                return jsonify({"message": "Product not available in sufficient quantity for udpate"}),201  
            
        else:
            if product.availability < detailorder_count:
                return jsonify({'error': 'Product not available in sufficient quantity'}), 400

            a_detailorder = DetailOrder(
                data['order_id'],
                data['product_id'],
                count=detailorder_count,
                price_uni=detailorder_price_uni,
                price_total=detailorder_count * detailorder_price_uni
                )

            # Resta cantidad disponible de producto
            product.availability = product.availability - detailorder_count
            
            db.session.add(a_detailorder)

            db.session.commit()
            return jsonify({"message": "Order detail created successfully"}),201
    
    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400

# Funcion para borrar producto  de orden
@app.route ("/detailorders",methods=['DELETE'])
def removeProductId_detailOrder():
    data = request.json

    # Verificar si todos los campos requeridos están presentes en la solicitud
    required_fields = ['order_id', 'product_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400
        
    try:
        existing_detail_order = DetailOrder.query.filter_by(order_id=data['order_id'], product_id=data['product_id']).first()

        # Verifica que el producto y la orden exista
        if existing_detail_order:

            product = Product.query.get(data['product_id'])
            countCurrent = existing_detail_order.detailorder_count

            #Retorna cantidad de inventario del producto borrado
            product.availability = product.availability + countCurrent
            db.session.commit()

            #Elimina el registro de la orden
            db.session.delete(existing_detail_order)
            db.session.commit()

            return jsonify({"message": "Product removed from order successfully"}), 200
        
        else:

            return jsonify({"message": "Product could not be removed from the order"}), 400

    except Exception as ex:
        return jsonify({
            "message": "Deletion failed",
            'error': str(ex)
        }), 400
