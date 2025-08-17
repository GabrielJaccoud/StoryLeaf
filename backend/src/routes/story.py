from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.story import Story, Character, StoryVersion
from datetime import datetime
import json

story_bp = Blueprint('story', __name__)

@story_bp.route('/stories', methods=['GET'])
def get_stories():
    """Obtém todas as histórias do usuário"""
    try:
        # Por enquanto, retorna todas as histórias (implementar autenticação depois)
        stories = Story.query.all()
        return jsonify({
            'success': True,
            'stories': [story.to_dict() for story in stories]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories', methods=['POST'])
def create_story():
    """Cria uma nova história"""
    try:
        data = request.get_json()
        
        # Validação básica
        if not data.get('title'):
            return jsonify({
                'success': False,
                'error': 'Título é obrigatório'
            }), 400
        
        # Criar nova história
        story = Story(
            title=data.get('title'),
            content=data.get('content', ''),
            genre=data.get('genre'),
            mood=data.get('mood'),
            target_audience=data.get('target_audience'),
            seed_idea=data.get('seed_idea'),
            trunk_plot=data.get('trunk_plot'),
            user_id=data.get('user_id', 1),  # Temporário até implementar auth
            ai_mode=data.get('ai_mode', 'creative'),
            ai_tone=data.get('ai_tone', 'neutral')
        )
        
        # Definir galhos e folhas se fornecidos
        if data.get('branches'):
            story.set_branches(data.get('branches'))
        if data.get('leaves'):
            story.set_leaves(data.get('leaves'))
        
        # Atualizar contagem de palavras
        story.update_word_count()
        
        db.session.add(story)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'story': story.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>', methods=['GET'])
def get_story(story_id):
    """Obtém uma história específica"""
    try:
        story = Story.query.get_or_404(story_id)
        return jsonify({
            'success': True,
            'story': story.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>', methods=['PUT'])
def update_story(story_id):
    """Atualiza uma história"""
    try:
        story = Story.query.get_or_404(story_id)
        data = request.get_json()
        
        # Criar versão antes de atualizar
        if story.content and data.get('content') != story.content:
            version = StoryVersion(
                story_id=story.id,
                version_number=len(story.versions) + 1,
                content=story.content,
                changes_summary=data.get('changes_summary', 'Atualização automática')
            )
            db.session.add(version)
        
        # Atualizar campos
        if 'title' in data:
            story.title = data['title']
        if 'content' in data:
            story.content = data['content']
            story.update_word_count()
        if 'genre' in data:
            story.genre = data['genre']
        if 'mood' in data:
            story.mood = data['mood']
        if 'target_audience' in data:
            story.target_audience = data['target_audience']
        if 'seed_idea' in data:
            story.seed_idea = data['seed_idea']
        if 'trunk_plot' in data:
            story.trunk_plot = data['trunk_plot']
        if 'ai_mode' in data:
            story.ai_mode = data['ai_mode']
        if 'ai_tone' in data:
            story.ai_tone = data['ai_tone']
        if 'is_published' in data:
            story.is_published = data['is_published']
        
        # Atualizar galhos e folhas
        if 'branches' in data:
            story.set_branches(data['branches'])
        if 'leaves' in data:
            story.set_leaves(data['leaves'])
        
        story.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'story': story.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>', methods=['DELETE'])
def delete_story(story_id):
    """Deleta uma história"""
    try:
        story = Story.query.get_or_404(story_id)
        
        # Deletar personagens associados
        Character.query.filter_by(story_id=story_id).delete()
        
        # Deletar versões associadas
        StoryVersion.query.filter_by(story_id=story_id).delete()
        
        # Deletar história
        db.session.delete(story)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'História deletada com sucesso'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>/characters', methods=['GET'])
def get_story_characters(story_id):
    """Obtém personagens de uma história"""
    try:
        characters = Character.query.filter_by(story_id=story_id).all()
        return jsonify({
            'success': True,
            'characters': [character.to_dict() for character in characters]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>/characters', methods=['POST'])
def create_character(story_id):
    """Cria um novo personagem para uma história"""
    try:
        # Verificar se a história existe
        story = Story.query.get_or_404(story_id)
        
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({
                'success': False,
                'error': 'Nome do personagem é obrigatório'
            }), 400
        
        character = Character(
            name=data.get('name'),
            description=data.get('description'),
            role=data.get('role', 'supporting'),
            story_id=story_id
        )
        
        if data.get('personality'):
            character.set_personality(data.get('personality'))
        
        db.session.add(character)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'character': character.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>/versions', methods=['GET'])
def get_story_versions(story_id):
    """Obtém versões de uma história"""
    try:
        versions = StoryVersion.query.filter_by(story_id=story_id).order_by(StoryVersion.version_number.desc()).all()
        return jsonify({
            'success': True,
            'versions': [version.to_dict() for version in versions]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/<int:story_id>/publish', methods=['POST'])
def publish_story(story_id):
    """Publica uma história"""
    try:
        story = Story.query.get_or_404(story_id)
        story.is_published = True
        story.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'História publicada com sucesso',
            'story': story.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@story_bp.route('/stories/search', methods=['GET'])
def search_stories():
    """Busca histórias por título, gênero ou conteúdo"""
    try:
        query = request.args.get('q', '')
        genre = request.args.get('genre', '')
        
        stories_query = Story.query
        
        if query:
            stories_query = stories_query.filter(
                Story.title.contains(query) | 
                Story.content.contains(query) |
                Story.seed_idea.contains(query)
            )
        
        if genre:
            stories_query = stories_query.filter(Story.genre == genre)
        
        stories = stories_query.all()
        
        return jsonify({
            'success': True,
            'stories': [story.to_dict() for story in stories],
            'count': len(stories)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

