from flask_admin import Admin
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db: SQLAlchemy = SQLAlchemy(model_class=Base)
migrate: Migrate = Migrate()
cors: CORS = CORS()
login_manager: LoginManager = LoginManager()
admin: Admin = Admin(name="Soyuz Corp Admin", url="/admin")
