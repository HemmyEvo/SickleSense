import pickle
import pandas as pd
import numpy as np
import logging
import os
import requests  # Import requests to handle downloads
from app.models.user import User

logger = logging.getLogger(__name__)

class MLService:
    _classifier = None
    _regressor = None
    _models_loaded = False
    
    # Define the URLs and filenames
    MODEL_CONFIG = {
        'classifier': {
            'url': 'https://huggingface.co/Hemmyevp/sickle_crisis_prediction/resolve/main/classifier.pkl',
            'filename': 'classifier.pkl'
        },
        'regressor': {
            'url': 'https://huggingface.co/Hemmyevp/sickle_crisis_prediction/resolve/main/regressor.pkl',
            'filename': 'regressor.pkl'
        }
    }

    @classmethod
    def _download_file(cls, url, filepath):
        """Helper to download a file if it doesn't exist"""
        logger.info(f"⬇️ Downloading model from {url}...")
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()  # Raise error for bad status codes
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logger.info(f"✅ Download complete: {filepath}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to download model: {e}")
            return False

    @classmethod
    def load_models(cls):
        """Download (if needed) and load ML models"""
        try:
            # Create a directory to store the downloaded models so we don't download every time
            models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'ml_models')
            os.makedirs(models_dir, exist_ok=True)

            # 1. Handle Classifier
            clf_path = os.path.join(models_dir, cls.MODEL_CONFIG['classifier']['filename'])
            if not os.path.exists(clf_path):
                success = cls._download_file(cls.MODEL_CONFIG['classifier']['url'], clf_path)
                if not success: raise Exception("Could not download classifier")
            
            with open(clf_path, 'rb') as f:
                cls._classifier = pickle.load(f)

            # 2. Handle Regressor
            reg_path = os.path.join(models_dir, cls.MODEL_CONFIG['regressor']['filename'])
            if not os.path.exists(reg_path):
                success = cls._download_file(cls.MODEL_CONFIG['regressor']['url'], reg_path)
                if not success: raise Exception("Could not download regressor")

            with open(reg_path, 'rb') as f:
                cls._regressor = pickle.load(f)

            cls._models_loaded = True
            logger.info("✅ ML models loaded successfully from storage")

        except Exception as e:
            logger.error(f"❌ Error loading ML models: {e}")
            cls._models_loaded = False

    @classmethod
    def prepare_features(cls, health_log, user_id):
        """Transform health log data into features for ML model"""
        user = User.query.get(user_id)

        features = {
            'age': user.age or 25,
            'gender': 'Male' if user.gender == 'male' else 'Female',
            'hemoglobin': 11.2,
            'oxygen_saturation': 96.5,
            'admitted': 'No',
            'weather': cls.map_weather(health_log.temperature_feeling if health_log else 'cold'),
            'general_feeling': health_log.general_feeling if health_log else 'in_pain'
        }

        return features

    @staticmethod
    def map_weather(temperature_feeling):
        """Convert temperature feeling to weather condition"""
        weather_map = {
            'hot': 'Sunny',
            'cold': 'Cold', 
            'normal': 'Moderate'
        }
        return weather_map.get(temperature_feeling, 'Moderate')

    @classmethod
    def get_prediction(cls, features):
        """Get prediction from both ML models"""
        try:
            if not cls._models_loaded:
                cls.load_models()

            if not cls._classifier or not cls._regressor:
                return cls.fallback_prediction(features)

            feature_df = pd.DataFrame([{
                'age': features['age'],
                'gender': features['gender'],
                'hemoglobin': features['hemoglobin'],
                'oxygen_saturation': features['oxygen_saturation'],
                'admitted': features['admitted'],
                'weather': features['weather']
            }])

            print("🔍 Features sent to ML model:")
            print(feature_df)

            pain_type = cls._classifier.predict(feature_df)[0]
            pain_intensity = cls._regressor.predict(feature_df)[0]

            risk_level = cls.calculate_risk_level(pain_intensity, pain_type)

            return {
                'pain_type': str(pain_type),
                'pain_intensity': float(pain_intensity),
                'risk_level': risk_level,
                'risk_score': float(pain_intensity) / 10.0,
                'confidence': 0.85,
                'model_used': 'real_ml_models',
                'features_used': list(feature_df.columns)
            }

        except Exception as e:
            logger.error(f"ML prediction error: {e}")
            return cls.fallback_prediction(features)

    @staticmethod
    def calculate_risk_level(pain_intensity, pain_type):
        """Convert numerical predictions to risk categories"""
        pain_intensity = float(pain_intensity)

        if pain_intensity >= 7 or 'severe' in str(pain_type).lower():
            return 'high'
        elif pain_intensity >= 4:
            return 'medium'
        else:
            return 'low'

    @staticmethod
    def fallback_prediction(features):
        """Fallback when ML models fail"""
        logger.warning("Using fallback prediction")

        risk_score = 0.0

        feeling_map = {'very_okay': 1, 'okay': 2, 'uncomfortable': 3, 'in_pain': 4, 'severe_pain': 5}
        current_feeling = features.get('general_feeling', 'okay')

        if feeling_map.get(current_feeling, 2) >= 4:
            risk_score += 0.4

        if features.get('weather') == 'Cold':
            risk_score += 0.2

        pain_intensity = risk_score * 10

        if risk_score >= 0.7:
            risk_level = 'high'
        elif risk_score >= 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'

        return {
            'pain_type': 'estimated_from_symptoms',
            'pain_intensity': pain_intensity,
            'risk_level': risk_level,
            'risk_score': risk_score,
            'confidence': 0.7,
            'model_used': 'fallback'
        }
