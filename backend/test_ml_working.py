from app import create_app
from app.services.ml_service import MLService

def test_ml_integration():
    app = create_app()
    
    with app.app_context():
        print("🧪 Testing ML Model Integration...")
        
        # Load models first
        MLService.load_models()
        
        if MLService._models_loaded:
            print("✅ ML Models loaded successfully!")
        else:
            print("❌ Failed to load ML models")
            return
        
        # Test with correct features
        test_features = {
            'age': 25,
            'gender': 'Male',
            'hemoglobin': 11.2,
            'oxygen_saturation': 96.5,
            'admitted': 'No',
            'weather': 'Cold',
            'general_feeling': 'in_pain'
        }
        
        print("\n🔧 Features being sent to ML model:")
        for key, value in test_features.items():
            print(f"   {key}: {value}")
        
        print("\n🎯 Getting prediction...")
        
        # Call the class method correctly
        prediction = MLService.get_prediction(test_features)
        
        print("\n✅ FINAL PREDICTION RESULTS:")
        print("=" * 40)
        for key, value in prediction.items():
            print(f"   {key}: {value}")
        print("=" * 40)
        
        # Test different scenarios
        print("\n🧪 Testing different scenarios...")
        
        scenarios = [
            {
                'name': 'High Risk Scenario',
                'features': {
                    'age': 30, 'gender': 'Female', 'hemoglobin': 8.5, 
                    'oxygen_saturation': 88.0, 'admitted': 'Yes', 'weather': 'Cold'
                }
            },
            {
                'name': 'Low Risk Scenario', 
                'features': {
                    'age': 22, 'gender': 'Male', 'hemoglobin': 12.5,
                    'oxygen_saturation': 98.0, 'admitted': 'No', 'weather': 'Moderate'
                }
            }
        ]
        
        for scenario in scenarios:
            print(f"\n📊 {scenario['name']}:")
            pred = MLService.get_prediction(scenario['features'])
            print(f"   Pain Type: {pred['pain_type']}")
            print(f"   Pain Intensity: {pred['pain_intensity']}/10")
            print(f"   Risk Level: {pred['risk_level']}")
            print(f"   Model Used: {pred['model_used']}")

if __name__ == "__main__":
    test_ml_integration()