from app import create_app
from app.services.ml_service import MLService

app = create_app()

with app.app_context():
    print("🧪 Testing ML Model with Correct Features...")
    
    # Test with EXACT features the model expects
    correct_features = {
        'age': 25,
        'gender': 'Male',
        'hemoglobin': 11.2,
        'oxygen_saturation': 96.5,
        'admitted': 'No',
        'weather': 'Cold',
        'general_feeling': 'in_pain'
    }
    
    print("🔧 Features being sent to ML model:")
    for key, value in correct_features.items():
        print(f"   {key}: {value}")
    
    print("\n🎯 Getting prediction...")
    prediction = MLService.get_prediction(correct_features)
    
    print("✅ FINAL PREDICTION RESULTS:")
    for key, value in prediction.items():
        print(f"   {key}: {value}")