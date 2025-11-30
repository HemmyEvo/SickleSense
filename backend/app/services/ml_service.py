import requests
import logging
from app import db
from app.models.user import User
from app.config import Config

logger = logging.getLogger(__name__)

class MLService:
    @staticmethod
    def prepare_features(health_log, user_id):
        """Transform health log data into features for ML model"""
        user = User.query.get(user_id)
        
        # Map categorical data to numerical values
        feeling_map = {
            'very_okay': 1,
            'okay': 2,
            'uncomfortable': 3,
            'in_pain': 4,
            'severe_pain': 5
        }
        
        sleep_map = {'yes': 1, 'little': 2, 'no': 3}
        water_map = {'0-1_cups': 1, '2-3_cups': 2, '4-5_cups': 3, '6+_cups': 4}
        temp_map = {'cold': 1, 'normal': 2, 'hot': 3}
        stress_map = {'not_stressed': 1, 'little_stressed': 2, 'very_stressed': 3}
        activity_map = {'none': 1, 'light': 2, 'moderate': 3, 'heavy': 4}
        medication_map = {'missed': 1, 'not_yet': 2, 'yes': 3}
        
        features = {
            'age': user.age or 25,  # Default age
            'gender': 1 if user.gender == 'male' else 0,  # Binary encoding
            'general_feeling': feeling_map.get(health_log.general_feeling, 3),
            'sleep_quality': sleep_map.get(health_log.sleep_quality, 2),
            'water_intake': water_map.get(health_log.water_intake, 2),
            'temperature_feeling': temp_map.get(health_log.temperature_feeling, 2),
            'has_pain_symptoms': 1 if any(symptom in health_log.symptoms for symptom in ['joint_pains', 'chest_pain', 'back_pain', 'abdominal_pain']) else 0,
            'has_respiratory_symptoms': 1 if any(symptom in health_log.symptoms for symptom in ['shortness_of_breath', 'chest_pain']) else 0,
            'medication_taken': medication_map.get(health_log.medication_taken, 2),
            'physical_activity': activity_map.get(health_log.physical_activity, 2),
            'exposed_to_cold': 1 if health_log.temperature_exposure == 'yes_cold' else 0,
            'exposed_to_heat': 1 if health_log.temperature_exposure == 'yes_heat' else 0,
            'stress_level': stress_map.get(health_log.stress_level, 2),
            'symptom_count': len(health_log.symptoms or [])
        }
        
        return features
    
    @staticmethod
    def get_prediction(features):
        """Get prediction from ML model"""
        try:
            # For demo purposes - replace with actual ML model call
            # response = requests.post(Config.ML_MODEL_URL, json=features, timeout=10)
            # return response.json()
            
            # Mock response - replace this with actual ML model integration
            risk_score = MLService.calculate_mock_risk(features)
            
            if risk_score >= 0.7:
                risk_level = 'high'
            elif risk_score >= 0.4:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            return {
                'risk_level': risk_level,
                'risk_score': risk_score,
                'confidence': 0.85
            }
            
        except Exception as e:
            logger.error(f"ML prediction error: {e}")
            # Fallback to rule-based prediction
            return MLService.fallback_prediction(features)
    
    @staticmethod
    def calculate_mock_risk(features):
        """Simple rule-based risk calculation for demo"""
        risk = 0.0
        
        # Pain symptoms heavily weighted
        if features['general_feeling'] >= 4:
            risk += 0.3
        elif features['general_feeling'] >= 3:
            risk += 0.15
        
        # Respiratory symptoms critical
        if features['has_respiratory_symptoms']:
            risk += 0.25
        
        # Dehydration risk
        if features['water_intake'] <= 1:
            risk += 0.15
        
        # Cold exposure
        if features['exposed_to_cold']:
            risk += 0.1
        
        # Medication missed
        if features['medication_taken'] == 1:  # missed
            risk += 0.1
        
        # High stress
        if features['stress_level'] >= 3:
            risk += 0.1
        
        return min(risk, 1.0)
    
    @staticmethod
    def fallback_prediction(features):
        """Fallback prediction when ML service is unavailable"""
        risk_score = MLService.calculate_mock_risk(features)
        
        if risk_score >= 0.7:
            risk_level = 'high'
        elif risk_score >= 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_level': risk_level,
            'risk_score': risk_score,
            'confidence': 0.7
        }