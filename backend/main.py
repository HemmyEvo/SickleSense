from app import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        # This checks your models and creates the tables if they don't exist
        db.create_all()
        print("Database tables created successfully.")
        
    app.run(debug=True)