from app import db
from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    # Core Identity Fields (extracted from personal_info for easier querying)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='patient') # patient, caregiver, healthcare
    is_admin = db.Column(db.Boolean, default=False)
    
    # structured data stored as JSON objects
    personal_info = db.Column(db.JSON, nullable=True)
    medical_history = db.Column(db.JSON, nullable=True)
    emergency_contacts = db.Column(db.JSON, nullable=True)
    healthcare_providers = db.Column(db.JSON, nullable=True)
    caregiver_info = db.Column(db.JSON, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    health_logs = db.relationship('HealthLog', backref='user', lazy=True)
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'role': self.role,
            'personal_info': self.personal_info,
            'medical_history': self.medical_history,
            'caregiver_info': self.caregiver_info,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }


class Guardian(db.Model):
    __tablename__ = 'guardians'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20), nullable=False)
    relationship = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('guardians', lazy=True))