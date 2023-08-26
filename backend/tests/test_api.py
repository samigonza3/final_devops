

from routes.app import app  
import json

def test_ping_route():
    response = app.test_client().get("/ping")
    assert response.status_code == 200
    response = json.loads(response.data)
    print(response)
    assert response["message"] == "pong"


# def test_product():
#     response = app.test_client().post("/product",{

#     })
#     assert response.status_code == 200
