from routes.app import app
from routes.products import *
from routes.clients import *
from routes.orders import *
from routes.users import *

with app.app_context():
    db.create_all()
    
# print(app.url_map)
app.run(host="0.0.0.0", debug=True, port=9030)
