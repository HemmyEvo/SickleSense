from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            
            if not user or not user.is_admin:
                return jsonify({
                    'error': 'Admin access required',
                    'message': 'You need administrator privileges to access this resource'
                }), 403
                
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return decorated_function