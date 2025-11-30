from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date, timedelta
from app import db
from app.models.health_log import HealthLog, CrisisEvent
from app.models.user import User, Guardian
from app.services.notification_service import NotificationService

health_bp = Blueprint('health', __name__)

@health_bp.route('/daily-log', methods=['POST'])
@jwt_required()
def create_daily_log():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if log already exists for today
        existing_log = HealthLog.query.filter_by(
            user_id=user_id, 
            log_date=date.today()
        ).first()
        
        if existing_log:
            return jsonify({'error': 'Daily log already exists for today'}), 400
        
        # Create new health log
        health_log = HealthLog(
            user_id=user_id,
            general_feeling=data.get('general_feeling'),
            sleep_quality=data.get('sleep_quality'),
            water_intake=data.get('water_intake'),
            temperature_feeling=data.get('temperature_feeling'),
            symptoms=data.get('symptoms', []),
            medication_taken=data.get('medication_taken'),
            physical_activity=data.get('physical_activity'),
            temperature_exposure=data.get('temperature_exposure'),
            stress_level=data.get('stress_level'),
            notify_guardian=data.get('notify_guardian', False)
        )
        
        db.session.add(health_log)
        db.session.commit()
        
        # Notify guardian if requested
        if health_log.notify_guardian:
            NotificationService.notify_guardians(user_id, health_log)
        
        return jsonify({
            'message': 'Daily log created successfully',
            'log': health_log.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@health_bp.route('/daily-log/today', methods=['GET'])
@jwt_required()
def get_today_log():
    try:
        user_id = get_jwt_identity()
        
        log = HealthLog.query.filter_by(
            user_id=user_id, 
            log_date=date.today()
        ).first()
        
        if not log:
            return jsonify({'message': 'No log found for today'}), 404
        
        return jsonify({'log': log.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/daily-log/history', methods=['GET'])
@jwt_required()
def get_log_history():
    try:
        user_id = get_jwt_identity()
        days = request.args.get('days', 7, type=int)
        
        start_date = datetime.utcnow().date() - timedelta(days=days)
        
        logs = HealthLog.query.filter(
            HealthLog.user_id == user_id,
            HealthLog.log_date >= start_date
        ).order_by(HealthLog.log_date.desc()).all()
        
        return jsonify({
            'logs': [log.to_dict() for log in logs],
            'count': len(logs)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@health_bp.route('/crisis/report', methods=['POST'])
@jwt_required()
def report_crisis():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        crisis = CrisisEvent(
            user_id=user_id,
            pain_level=data.get('pain_level'),
            symptoms=data.get('symptoms', []),
            location=data.get('location'),
            severity=data.get('severity', 'moderate')
        )
        
        db.session.add(crisis)
        db.session.commit()
        
        # Notify guardians immediately
        NotificationService.notify_crisis_alert(user_id, crisis)
        
        return jsonify({
            'message': 'Crisis reported successfully',
            'crisis_id': crisis.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500