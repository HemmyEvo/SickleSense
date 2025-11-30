from datetime import datetime, date

def get_current_date():
    """Get current date in YYYY-MM-DD format"""
    return date.today().isoformat()

def format_datetime(dt):
    """Format datetime for JSON response"""
    if dt:
        return dt.isoformat()
    return None

def calculate_age(birth_date):
    """Calculate age from birth date"""
    if not birth_date:
        return None
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))