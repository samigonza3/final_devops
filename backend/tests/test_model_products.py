
from routes.app import app  
from dbmodels import db, Product  

def test_createdb():
    with app.app_context():
        db.create_all()

def test_add_product():
    a_product= Product(
        name="Ariel x lbs",
        description="Ariel x lbs",
        price=5892,
        availability=100
    )
    assert a_product.product_name == "Ariel x lbs"
    assert a_product.availability == 100
    with app.app_context():
        db.create_all()
        db.session.add(a_product)
        db.session.commit()

# def test_product():
#     response = app.test_client().post("/product",{

#     })
#     assert response.status_code == 200
