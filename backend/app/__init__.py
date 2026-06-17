def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///sickle_cell.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    # Initialize database tables and load ML models
    with app.app_context():
        # This creates the tables if they don't exist yet
        db.create_all() 
        
        from app.services.ml_service import MLService
        MLService.load_models()

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.health import health_bp
    from app.routes.prediction import prediction_bp
    from app.routes.notifications import notifications_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(notifications_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/api/test')
    def test():
        return {"status": "OK"}

    return app
