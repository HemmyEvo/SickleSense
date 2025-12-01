from app import db
from datetime import datetime

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    health_log_id = db.Column(db.Integer, db.ForeignKey('health_logs.id'))
    
    # ML Model Outputs
    pain_type = db.Column(db.String(50))           # From classifier.pkl
    pain_intensity = db.Column(db.Float)           # From regressor.pkl (0-10 scale)
    risk_level = db.Column(db.String(20))          # low, medium, high
    risk_score = db.Column(db.Float)               # 0.0 - 1.0
    confidence = db.Column(db.Float)
    
    # Model metadata
    model_used = db.Column(db.String(20))          # real_ml_models or fallback
    
    # Features used for prediction
    features = db.Column(db.JSON)
    recommendations = db.Column(db.JSON)
    
    # Feedback
    accurate_prediction = db.Column(db.Boolean)
    actual_outcome = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    health_log = db.relationship('HealthLog', backref=db.backref('prediction', uselist=False))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pain_type': self.pain_type,
            'pain_intensity': self.pain_intensity,
            'risk_level': self.risk_level,
            'risk_score': self.risk_score,
            'confidence': self.confidence,
            'model_used': self.model_used,
            'recommendations': self.recommendations or [],
            'created_at': self.created_at.isoformat()
        }