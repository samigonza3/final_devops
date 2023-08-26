
DEBUG=False
SECRET_KEY='5daef7014be6b26e7939'

# import os
# basedir = os.path.abspath(os.path.dirname(__file__))
# SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir,'database.db')

## SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://username:password@localhost:port/db_name'
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres:UgRH5522@tienda_database:5432/postgres'
## SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost:port/db_name'
## SQLALCHEMY_DATABASE_URI = 'oracle+cx_oracle://username:password@localhost:port/db_name'
SQLALCHEMY_TRACK_MODIFICATIONS=True

