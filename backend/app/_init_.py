from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import joblib
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    jwt.init_app(app)

    from app.routes import main as main_blueprint

    app.register_blueprint(main_blueprint)

    # Load model and dataset
    app.model = joblib.load(os.path.join(app.root_path, "tac_predictor_model.pkl"))
    app.device_data = load_device_data(
        os.path.join(app.root_path, "DeviceDatabase_first_500.jsonl")
    )

    return app


def load_device_data(file_path):
    import json

    data = []
    with open(file_path, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data
