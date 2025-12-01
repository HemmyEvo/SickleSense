from app import create_app
from app.services.ml_service import MLService

app = create_app()

with app.app_context():
    print("🧪 Testing ML Model Integration...")
    
    # Test model loading
    MLService.load_models()
    
    if MLService._models_loaded:
        print("✅ ML Models loaded successfully!")
        print(f"✅ Classifier: {MLService._classifier}")
        print(f"✅ Regressor: {MLService._regressor}")
    else:
        print("❌ Failed to load ML models")
        exit(1)
    
    # Test with sample data
    sample_features = {
        'age': 25,
        'gender': 1,
        'general_feeling': 4,
        'has_joint_pain': 1,
        'has_chest_pain': 0,
        'has_headache': 1,
        'has_fatigue': 1,
        'temperature_feeling': 1,
        'exposed_to_cold': 1,
        'stress_level': 2,
        'physical_activity': 1,
        'haemoglobin_level': 10.5,
        'oxygen_saturation': 95.0,
        'previously_admitted': 0
    }
    
    print("\n🧪 Testing prediction with sample data...")
    prediction = MLService.get_prediction(sample_features)
    print("✅ Prediction Result:")
    for key, value in prediction.items():
        print(f"   {key}: {value}")