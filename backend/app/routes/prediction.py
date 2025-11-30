from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from app import db
from app.models.health_log import HealthLog
from app.models.prediction import Prediction
from app.services.ml_service import MLService
from app.services.recommendation_service import RecommendationService

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/risk/predict', methods=['POST'])
@jwt_required()
def predict_risk():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get or create health log
        health_log = HealthLog.query.filter_by(
            user_id=user_id, 
            log_date=date.today()
        ).first()
        
        if not health_log:
            # Create health log from prediction data
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
        
        # Prepare features for ML model
        features = MLService.prepare_features(health_log, user_id)
        
        # Get prediction from ML service
        ml_prediction = MLService.get_prediction(features)
        
        # Generate recommendations
        recommendations = RecommendationService.generate_recommendations(
            ml_prediction, health_log
        )
        
        # Save prediction
        prediction = Prediction(
            user_id=user_id,
            health_log_id=health_log.id,
            risk_level=ml_prediction['risk_level'],
            risk_score=ml_prediction['risk_score'],
            confidence=ml_prediction.get('confidence'),
            features=features,
            recommendations=recommendations
        )
        
        db.session.add(prediction)
        db.session.commit()
        
        return jsonify({
            'risk_level': prediction.risk_level,
            'risk_score': prediction.risk_score,
            'confidence': prediction.confidence,
            'recommendations': prediction.recommendations,
            'prediction_id': prediction.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/predictions/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 10, type=int)
        
        predictions = Prediction.query.filter_by(
            user_id=user_id
        ).order_by(Prediction.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'predictions': [pred.to_dict() for pred in predictions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/predictions/<int:prediction_id>/feedback', methods=['POST'])
@jwt_required()
def submit_prediction_feedback(prediction_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        prediction = Prediction.query.filter_by(
            id=prediction_id, 
            user_id=user_id
        ).first()
        
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        prediction.accurate_prediction = data.get('accurate')
        prediction.actual_outcome = data.get('actual_outcome')
        
        db.session.commit()
        
        return jsonify({'message': 'Feedback submitted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500