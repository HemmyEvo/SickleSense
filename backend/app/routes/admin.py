from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.user import User
from app.models.health_log import HealthLog
from app.models.prediction import Prediction
from app.utils.admin_required import admin_required  # Import the decorator

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/test', methods=['GET'])
def test():
    return jsonify({
        "status": "OK", 
        "message": "Sickle Cell API is working!",
        "version": "1.0"
    }), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required  # Add this decorator
def get_all_users():
    try:
        users = User.query.all()
        return jsonify({
            "users": [user.to_dict() for user in users],
            "count": len(users)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/health-logs', methods=['GET'])
@jwt_required()
@admin_required  # Add this decorator
def get_all_health_logs():
    try:
        logs = HealthLog.query.all()
        return jsonify({
            "logs": [log.to_dict() for log in logs],
            "count": len(logs)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/predictions', methods=['GET'])
@jwt_required()
@admin_required  # Add this decorator
def get_all_predictions():
    try:
        predictions = Prediction.query.all()
        return jsonify({
            "predictions": [pred.to_dict() for pred in predictions],
            "count": len(predictions)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500