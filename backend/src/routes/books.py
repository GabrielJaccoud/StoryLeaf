from flask import Blueprint, request, jsonify
from datetime import datetime
import json

books_bp = Blueprint('books', __name__)

# Mock data para demonstração
MOCK_BOOKS = [
    {
        "id": 1,
        "title": "O Senhor dos Anéis",
        "author": "J.R.R. Tolkien",
        "genre": "fantasia",
        "description": "Uma épica jornada através da Terra Média, onde um hobbit deve destruir um anel poderoso para salvar o mundo.",
        "chapters": 62,
        "reading_time": 1200,
        "popularity": 95,
        "status": "reading",
        "progress": 65,
        "content": "Em um buraco no chão vivia um hobbit. Não um buraco sujo, imundo, cheio de pontas de minhocas e cheiro de lodo, nem tampouco um buraco seco, vazio, arenoso, sem nada em que se sentar ou que comer: era um buraco-hobbit, e isso significa conforto...",
        "interactive_elements": {
            "keywords": ["hobbit", "Terra Média", "anel"],
            "characters": ["Frodo", "Gandalf", "Aragorn"],
            "locations": ["Condado", "Rivendell", "Mordor"]
        },
        "ar_markers": {
            "scenes": ["condado_3d", "rivendell_3d", "mordor_3d"],
            "characters": ["frodo_3d", "gandalf_3d"]
        }
    },
    {
        "id": 2,
        "title": "1984",
        "author": "George Orwell",
        "genre": "distopia",
        "description": "Um futuro sombrio onde a liberdade é uma ilusão e o Grande Irmão observa tudo.",
        "chapters": 23,
        "reading_time": 480,
        "popularity": 88,
        "status": "completed",
        "progress": 100,
        "content": "Era um dia frio e claro de abril, e os relógios davam treze horas. Winston Smith, queixo enfiado no peito numa tentativa de fugir do vento cruel, passou rapidamente pelas portas de vidro das Mansões Victory...",
        "interactive_elements": {
            "keywords": ["Grande Irmão", "Ministério da Verdade", "duplipensar"],
            "characters": ["Winston Smith", "Julia", "O'Brien"],
            "locations": ["Oceania", "Ministério da Verdade", "Sala 101"]
        }
    },
    {
        "id": 3,
        "title": "Orgulho e Preconceito",
        "author": "Jane Austen",
        "genre": "romance",
        "description": "Uma história de amor e sociedade na Inglaterra do século XIX, focando em Elizabeth Bennet e Mr. Darcy.",
        "chapters": 61,
        "reading_time": 720,
        "popularity": 82,
        "status": "unread",
        "progress": 0,
        "content": "É uma verdade universalmente reconhecida que um homem solteiro, possuidor de uma boa fortuna, deve estar necessitado de esposa...",
        "interactive_elements": {
            "keywords": ["sociedade", "casamento", "fortuna"],
            "characters": ["Elizabeth Bennet", "Mr. Darcy", "Jane Bennet"],
            "locations": ["Longbourn", "Pemberley", "Netherfield"]
        }
    },
    {
        "id": 4,
        "title": "O Nome da Rosa",
        "author": "Umberto Eco",
        "genre": "mistério",
        "description": "Um mistério medieval em uma abadia italiana, onde monges morrem em circunstâncias misteriosas.",
        "chapters": 45,
        "reading_time": 960,
        "popularity": 76,
        "status": "reading",
        "progress": 30,
        "content": "Era uma manhã do fim de novembro. Durante a noite havia nevado um pouco, mas a neve não era espessa. Eu havia saído de Melk ao raiar do dia...",
        "interactive_elements": {
            "keywords": ["abadia", "manuscritos", "heresia"],
            "characters": ["Guilherme de Baskerville", "Adso", "Jorge"],
            "locations": ["Abadia", "Biblioteca", "Scriptorium"]
        }
    },
    {
        "id": 5,
        "title": "Duna",
        "author": "Frank Herbert",
        "genre": "ficção científica",
        "description": "Uma saga épica em um planeta desértico, onde especiarias valiosas determinam o destino do universo.",
        "chapters": 48,
        "reading_time": 1080,
        "popularity": 91,
        "status": "unread",
        "progress": 0,
        "content": "No ano 10191 A.G., uma menina nasceu para o Duque Leto Atreides e sua concubina, a Bene Gesserit Lady Jessica, no planeta oceânico de Caladan...",
        "interactive_elements": {
            "keywords": ["especiaria", "Fremen", "Kwisatz Haderach"],
            "characters": ["Paul Atreides", "Lady Jessica", "Duncan Idaho"],
            "locations": ["Arrakis", "Caladan", "Giedi Prime"]
        }
    }
]

MOCK_USER_PROGRESS = {
    "user_id": "default_user",
    "total_books_read": 12,
    "total_reading_time": 8640,
    "current_streak": 7,
    "orvalho": 2450,
    "achievements": ["Explorador de Mundos", "Leitor Dedicado", "Detetive Literário"]
}

@books_bp.route('/books', methods=['GET'])
def get_books():
    """Retorna lista de livros com filtros opcionais"""
    try:
        genre_filter = request.args.get('genre')
        status_filter = request.args.get('status')
        
        books = MOCK_BOOKS.copy()
        
        # Aplicar filtros
        if genre_filter:
            if genre_filter == 'tempestade':
                books = [b for b in books if b['genre'] in ['mistério', 'distopia']]
            elif genre_filter == 'primavera':
                books = [b for b in books if b['genre'] == 'romance']
            elif genre_filter == 'neblina':
                books = [b for b in books if b['genre'] == 'mistério']
            else:
                books = [b for b in books if b['genre'] == genre_filter]
        
        if status_filter:
            books = [b for b in books if b['status'] == status_filter]
        
        return jsonify({
            'success': True,
            'books': books
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Retorna detalhes de um livro específico"""
    try:
        book = next((b for b in MOCK_BOOKS if b['id'] == book_id), None)
        
        if not book:
            return jsonify({
                'success': False,
                'error': 'Livro não encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'book': book
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/books/<int:book_id>/content', methods=['GET'])
def get_book_content(book_id):
    """Retorna o conteúdo completo de um livro para leitura"""
    try:
        book = next((b for b in MOCK_BOOKS if b['id'] == book_id), None)
        
        if not book:
            return jsonify({
                'success': False,
                'error': 'Livro não encontrado'
            }), 404
        
        # Simular conteúdo por capítulos
        chapters = []
        for i in range(1, book['chapters'] + 1):
            chapters.append({
                'number': i,
                'title': f'Capítulo {i}',
                'content': f'{book["content"]} [Conteúdo do capítulo {i} continua...]',
                'interactive_elements': book.get('interactive_elements', {}),
                'ar_markers': book.get('ar_markers', {})
            })
        
        return jsonify({
            'success': True,
            'book_id': book_id,
            'title': book['title'],
            'author': book['author'],
            'chapters': chapters
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/user/progress', methods=['GET'])
def get_user_progress():
    """Retorna o progresso do usuário"""
    try:
        return jsonify({
            'success': True,
            'progress': MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/user/progress', methods=['POST'])
def update_user_progress():
    """Atualiza o progresso do usuário"""
    try:
        data = request.get_json()
        
        # Atualizar progresso mock (em produção, salvaria no banco)
        if 'orvalho' in data:
            MOCK_USER_PROGRESS['orvalho'] += data['orvalho']
        
        if 'reading_time' in data:
            MOCK_USER_PROGRESS['total_reading_time'] += data['reading_time']
        
        if 'achievement' in data:
            if data['achievement'] not in MOCK_USER_PROGRESS['achievements']:
                MOCK_USER_PROGRESS['achievements'].append(data['achievement'])
        
        return jsonify({
            'success': True,
            'progress': MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/books/<int:book_id>/progress', methods=['POST'])
def update_book_progress():
    """Atualiza o progresso de leitura de um livro"""
    try:
        data = request.get_json()
        book_id = int(book_id)
        
        # Encontrar o livro
        book = next((b for b in MOCK_BOOKS if b['id'] == book_id), None)
        if not book:
            return jsonify({
                'success': False,
                'error': 'Livro não encontrado'
            }), 404
        
        # Atualizar progresso
        if 'progress' in data:
            book['progress'] = min(100, max(0, data['progress']))
            
            # Atualizar status baseado no progresso
            if book['progress'] == 0:
                book['status'] = 'unread'
            elif book['progress'] == 100:
                book['status'] = 'completed'
                # Adicionar XP por completar livro
                MOCK_USER_PROGRESS['orvalho'] += 100
                MOCK_USER_PROGRESS['total_books_read'] += 1
            else:
                book['status'] = 'reading'
        
        return jsonify({
            'success': True,
            'book': book,
            'user_progress': MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/reading-session', methods=['POST'])
def start_reading_session():
    """Inicia uma sessão de leitura"""
    try:
        data = request.get_json()
        
        session = {
            'id': 1,
            'user_id': data.get('user_id', 'default_user'),
            'book_id': data.get('book_id'),
            'start_time': datetime.now().isoformat(),
            'orvalho_earned': 0,
            'interactions': []
        }
        
        return jsonify({
            'success': True,
            'session': session
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/reading-session/<int:session_id>/end', methods=['POST'])
def end_reading_session(session_id):
    """Finaliza uma sessão de leitura"""
    try:
        data = request.get_json()
        
        # Calcular XP baseado no tempo de leitura
        reading_time = data.get('reading_time', 0)  # em minutos
        pages_read = data.get('pages_read', 0)
        interactions = data.get('interactions', [])
        
        orvalho_earned = (reading_time * 2) + (pages_read * 5) + (len(interactions) * 3)
        
        # Atualizar progresso do usuário
        MOCK_USER_PROGRESS['orvalho'] += orvalho_earned
        MOCK_USER_PROGRESS['total_reading_time'] += reading_time
        
        session = {
            'id': session_id,
            'end_time': datetime.now().isoformat(),
            'reading_time': reading_time,
            'pages_read': pages_read,
            'orvalho_earned': orvalho_earned,
            'interactions': interactions
        }
        
        return jsonify({
            'success': True,
            'session': session,
            'user_progress': MOCK_USER_PROGRESS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@books_bp.route('/achievements', methods=['GET'])
def get_achievements():
    """Retorna lista de conquistas disponíveis"""
    try:
        achievements = [
            {
                'id': 'explorador_mundos',
                'name': 'Explorador de Mundos',
                'description': 'Leia 10 livros de fantasia',
                'icon': '🌍',
                'requirement': 'fantasy_books_10',
                'unlocked': True
            },
            {
                'id': 'leitor_dedicado',
                'name': 'Leitor Dedicado',
                'description': 'Leia por 100 horas',
                'icon': '📚',
                'requirement': 'reading_time_6000',
                'unlocked': True
            },
            {
                'id': 'detetive_literario',
                'name': 'Detetive Literário',
                'description': 'Complete 5 livros de mistério',
                'icon': '🔍',
                'requirement': 'mystery_books_5',
                'unlocked': True
            },
            {
                'id': 'jardineiro_historias',
                'name': 'Jardineiro de Histórias',
                'description': 'Complete 3 séries de livros',
                'icon': '🌱',
                'requirement': 'series_3',
                'unlocked': False
            },
            {
                'id': 'mestre_ra',
                'name': 'Mestre da Realidade Aumentada',
                'description': 'Use RA em 20 cenas diferentes',
                'icon': '🕶️',
                'requirement': 'ar_scenes_20',
                'unlocked': False
            }
        ]
        
        return jsonify({
            'success': True,
            'achievements': achievements
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

