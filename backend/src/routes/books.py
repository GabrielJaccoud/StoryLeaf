from flask import Blueprint, request, jsonify
from datetime import datetime
import json

books_bp = Blueprint("books", __name__)

# Mock data para demonstração (manter apenas dados de usuário e conquistas)
MOCK_USER_PROGRESS = {
    "user_id": "default_user",
    "total_books_read": 12,
    "total_reading_time": 8640,
    "current_streak": 7,
    "orvalho": 2450,
    "achievements": ["Explorador de Mundos", "Leitor Dedicado", "Detetive Literário"]
}

# MOCK_BOOKS será removido ou movido para book_integration.py se necessário

@books_bp.route("/user/progress", methods=["GET"])
def get_user_progress():
    """Retorna o progresso do usuário"""
    try:
        return jsonify({
            "success": True,
            "progress": MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@books_bp.route("/user/progress", methods=["POST"])
def update_user_progress():
    """Atualiza o progresso do usuário"""
    try:
        data = request.get_json()
        
        # Atualizar progresso mock (em produção, salvaria no banco)
        if "orvalho" in data:
            MOCK_USER_PROGRESS["orvalho"] += data["orvalho"]
        
        if "reading_time" in data:
            MOCK_USER_PROGRESS["total_reading_time"] += data["reading_time"]
        
        if "achievement" in data:
            if data["achievement"] not in MOCK_USER_PROGRESS["achievements"]:
                MOCK_USER_PROGRESS["achievements"].append(data["achievement"])
        
        return jsonify({
            "success": True,
            "progress": MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@books_bp.route("/achievements", methods=["GET"])
def get_achievements():
    """Retorna lista de conquistas disponíveis"""
    try:
        achievements = [
            {
                "id": "explorador_mundos",
                "name": "Explorador de Mundos",
                "description": "Leia 10 livros de fantasia",
                "icon": "🌍",
                "requirement": "fantasy_books_10",
                "unlocked": True
            },
            {
                "id": "leitor_dedicado",
                "name": "Leitor Dedicado",
                "description": "Leia por 100 horas",
                "icon": "📚",
                "requirement": "reading_time_6000",
                "unlocked": True
            },
            {
                "id": "detetive_literario",
                "name": "Detetive Literário",
                "description": "Complete 5 livros de mistério",
                "icon": "🔍",
                "requirement": "mystery_books_5",
                "unlocked": True
            },
            {
                "id": "jardineiro_historias",
                "name": "Jardineiro de Histórias",
                "description": "Complete 3 séries de livros",
                "icon": "🌱",
                "requirement": "series_3",
                "unlocked": False
            },
            {
                "id": "mestre_ra",
                "name": "Mestre da Realidade Aumentada",
                "description": "Use RA em 20 cenas diferentes",
                "icon": "🕶️",
                "requirement": "ar_scenes_20",
                "unlocked": False
            }
        ]
        
        return jsonify({
            "success": True,
            "achievements": achievements
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


