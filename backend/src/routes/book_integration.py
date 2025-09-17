"""
API de Integração de Livros - StoryLeaf 2.0
Integração dos livros processados com WorldExplorer e recursos interativos
"""

from flask import Blueprint, request, jsonify
import json
import os
import uuid
from datetime import datetime

book_integration_bp = Blueprint('book_integration', __name__)

# Diretório onde estão os livros processados
PROCESSED_BOOKS_DIR = '/home/ubuntu/StoryLeaf/processed_books'

# Cache de livros carregados
LOADED_BOOKS = {}

@book_integration_bp.route("/library/list", methods=["GET"])
def list_available_books():
    """
    Lista todos os livros processados disponíveis
    """
    try:
        books = []
        
        if os.path.exists(PROCESSED_BOOKS_DIR):
            for filename in os.listdir(PROCESSED_BOOKS_DIR):
                if filename.endswith('.md'):
                    book_id = filename.replace('.md', '')
                    book_title = format_book_title(book_id)
                    
                    books.append({
                        "id": book_id,
                        "title": book_title,
                        "filename": filename,
                        "status": "processed",
                        "world_compatible": True,
                        "audiobook_compatible": True
                    })
        
        return jsonify({
            "success": True,
            "books": books,
            "total": len(books)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao listar livros: {str(e)}"}), 500

@book_integration_bp.route("/library/<book_id>/content", methods=["GET"])
def get_book_content(book_id):
    """
    Retorna o conteúdo processado de um livro
    """
    try:
        book_file = os.path.join(PROCESSED_BOOKS_DIR, f"{book_id}.md")
        
        if not os.path.exists(book_file):
            return jsonify({"error": "Livro não encontrado"}), 404
        
        with open(book_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Divide o conteúdo em seções para melhor navegação
        sections = split_content_into_sections(content)
        
        book_data = {
            "id": book_id,
            "title": format_book_title(book_id),
            "content": content,
            "sections": sections,
            "word_count": len(content.split()),
            "reading_time_minutes": estimate_reading_time(content),
            "processed_at": datetime.now().isoformat()
        }
        
        # Cache do livro
        LOADED_BOOKS[book_id] = book_data
        
        return jsonify({
            "success": True,
            "book": book_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao carregar livro: {str(e)}"}), 500

@book_integration_bp.route("/library/<book_id>/world-data", methods=["GET"])
def get_book_world_data(book_id):
    """
    Retorna dados do livro formatados para o WorldExplorer
    """
    try:
        # Carrega o livro se não estiver em cache
        if book_id not in LOADED_BOOKS:
            book_response = get_book_content(book_id)
            if book_response[1] != 200:
                return book_response
        
        book_data = LOADED_BOOKS[book_id]
        
        # Gera dados específicos para WorldExplorer
        world_data = generate_world_data_from_book(book_data)
        
        return jsonify({
            "success": True,
            "world_data": world_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao gerar dados do mundo: {str(e)}"}), 500

@book_integration_bp.route("/library/<book_id>/audiobook-data", methods=["GET"])
def get_book_audiobook_data(book_id):
    """
    Retorna dados do livro formatados para o Mystic Audiobook
    """
    try:
        # Carrega o livro se não estiver em cache
        if book_id not in LOADED_BOOKS:
            book_response = get_book_content(book_id)
            if book_response[1] != 200:
                return book_response
        
        book_data = LOADED_BOOKS[book_id]
        
        # Gera dados específicos para Mystic Audiobook
        audiobook_data = generate_audiobook_data_from_book(book_data)
        
        return jsonify({
            "success": True,
            "audiobook_data": audiobook_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao gerar dados do audiobook: {str(e)}"}), 500

@book_integration_bp.route("/library/<book_id>/ai-analysis", methods=["POST"])
def analyze_book_with_ai(book_id):
    """
    Analisa o livro usando a Árvore da Vida AI
    """
    try:
        data = request.get_json()
        analysis_type = data.get('type', 'summary')
        
        # Carrega o livro se não estiver em cache
        if book_id not in LOADED_BOOKS:
            book_response = get_book_content(book_id)
            if book_response[1] != 200:
                return book_response
        
        book_data = LOADED_BOOKS[book_id]
        
        # Gera análise baseada no tipo solicitado
        analysis = generate_ai_analysis(book_data, analysis_type)
        
        return jsonify({
            "success": True,
            "analysis": analysis,
            "analysis_type": analysis_type,
            "generated_at": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro na análise AI: {str(e)}"}), 500

def format_book_title(book_id):
    """
    Formata o ID do livro em um título legível
    """
    # Remove caracteres especiais e formata
    title = book_id.replace('(', ' - ').replace(')', '').replace('_', ' ')
    
    # Mapeia alguns títulos conhecidos
    title_mapping = {
        "Alice_in_Wonderland": "Alice no País das Maravilhas",
        "AIlhadoTesouro": "A Ilha do Tesouro",
        "DomQuixote": "Dom Quixote",
        "PeterPan": "Peter Pan",
        "OMágicodeOz": "O Mágico de Oz",
        "OJardimSecreto": "O Jardim Secreto",
        "iracema": "Iracema",
        "ViagemaoCentrodaTerra": "Viagem ao Centro da Terra"
    }
    
    return title_mapping.get(book_id, title)

def split_content_into_sections(content):
    """
    Divide o conteúdo em seções lógicas
    """
    # Divide por parágrafos e agrupa em seções
    paragraphs = content.split('\n\n')
    sections = []
    current_section = []
    words_per_section = 500
    
    current_word_count = 0
    section_id = 1
    
    for paragraph in paragraphs:
        paragraph_words = len(paragraph.split())
        
        if current_word_count + paragraph_words > words_per_section and current_section:
            sections.append({
                "id": section_id,
                "title": f"Seção {section_id}",
                "content": '\n\n'.join(current_section),
                "word_count": current_word_count
            })
            current_section = [paragraph]
            current_word_count = paragraph_words
            section_id += 1
        else:
            current_section.append(paragraph)
            current_word_count += paragraph_words
    
    # Adiciona a última seção
    if current_section:
        sections.append({
            "id": section_id,
            "title": f"Seção {section_id}",
            "content": '\n\n'.join(current_section),
            "word_count": current_word_count
        })
    
    return sections

def estimate_reading_time(content):
    """
    Estima o tempo de leitura em minutos (assumindo 200 palavras por minuto)
    """
    word_count = len(content.split())
    return max(1, word_count // 200)

def generate_world_data_from_book(book_data):
    """
    Gera dados específicos para WorldExplorer baseados no conteúdo do livro
    """
    book_id = book_data["id"]
    
    # Mapeia livros para configurações de mundo específicas
    world_configs = {
        "Alice_in_Wonderland": {
            "environment_type": "fantasy_magical",
            "theme_colors": ["#FF69B4", "#9370DB", "#00CED1"],
            "interactive_elements": ["Gato de Cheshire", "Chapeleiro Maluco", "Rainha de Copas"],
            "atmosphere": "whimsical"
        },
        "AIlhadoTesouro": {
            "environment_type": "adventure_tropical",
            "theme_colors": ["#DAA520", "#8B4513", "#4682B4"],
            "interactive_elements": ["Long John Silver", "Baú do Tesouro", "Navio Hispaniola"],
            "atmosphere": "adventurous"
        },
        "PeterPan": {
            "environment_type": "fantasy_adventure",
            "theme_colors": ["#32CD32", "#FFD700", "#87CEEB"],
            "interactive_elements": ["Peter Pan", "Sininho", "Capitão Gancho"],
            "atmosphere": "magical"
        }
    }
    
    config = world_configs.get(book_id, {
        "environment_type": "literary_classic",
        "theme_colors": ["#8B4513", "#F5DEB3", "#2F4F4F"],
        "interactive_elements": ["Narrador", "Personagem Principal"],
        "atmosphere": "contemplative"
    })
    
    return {
        "book_id": book_id,
        "title": book_data["title"],
        "world_config": config,
        "sections": book_data["sections"],
        "navigation_points": generate_navigation_points(book_data["sections"]),
        "interactive_mode": True,
        "ai_companion": True
    }

def generate_audiobook_data_from_book(book_data):
    """
    Gera dados específicos para Mystic Audiobook baseados no conteúdo do livro
    """
    return {
        "book_id": book_data["id"],
        "title": book_data["title"],
        "sections": book_data["sections"],
        "total_duration_estimate": book_data["reading_time_minutes"] * 60,  # em segundos
        "voice_options": ["male_voice", "female_voice"],
        "background_music": determine_background_music(book_data["id"]),
        "sound_effects": determine_sound_effects(book_data["id"]),
        "reading_speed": "normal"
    }

def generate_navigation_points(sections):
    """
    Gera pontos de navegação para o WorldExplorer
    """
    navigation_points = []
    
    for i, section in enumerate(sections):
        navigation_points.append({
            "id": f"nav_{section['id']}",
            "title": section["title"],
            "position": [i * 10, 0, 0],  # Posições espaciais simuladas
            "section_id": section["id"],
            "preview": section["content"][:100] + "..."
        })
    
    return navigation_points

def determine_background_music(book_id):
    """
    Determina a música de fundo apropriada para cada livro
    """
    music_mapping = {
        "Alice_in_Wonderland": "whimsical_fantasy",
        "AIlhadoTesouro": "adventure_orchestral",
        "PeterPan": "magical_adventure",
        "DomQuixote": "classical_spanish",
        "iracema": "brazilian_classical"
    }
    
    return music_mapping.get(book_id, "classical_ambient")

def determine_sound_effects(book_id):
    """
    Determina os efeitos sonoros apropriados para cada livro
    """
    effects_mapping = {
        "Alice_in_Wonderland": ["magical_chimes", "whimsical_sounds"],
        "AIlhadoTesouro": ["ocean_waves", "pirate_sounds"],
        "PeterPan": ["fairy_dust", "flying_sounds"],
        "ViagemaoCentrodaTerra": ["cave_echoes", "underground_sounds"]
    }
    
    return effects_mapping.get(book_id, ["page_turn", "ambient_nature"])

def generate_ai_analysis(book_data, analysis_type):
    """
    Gera análise AI do livro (simulada - em produção usaria OpenAI)
    """
    analyses = {
        "summary": f"Este é um resumo inteligente de '{book_data['title']}'. A obra apresenta temas universais e personagens memoráveis que continuam relevantes hoje.",
        "characters": f"Os personagens principais de '{book_data['title']}' são complexos e bem desenvolvidos, cada um representando diferentes aspectos da condição humana.",
        "themes": f"Os temas centrais de '{book_data['title']}' incluem crescimento pessoal, aventura, e a jornada do herói, elementos que ressoam com leitores de todas as idades.",
        "style": f"O estilo narrativo de '{book_data['title']}' é característico de sua época, combinando descrições vívidas com diálogos envolventes."
    }
    
    return {
        "type": analysis_type,
        "content": analyses.get(analysis_type, "Análise não disponível para este tipo."),
        "confidence": 0.85,
        "generated_by": "Árvore da Vida AI",
        "suggestions": [
            "Explore o WorldExplorer para uma experiência imersiva",
            "Experimente o Mystic Audiobook para uma nova perspectiva",
            "Use a análise de personagens para discussões em grupo"
        ]
    }

