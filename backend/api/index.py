from app import create_app

app = create_app()

# Vercel uses this
handler = app
