from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    # Delete test users to start fresh
    User.query.filter(User.email.in_(['test@example.com', 'newuser@example.com'])).delete()
    db.session.commit()
    print("✅ Test users cleaned up")
    
    # Create a fresh test user
    user = User(
        email="fresh@example.com",
        name="Fresh User", 
        age=30
    )
    user.set_password("password123")
    
    db.session.add(user)
    db.session.commit()
    print("✅ Fresh test user created")
    
    print("🎯 Now test with:")
    print("Email: fresh@example.com")
    print("Password: password123")