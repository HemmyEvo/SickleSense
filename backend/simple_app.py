from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

# Create app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sickle_cell.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Simple Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'age': self.age
        }

class HealthLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    general_feeling = db.Column(db.String(50), nullable=False)
    sleep_quality = db.Column(db.String(20))
    water_intake = db.Column(db.String(20))
    temperature_feeling = db.Column(db.String(20))
    symptoms = db.Column(db.JSON)
    medication_taken = db.Column(db.String(20))
    physical_activity = db.Column(db.String(20))
    temperature_exposure = db.Column(db.String(20))
    stress_level = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Sickle Cell Backend is running!"})

@app.route('/api/test')
def test():
    return jsonify({"status": "OK", "message": "API is working"})

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if user exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "User already exists"}), 400
    
    user = User(
        email=data.get('email'),
        name=data.get('name', ''),
        age=data.get('age'),
        password_hash="temp_password"  # In real app, hash this
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        "message": "User created successfully",
        "user": user.to_dict()
    }), 201

@app.route('/api/daily-log', methods=['POST'])
def create_daily_log():
    data = request.get_json()
    
    health_log = HealthLog(
        user_id=data.get('user_id', 1),  # Default to user 1 for testing
        general_feeling=data.get('general_feeling'),
        sleep_quality=data.get('sleep_quality'),
        water_intake=data.get('water_intake'),
        temperature_feeling=data.get('temperature_feeling'),
        symptoms=data.get('symptoms', []),
        medication_taken=data.get('medication_taken'),
        physical_activity=data.get('physical_activity'),
        temperature_exposure=data.get('temperature_exposure'),
        stress_level=data.get('stress_level')
    )
    
    db.session.add(health_log)
    db.session.commit()
    
    return jsonify({
        "message": "Daily log created successfully",
        "log_id": health_log.id
    }), 201

@app.route('/api/risk/predict', methods=['POST'])
def predict_risk():
    data = request.get_json()
    
    # Simple risk calculation based on inputs
    risk_score = 0.0
    
    # Pain level increases risk
    feeling_map = {'very_okay': 0.0, 'okay': 0.1, 'uncomfortable': 0.3, 'in_pain': 0.6, 'severe_pain': 0.9}
    risk_score += feeling_map.get(data.get('general_feeling', 'okay'), 0.1)
    
    # Low water intake increases risk
    if data.get('water_intake') in ['0-1_cups', '2-3_cups']:
        risk_score += 0.2
    
    # Cold exposure increases risk
    if data.get('temperature_feeling') == 'cold' or data.get('temperature_exposure') == 'yes_cold':
        risk_score += 0.15
    
    # Determine risk level
    if risk_score >= 0.7:
        risk_level = 'high'
    elif risk_score >= 0.4:
        risk_level = 'medium'
    else:
        risk_level = 'low'
    
    # Generate recommendations
    recommendations = [
        "Drink plenty of water throughout the day",
        "Avoid extreme temperatures",
        "Rest if you feel tired"
    ]
    
    if risk_level == 'high':
        recommendations.extend([
            "Seek medical attention if symptoms worsen",
            "Take prescribed medications",
            "Monitor symptoms closely"
        ])
    
    return jsonify({
        "risk_level": risk_level,
        "risk_score": round(risk_score, 2),
        "recommendations": recommendations
    }), 200

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200

@app.route('/api/health-logs', methods=['GET'])
def get_health_logs():
    logs = HealthLog.query.all()
    return jsonify({
        "logs": [{
            "id": log.id,
            "user_id": log.user_id,
            "general_feeling": log.general_feeling,
            "created_at": log.created_at.isoformat()
        } for log in logs]
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables
    print("🚀 Sickle Cell Backend running on http://localhost:5000")
    print("📊 API Test: http://localhost:5000/api/test")
    print("👥 Users: http://localhost:5000/api/users")
    app.run(debug=True, host='0.0.0.0', port=5000)