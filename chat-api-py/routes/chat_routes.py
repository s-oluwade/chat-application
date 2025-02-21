from flask import Blueprint, jsonify
from models import Message
from flask_jwt_extended import jwt_required, get_jwt_identity

chat_routes = Blueprint('chat_routes', __name__)

@chat_routes.route('/history/<int:receiver_id>', methods=['GET'])
@jwt_required()
def chat_history(receiver_id):
    user_id = get_jwt_identity()
    messages = Message.query.filter(
        ((Message.sender_id == user_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == user_id))
    ).order_by(Message.timestamp).all()
    return jsonify([{
        'sender_id': msg.sender_id,
        'content': msg.content,
        'timestamp': msg.timestamp
    } for msg in messages])
