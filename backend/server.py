from routes.app import app
from routes.products import *
from routes.clients import *
from routes.orders import *
# print(app.url_map)
app.run(host="0.0.0.0", debug=True, port=9030)
