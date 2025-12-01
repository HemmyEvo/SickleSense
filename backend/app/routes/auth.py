from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 8

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # 1. Basic Validation
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if not validate_password(data['password']):
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        # 2. Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 409
        
        # 3. Extract Nested Data
        personal_info = data.get('personalInfo', {})
        medical_history = data.get('medicalHistory', {})
        emergency_contacts = data.get('emergencyContacts', {})
        healthcare_providers = data.get('healthcareProviders', {})
        caregiver_info = data.get('caregiverInfo', {})
        
        # 4. Create User Instance
        # We extract name and phone to top-level columns for easier indexing
        user = User(
            email=data['email'],
            name=personal_info.get('fullName', 'Unknown'),
            phone=personal_info.get('phone', ''),
            role=data.get('userType', 'patient'),
            
            # Store the full nested objects in JSON columns
            personal_info=personal_info,
            medical_history=medical_history,
            emergency_contacts=emergency_contacts,
            healthcare_providers=healthcare_providers,
            caregiver_info=caregiver_info
        )
        
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # 5. Generate Token for immediate login
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Account created successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Signup Error: {str(e)}") # Log error for server debugging
        return jsonify({'error': 'An internal error occurred during signup'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500