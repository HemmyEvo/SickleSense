from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    # Find your user by email and make them admin
    your_email = "sam@gmail.com"  # Change this to your email
    
    user = User.query.filter_by(email=your_email).first()
    
    if user:
        user.is_admin = True
        user.role = 'admin'
        db.session.commit()
        print(f"✅ SUCCESS: {user.email} is now an administrator!")
        print(f"User ID: {user.id}, Name: {user.name}, Admin: {user.is_admin}")
    else:
        print(f"❌ User with email {your_email} not found.")
        print("Available users:")
        users = User.query.all()
        for u in users:
            print(f" - {u.email} (ID: {u.id}, Admin: {u.is_admin})")