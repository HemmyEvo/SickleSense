from app import create_app

# 1. Create the application instance
flask_app = create_app()

# 2. Expose it as 'app' for Vercel
# This reassignment ensures 'app' is the WSGI object, not the module
app = flask_app