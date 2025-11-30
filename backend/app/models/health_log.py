from app import db
from datetime import datetime

class HealthLog(db.Model):
    __tablename__ = 'health_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Question 1: General feeling
    general_feeling = db.Column(db.String(50), nullable=False)  # very_okay, okay, uncomfortable, in_pain, severe_pain
    
    # Question 2: Sleep quality
    sleep_quality = db.Column(db.String(20))  # yes, little, no
    
    # Question 3: Water intake
    water_intake = db.Column(db.String(20))  # 0-1_cups, 2-3_cups, 4-5_cups, 6+_cups
    
    # Question 4: Temperature feeling
    temperature_feeling = db.Column(db.String(20))  # hot, cold, normal
    
    # Question 5: Symptoms (store as JSON)
    symptoms = db.Column(db.JSON)  # List of symptoms
    
    # Question 6: Medication
    medication_taken = db.Column(db.String(20))  # yes, not_yet, missed
    
    # Question 7: Physical activity
    physical_activity = db.Column(db.String(20))  # none, light, moderate, heavy
    
    # Question 8: Temperature exposure
    temperature_exposure = db.Column(db.String(20))  # yes_heat, yes_cold, no
    
    # Question 9: Stress level
    stress_level = db.Column(db.String(20))  # not_stressed, little_stressed, very_stressed
    
    # Question 10: Notify guardian
    notify_guardian = db.Column(db.Boolean, default=False)
    
    # Additional metadata
    log_date = db.Column(db.Date, default=datetime.utcnow().date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'general_feeling': self.general_feeling,
            'sleep_quality': self.sleep_quality,
            'water_intake': self.water_intake,
            'temperature_feeling': self.temperature_feeling,
            'symptoms': self.symptoms or [],
            'medication_taken': self.medication_taken,
            'physical_activity': self.physical_activity,
            'temperature_exposure': self.temperature_exposure,
            'stress_level': self.stress_level,
            'notify_guardian': self.notify_guardian,
            'log_date': self.log_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class CrisisEvent(db.Model):
    __tablename__ = 'crisis_events'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pain_level = db.Column(db.Integer, nullable=False)  # 1-10 scale
    symptoms = db.Column(db.JSON)
    location = db.Column(db.String(100))
    severity = db.Column(db.String(20))  # mild, moderate, severe
    resolved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    
    user = db.relationship('User', backref=db.backref('crisis_events', lazy=True))