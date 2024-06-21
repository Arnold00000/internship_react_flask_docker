from flask import Blueprint, request, jsonify, current_app
from .models import db, User, Data
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

main = Blueprint("main", __name__)


@main.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = generate_password_hash(data["password"], method="sha256")

    new_user = User(username=username, email=email, password_hash=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"message": "Login failed!"}), 401

    access_token = create_access_token(
        identity={"id": user.id, "username": user.username}
    )
    return jsonify(access_token=access_token), 200


@main.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    user_id = get_jwt_identity()["id"]
    data = request.get_json()
    tac = data["tac"]

    reportingBodyId = int(tac[:2])
    manufacturerModelId = int(tac[2:])
    features = [[reportingBodyId, manufacturerModelId]]

    prediction = current_app.model.predict(features)[0]

    new_data = Data(user_id=user_id, tac=tac)
    db.session.add(new_data)
    db.session.commit()

    return jsonify({"tac": tac, "prediction": prediction}), 201


@main.route("/data", methods=["GET"])
@jwt_required()
def get_data():
    user_id = get_jwt_identity()["id"]
    data = Data.query.filter_by(user_id=user_id).all()

    return jsonify([{"tac": d.tac, "created_at": d.created_at} for d in data]), 200
