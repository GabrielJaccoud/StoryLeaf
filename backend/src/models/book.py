from dataclasses import dataclass
from typing import List, Optional
import json

@dataclass
class Book:
    id: Optional[int] = None
    title: str = ""
    author: str = ""
    genre: str = ""
    description: str = ""
    chapters: int = 0
    reading_time: int = 0  # em minutos
    popularity: int = 0
    status: str = "unread"  # unread, reading, completed
    progress: int = 0  # 0-100
    cover_url: Optional[str] = None
    content: str = ""
    interactive_elements: Optional[str] = None  # JSON string
    ar_markers: Optional[str] = None  # JSON string
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'genre': self.genre,
            'description': self.description,
            'chapters': self.chapters,
            'reading_time': self.reading_time,
            'popularity': self.popularity,
            'status': self.status,
            'progress': self.progress,
            'cover_url': self.cover_url,
            'content': self.content,
            'interactive_elements': json.loads(self.interactive_elements) if self.interactive_elements else None,
            'ar_markers': json.loads(self.ar_markers) if self.ar_markers else None
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('id'),
            title=data.get('title', ''),
            author=data.get('author', ''),
            genre=data.get('genre', ''),
            description=data.get('description', ''),
            chapters=data.get('chapters', 0),
            reading_time=data.get('reading_time', 0),
            popularity=data.get('popularity', 0),
            status=data.get('status', 'unread'),
            progress=data.get('progress', 0),
            cover_url=data.get('cover_url'),
            content=data.get('content', ''),
            interactive_elements=json.dumps(data.get('interactive_elements')) if data.get('interactive_elements') else None,
            ar_markers=json.dumps(data.get('ar_markers')) if data.get('ar_markers') else None
        )

@dataclass
class UserProgress:
    user_id: str
    total_books_read: int = 0
    total_reading_time: int = 0  # em minutos
    current_streak: int = 0
    orvalho: int = 0  # XP points
    achievements: List[str] = None
    
    def __post_init__(self):
        if self.achievements is None:
            self.achievements = []
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'total_books_read': self.total_books_read,
            'total_reading_time': self.total_reading_time,
            'current_streak': self.current_streak,
            'orvalho': self.orvalho,
            'achievements': self.achievements
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data.get('user_id', ''),
            total_books_read=data.get('total_books_read', 0),
            total_reading_time=data.get('total_reading_time', 0),
            current_streak=data.get('current_streak', 0),
            orvalho=data.get('orvalho', 0),
            achievements=data.get('achievements', [])
        )

@dataclass
class ReadingSession:
    id: Optional[int] = None
    user_id: str = ""
    book_id: int = 0
    start_time: str = ""
    end_time: Optional[str] = None
    pages_read: int = 0
    orvalho_earned: int = 0
    interactions: Optional[str] = None  # JSON string para elementos interativos usados
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'pages_read': self.pages_read,
            'orvalho_earned': self.orvalho_earned,
            'interactions': json.loads(self.interactions) if self.interactions else None
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data.get('id'),
            user_id=data.get('user_id', ''),
            book_id=data.get('book_id', 0),
            start_time=data.get('start_time', ''),
            end_time=data.get('end_time'),
            pages_read=data.get('pages_read', 0),
            orvalho_earned=data.get('orvalho_earned', 0),
            interactions=json.dumps(data.get('interactions')) if data.get('interactions') else None
        )

