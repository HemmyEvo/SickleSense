from app import create_app

app = create_app()

# Add a test route to debug
@app.route('/api/debug')
def debug():
    return {
        "message": "Debug route working",
        "routes": [str(rule) for rule in app.url_map.iter_rules()]
    }

@app.route('/api/test')
def test():
    return {"status": "OK", "message": "Test route working"}

if __name__ == '__main__':
    with app.app_context():
        # Print all registered routes
        print("=== REGISTERED ROUTES ===")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.rule}")
        print("=========================")
    
    print("🚀 Starting server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)