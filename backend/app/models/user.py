from app import db
from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    genotype = db.Column(db.String(10))
    role = db.Column(db.String(20), default='patient')  # patient, caregiver
    is_admin = db.Column(db.Boolean, default=False)  # Add this line
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    haemoglobin_level = db.Column(db.Float)  # Store haemoglobin levels
    oxygen_saturation = db.Column(db.Float)  # Store oxygen levels
    previously_admitted = db.Column(db.Boolean, default=False)  # Admission history
    last_medical_check = db.Column(db.DateTime)
    
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
            'age': self.age,
            'gender': self.gender,
            'genotype': self.genotype,
            'role': self.role,
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