

from routes.app import app  
import json

def test_all_product():
    response = app.test_client().get("/products/1")
    assert response.status_code == 404
