from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, redirect, send_from_directory, url_for

from app.admin import setup_admin_views
from app.auth import auth_bp
from app.commands import register_commands
from app.config import AppConfig, load_config
from app.extensions import admin, cors, db, login_manager, migrate
from app.routes import api_bp


def create_app() -> Flask:
    base_path = Path(__file__).resolve().parent.parent
    load_dotenv(base_path / ".env")
    config: AppConfig = load_config(base_path)

    app: Flask = Flask(__name__)
    app.config["SECRET_KEY"] = config.secret_key
    app.config["SQLALCHEMY_DATABASE_URI"] = config.database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = config.max_content_length
    app.config["UPLOAD_FOLDER"] = str(config.upload_folder)

    config.upload_folder.mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": config.frontend_origin}})
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    admin.init_app(app)

    setup_admin_views()
    register_commands(app)

    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)

    @app.get("/")
    def index() -> object:
        return redirect(url_for("admin.index"))

    @app.get("/admin-check")
    def admin_check() -> dict[str, str]:
        return {"adminUrl": "/admin/", "status": "ok"}

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename: str) -> object:
        return send_from_directory(config.upload_folder, filename)

    return app
