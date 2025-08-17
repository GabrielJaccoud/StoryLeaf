from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Story(db.Model):
    __tablename__ = 'stories'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=True)
    genre = db.Column(db.String(50), nullable=True)
    mood = db.Column(db.String(50), nullable=True)
    target_audience = db.Column(db.String(50), nullable=True)
    
    # Metáfora da árvore
    seed_idea = db.Column(db.Text, nullable=True)  # Semente/ideia original
    trunk_plot = db.Column(db.Text, nullable=True)  # Tronco/enredo principal
    branches = db.Column(db.Text, nullable=True)  # Galhos/ramificações (JSON)
    leaves = db.Column(db.Text, nullable=True)  # Folhas/capítulos (JSON)
    
    # Metadados
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_published = db.Column(db.Boolean, default=False)
    word_count = db.Column(db.Integer, default=0)
    
    # Configurações de IA
    ai_mode = db.Column(db.String(50), default='creative')  # creative, academic, corporate, social
    ai_tone = db.Column(db.String(50), default='neutral')  # serious, poetic, persuasive, summarized
    
    def __repr__(self):
        return f'<Story {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'genre': self.genre,
            'mood': self.mood,
            'target_audience': self.target_audience,
            'seed_idea': self.seed_idea,
            'trunk_plot': self.trunk_plot,
            'branches': json.loads(self.branches) if self.branches else [],
            'leaves': json.loads(self.leaves) if self.leaves else [],
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_published': self.is_published,
            'word_count': self.word_count,
            'ai_mode': self.ai_mode,
            'ai_tone': self.ai_tone
        }
    
    def set_branches(self, branches_list):
        """Define os galhos da história (ramificações narrativas)"""
        self.branches = json.dumps(branches_list)
    
    def get_branches(self):
        """Obtém os galhos da história"""
        return json.loads(self.branches) if self.branches else []
    
    def set_leaves(self, leaves_list):
        """Define as folhas da história (capítulos)"""
        self.leaves = json.dumps(leaves_list)
    
    def get_leaves(self):
        """Obtém as folhas da história"""
        return json.loads(self.leaves) if self.leaves else []
    
    def update_word_count(self):
        """Atualiza a contagem de palavras baseada no conteúdo"""
        if self.content:
            self.word_count = len(self.content.split())
        else:
            self.word_count = 0


class Character(db.Model):
    __tablename__ = 'characters'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    personality = db.Column(db.Text, nullable=True)  # JSON com traços de personalidade
    role = db.Column(db.String(50), nullable=True)  # protagonist, antagonist, supporting
    
    # Relacionamento com história
    story_id = db.Column(db.Integer, db.ForeignKey('stories.id'), nullable=False)
    story = db.relationship('Story', backref=db.backref('characters', lazy=True))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Character {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'personality': json.loads(self.personality) if self.personality else {},
            'role': self.role,
            'story_id': self.story_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def set_personality(self, personality_dict):
        """Define a personalidade do personagem"""
        self.personality = json.dumps(personality_dict)
    
    def get_personality(self):
        """Obtém a personalidade do personagem"""
        return json.loads(self.personality) if self.personality else {}


class StoryVersion(db.Model):
    __tablename__ = 'story_versions'
    
    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey('stories.id'), nullable=False)
    version_number = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    changes_summary = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    story = db.relationship('Story', backref=db.backref('versions', lazy=True))
    
    def __repr__(self):
        return f'<StoryVersion {self.story_id}v{self.version_number}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'story_id': self.story_id,
            'version_number': self.version_number,
            'content': self.content,
            'changes_summary': self.changes_summary,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

