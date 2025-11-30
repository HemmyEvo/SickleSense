from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import Guardian
from app.services.notification_service import NotificationService

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications/guardians', methods=['POST'])
@jwt_required()
def add_guardian():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        guardian = Guardian(
            user_id=user_id,
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            relationship=data.get('relationship')
        )
        
        db.session.add(guardian)
        db.session.commit()
        
        return jsonify({
            'message': 'Guardian added successfully',
            'guardian': {
                'id': guardian.id,
                'name': guardian.name,
                'phone': guardian.phone,
                'relationship': guardian.relationship
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/notifications/guardians', methods=['GET'])
@jwt_required()
def get_guardians():
    try:
        user_id = get_jwt_identity()
        
        guardians = Guardian.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'guardians': [{
                'id': g.id,
                'name': g.name,
                'email': g.email,
                'phone': g.phone,
                'relationship': g.relationship
            } for g in guardians]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/notifications/test', methods=['POST'])
@jwt_required()
def test_notification():
    try:
        user_id = get_jwt_identity()
        
        # This would send a test notification to all guardians
        success = NotificationService.send_test_notification(user_id)
        
        if success:
            return jsonify({'message': 'Test notification sent'}), 200
        else:
            return jsonify({'error': 'Failed to send notification'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500