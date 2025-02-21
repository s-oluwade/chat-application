from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, join_room, emit
from models import Message, User
import os

# Conditionally load dotenv only in development
if os.getenv("ENV") == "development":
    from dotenv import load_dotenv
    load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize the database
db.init_app(app)

# Routes for Registration, Login, and Chat
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for("login"))
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=username)
            session["username"] = username
            return redirect(url_for("chat"))
        else:
            return render_template("login.html", message="Invalid credentials.")
    return render_template("login.html")

@app.route("/chat")
@jwt_required()
def chat():
    username = get_jwt_identity()
    return render_template("chat.html", username=username)

@app.route("/chat_history")
@jwt_required()
def chat_history():
    messages = Message.query.order_by(Message.timestamp).all()
    return jsonify([{"username": msg.username, "content": msg.content, "timestamp": msg.timestamp} for msg in messages])

@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login"))

@socketio.on("send_message")
def handle_send_message(data):
    username = get_jwt_identity()  # Get the current user's username (if JWT is used)
    message_content = data["message"]

    # Save the message to the database
    message = Message(username=username, content=message_content)
    db.session.add(message)
    db.session.commit()

    # Broadcast the message to all connected clients
    emit("message", {"username": username, "message": message_content}, broadcast=True)

@socketio.on('join_room')
def handle_join_room(data):
    join_room(data['user_id'])
