import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    return len(password) >= 6

def validate_health_data(data):
    """Validate health log data"""
    required_fields = ['general_feeling']
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate enum values
    valid_feelings = ['very_okay', 'okay', 'uncomfortable', 'in_pain', 'severe_pain']
    if data['general_feeling'] not in valid_feelings:
        return False, "Invalid general feeling value"
    
    return True, "Valid"