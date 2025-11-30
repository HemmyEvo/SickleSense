from app import db
from datetime import datetime

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    health_log_id = db.Column(db.Integer, db.ForeignKey('health_logs.id'))
    
    # Prediction results
    risk_level = db.Column(db.String(20), nullable=False)  # low, medium, high
    risk_score = db.Column(db.Float, nullable=False)  # 0.0 - 1.0
    confidence = db.Column(db.Float)  # Model confidence
    
    # Features used for prediction
    features = db.Column(db.JSON)
    
    # Recommendations
    recommendations = db.Column(db.JSON)
    
    # Feedback
    accurate_prediction = db.Column(db.Boolean)  # User feedback
    actual_outcome = db.Column(db.String(50))  # What actually happened
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    health_log = db.relationship('HealthLog', backref=db.backref('prediction', uselist=False))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'risk_level': self.risk_level,
            'risk_score': self.risk_score,
            'confidence': self.confidence,
            'recommendations': self.recommendations or [],
            'accurate_prediction': self.accurate_prediction,
            'created_at': self.created_at.isoformat()
        }