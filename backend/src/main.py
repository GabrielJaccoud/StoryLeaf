import os
import sys
from dotenv import load_dotenv
from flask_cors import CORS

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Load environment variables
load_dotenv()

from flask import Flask, send_from_directory, jsonify
from src.models.user import db
from src.routes.user import user_bp
from src.routes.story import story_bp
from src.routes.ai import ai_bp
from src.routes.books import books_bp
from src.routes.glossary import glossary_bp
from src.routes.world_generation import world_generation_bp
from src.routes.tree_of_life_ai import tree_of_life_ai_bp
from src.routes.mystic_audiobook import mystic_audiobook_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Enable CORS for all routes
CORS(app, origins="*")

# Configuration
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'storyleaf-secret-key-2025')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(story_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api')
app.register_blueprint(books_bp, url_prefix='/api')
app.register_blueprint(glossary_bp, url_prefix='/api')
app.register_blueprint(world_generation_bp, url_prefix='/api')
app.register_blueprint(tree_of_life_ai_bp, url_prefix='/api')
app.register_blueprint(mystic_audiobook_bp, url_prefix='/api')

# Initialize database
db.init_app(app)
with app.app_context():
    db.create_all()

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'StoryLeaf API is running',
        'version': '1.0.0'
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Não interceptar rotas da API
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({
                'message': 'Welcome to StoryLeaf API',
                'version': '2.0.0',
                'endpoints': {
                    'health': '/api/health',
                    'users': '/api/users',
                    'stories': '/api/stories',
                    'ai': '/api/ai',
                    'books': '/api/books',
                    'progress': '/api/user/progress',
                    'achievements': '/api/achievements',
                    'glossary': '/api/glossary/<term>',
                    'world_generation': '/api/worlds',
                    'tree_of_life_ai': '/api/tree-ai',
                    'mystic_audiobook': '/api/audiobook'
                }
            })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)