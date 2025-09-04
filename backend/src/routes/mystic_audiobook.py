"""
Módulo de Audiolivro Místico - StoryLeaf 2.0
Combina narração de alta qualidade com trilhas sonoras terapêuticas
"""

from flask import Blueprint, request, jsonify, send_file
import json
import time
import uuid
from datetime import datetime
import os
import tempfile
import subprocess

mystic_audiobook_bp = Blueprint('mystic_audiobook', __name__)

# Diretório onde estão os livros processados
PROCESSED_BOOKS_DIR = '/home/ubuntu/StoryLeaf/processed_books'

# Configurações de frequências terapêuticas
HEALING_FREQUENCIES = {
    "174": {"name": "Alívio da Dor", "description": "Frequência para redução da dor e tensão"},
    "285": {"name": "Regeneração", "description": "Promove cura e regeneração dos tecidos"},
    "396": {"name": "Liberação do Medo", "description": "Liberta culpa, medo e trauma"},
    "417": {"name": "Mudança Positiva", "description": "Facilita mudanças e remove energia negativa"},
    "432": {"name": "Harmonia Universal", "description": "Frequência natural do universo, promove paz"},
    "528": {"name": "Transformação e Amor", "description": "Frequência do amor e transformação do DNA"},
    "639": {"name": "Relacionamentos", "description": "Harmoniza relacionamentos e comunicação"},
    "741": {"name": "Despertar Intuitivo", "description": "Desperta intuição e expressão criativa"},
    "852": {"name": "Retorno à Ordem Espiritual", "description": "Conecta com a ordem espiritual"},
    "963": {"name": "Conexão Divina", "description": "Ativa a glândula pineal e conexão divina"}
}

# Tipos de trilha sonora disponíveis
SOUNDTRACK_TYPES = {
    "spiritual": {
        "name": "Espiritual",
        "description": "Tons contemplativos e transcendentais",
        "base_frequency": "432",
        "instruments": ["tibetan_bowls", "crystal_singing", "nature_sounds"]
    },
    "children": {
        "name": "Infantil",
        "description": "Melodias suaves e reconfortantes para crianças",
        "base_frequency": "528",
        "instruments": ["soft_piano", "gentle_strings", "wind_chimes"]
    },
    "adventure": {
        "name": "Aventura",
        "description": "Trilhas épicas e inspiradoras",
        "base_frequency": "741",
        "instruments": ["orchestral", "ethnic_percussion", "ambient_pads"]
    },
    "suspense": {
        "name": "Suspense",
        "description": "Atmosferas tensas e misteriosas",
        "base_frequency": "396",
        "instruments": ["dark_ambient", "subtle_percussion", "atmospheric_drones"]
    },
    "romance": {
        "name": "Romance",
        "description": "Melodias românticas e emotivas",
        "base_frequency": "639",
        "instruments": ["soft_strings", "piano", "gentle_flute"]
    },
    "healing": {
        "name": "Cura",
        "description": "Frequências específicas para cura e bem-estar",
        "base_frequency": "285",
        "instruments": ["binaural_beats", "nature_sounds", "crystal_bowls"]
    }
}

# Vozes disponíveis
VOICE_OPTIONS = {
    "male_narrator": {
        "name": "Narrador Masculino",
        "description": "Voz masculina profunda e envolvente",
        "language": "pt-BR",
        "style": "narrative"
    },
    "female_narrator": {
        "name": "Narradora Feminina",
        "description": "Voz feminina suave e expressiva",
        "language": "pt-BR",
        "style": "narrative"
    },
    "mystic_voice": {
        "name": "Voz Mística",
        "description": "Voz etérea com efeitos especiais",
        "language": "pt-BR",
        "style": "mystical"
    },
    "child_friendly": {
        "name": "Amigável para Crianças",
        "description": "Voz alegre e animada para histórias infantis",
        "language": "pt-BR",
        "style": "cheerful"
    }
}

@mystic_audiobook_bp.route('/api/audiobook/generate', methods=['POST'])
def generate_audiobook():
    """
    Gera um audiolivro místico com narração e trilha sonora personalizada
    """
    try:
        data = request.get_json()
        
        # Validação de entrada
        required_fields = ['text', 'voice_type', 'soundtrack_type']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Campo obrigatório ausente: {field}"}), 400
        
        text = data['text']
        voice_type = data['voice_type']
        soundtrack_type = data['soundtrack_type']
        healing_frequency = data.get('healing_frequency', '432')
        chapter_title = data.get('chapter_title', 'Capítulo')
        
        # Validações
        if voice_type not in VOICE_OPTIONS:
            return jsonify({"error": "Tipo de voz inválido"}), 400
        
        if soundtrack_type not in SOUNDTRACK_TYPES:
            return jsonify({"error": "Tipo de trilha sonora inválido"}), 400
        
        if healing_frequency not in HEALING_FREQUENCIES:
            return jsonify({"error": "Frequência de cura inválida"}), 400
        
        # Gera ID único para o audiolivro
        audiobook_id = str(uuid.uuid4())
        
        # Processa a geração do audiolivro
        generation_result = process_audiobook_generation(
            audiobook_id, text, voice_type, soundtrack_type, healing_frequency, chapter_title
        )
        
        return jsonify({
            "success": True,
            "audiobook_id": audiobook_id,
            "status": "processing",
            "estimated_duration": generation_result["estimated_duration"],
            "healing_frequency": healing_frequency,
            "frequency_benefits": HEALING_FREQUENCIES[healing_frequency],
            "message": "Audiolivro místico sendo gerado. Use /api/audiobook/status/{audiobook_id} para acompanhar o progresso."
        }), 202
        
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/status/<audiobook_id>', methods=['GET'])
def get_audiobook_status(audiobook_id):
    """
    Verifica o status de geração de um audiolivro
    """
    try:
        # Simulação de progresso (em produção, consultaria status real)
        status_data = {
            "audiobook_id": audiobook_id,
            "status": "completed",
            "progress": 100,
            "current_step": "Finalização",
            "steps_completed": [
                "Análise do texto",
                "Geração da narração",
                "Criação da trilha sonora",
                "Sincronização de frequências",
                "Mixagem final"
            ],
            "audio_url": f"/api/audiobook/download/{audiobook_id}",
            "duration_seconds": 1800,  # 30 minutos
            "file_size_mb": 45.2,
            "quality": "320kbps",
            "format": "mp3"
        }
        
        return jsonify({
            "success": True,
            "audiobook": status_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao consultar status: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/download/<audiobook_id>', methods=['GET'])
def download_audiobook(audiobook_id):
    """
    Faz download do audiolivro gerado
    """
    try:
        # Em produção, retornaria o arquivo real
        # Por agora, retorna um arquivo de demonstração
        demo_audio_path = generate_demo_audio(audiobook_id)
        
        return send_file(
            demo_audio_path,
            as_attachment=True,
            download_name=f"storyleaf_audiobook_{audiobook_id}.mp3",
            mimetype="audio/mpeg"
        )
        
    except Exception as e:
        return jsonify({"error": f"Erro no download: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/preview', methods=['POST'])
def generate_preview():
    """
    Gera uma prévia curta do audiolivro para teste
    """
    try:
        data = request.get_json()
        
        text_preview = data.get('text', 'Esta é uma prévia do seu audiolivro místico.')[:200]
        voice_type = data.get('voice_type', 'female_narrator')
        soundtrack_type = data.get('soundtrack_type', 'spiritual')
        healing_frequency = data.get('healing_frequency', '432')
        
        # Gera prévia (simulação)
        preview_result = generate_audio_preview(text_preview, voice_type, soundtrack_type, healing_frequency)
        
        return jsonify({
            "success": True,
            "preview_url": preview_result["url"],
            "duration_seconds": preview_result["duration"],
            "voice_info": VOICE_OPTIONS[voice_type],
            "soundtrack_info": SOUNDTRACK_TYPES[soundtrack_type],
            "frequency_info": HEALING_FREQUENCIES[healing_frequency]
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro na geração de prévia: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/voices', methods=['GET'])
def list_voices():
    """
    Lista todas as vozes disponíveis
    """
    return jsonify({
        "success": True,
        "voices": VOICE_OPTIONS
    }), 200

@mystic_audiobook_bp.route('/api/audiobook/soundtracks', methods=['GET'])
def list_soundtracks():
    """
    Lista todos os tipos de trilha sonora disponíveis
    """
    return jsonify({
        "success": True,
        "soundtracks": SOUNDTRACK_TYPES
    }), 200

@mystic_audiobook_bp.route('/api/audiobook/frequencies', methods=['GET'])
def list_healing_frequencies():
    """
    Lista todas as frequências de cura disponíveis
    """
    return jsonify({
        "success": True,
        "frequencies": HEALING_FREQUENCIES
    }), 200

@mystic_audiobook_bp.route('/api/audiobook/library', methods=['GET'])
def get_audiobook_library():
    """
    Retorna a biblioteca de audiolivros do usuário
    """
    try:
        # Simulação de biblioteca do usuário
        library = [
            {
                "id": "alice_audiobook",
                "title": "Alice no País das Maravilhas - Versão Mística",
                "author": "Lewis Carroll",
                "narrator": "Narradora Feminina",
                "soundtrack": "Espiritual",
                "healing_frequency": "432",
                "duration_minutes": 45,
                "created_at": "2025-08-27T10:30:00Z",
                "download_count": 3,
                "rating": 4.8
            },
            {
                "id": "treasure_audiobook",
                "title": "A Ilha do Tesouro - Aventura Épica",
                "author": "Robert Louis Stevenson",
                "narrator": "Narrador Masculino",
                "soundtrack": "Aventura",
                "healing_frequency": "741",
                "duration_minutes": 60,
                "created_at": "2025-08-26T15:20:00Z",
                "download_count": 1,
                "rating": 4.9
            }
        ]
        
        return jsonify({
            "success": True,
            "library": library,
            "total_audiobooks": len(library),
            "total_listening_time": sum(book["duration_minutes"] for book in library)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao buscar biblioteca: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/analytics', methods=['GET'])
def get_audiobook_analytics():
    """
    Retorna análises e estatísticas dos audiolivros
    """
    try:
        analytics = {
            "listening_habits": {
                "preferred_voice": "female_narrator",
                "preferred_soundtrack": "spiritual",
                "preferred_frequency": "432",
                "average_session_duration": 25,
                "total_listening_hours": 12.5
            },
            "healing_impact": {
                "stress_reduction": 78,
                "sleep_quality_improvement": 65,
                "focus_enhancement": 82,
                "emotional_balance": 71
            },
            "frequency_usage": {
                "432": 45,  # porcentagem de uso
                "528": 25,
                "741": 15,
                "396": 10,
                "others": 5
            },
            "recommendations": [
                "Baseado em seus hábitos, recomendamos mais audiolivros com frequência 432Hz",
                "Experimente trilhas sonoras de 'Cura' para melhor relaxamento",
                "Considere sessões mais longas para maximizar os benefícios terapêuticos"
            ]
        }
        
        return jsonify({
            "success": True,
            "analytics": analytics,
            "generated_at": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao gerar análises: {str(e)}"}), 500

# Funções auxiliares

def process_audiobook_generation(audiobook_id, text, voice_type, soundtrack_type, healing_frequency, chapter_title):
    """
    Processa a geração completa do audiolivro místico
    """
    # Calcula duração estimada baseada no texto
    words_count = len(text.split())
    estimated_duration = (words_count / 150) * 60  # 150 palavras por minuto
    
    # Em produção, aqui seria iniciado o processo real de geração
    # 1. Análise do texto e preparação
    # 2. Geração da narração com a voz selecionada
    # 3. Criação da trilha sonora com a frequência específica
    # 4. Sincronização e mixagem
    # 5. Aplicação de efeitos de cura
    
    return {
        "estimated_duration": estimated_duration,
        "processing_steps": [
            "Análise do texto",
            "Geração da narração",
            "Criação da trilha sonora",
            "Sincronização de frequências",
            "Mixagem final"
        ]
    }

def generate_demo_audio(audiobook_id):
    """
    Gera um arquivo de áudio de demonstração
    """
    # Em produção, retornaria o arquivo real gerado
    # Por agora, cria um arquivo temporário de demonstração
    
    temp_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
    
    # Simula criação de arquivo de áudio (em produção seria o arquivo real)
    with open(temp_file.name, 'wb') as f:
        # Escreve cabeçalho MP3 básico (apenas para demonstração)
        f.write(b'\xff\xfb\x90\x00')  # Cabeçalho MP3 simplificado
        f.write(b'\x00' * 1024)  # Dados de áudio simulados
    
    return temp_file.name

def generate_audio_preview(text, voice_type, soundtrack_type, healing_frequency):
    """
    Gera uma prévia de áudio curta
    """
    # Simulação de geração de prévia
    preview_id = str(uuid.uuid4())
    
    return {
        "url": f"/api/audiobook/preview/{preview_id}",
        "duration": 15  # 15 segundos de prévia
    }

def apply_healing_frequency(audio_data, frequency):
    """
    Aplica frequência de cura específica ao áudio
    """
    # Em produção, aplicaria processamento de áudio real
    # para incorporar a frequência terapêutica
    pass

def create_mystical_soundtrack(soundtrack_type, healing_frequency, duration):
    """
    Cria trilha sonora mística com frequência específica
    """
    # Em produção, geraria trilha sonora real usando
    # síntese de áudio e frequências terapêuticas
    pass

def mix_narration_with_soundtrack(narration_path, soundtrack_path, output_path):
    """
    Mixa narração com trilha sonora
    """
    # Em produção, usaria ferramentas como FFmpeg
    # para mixar narração e trilha sonora
    pass



@mystic_audiobook_bp.route('/api/audiobook/books/<book_id>/generate', methods=['POST'])
def generate_book_audiobook(book_id):
    """
    Gera audiobook místico para um livro específico processado
    """
    try:
        data = request.get_json()
        
        # Verifica se o livro existe
        book_file = os.path.join(PROCESSED_BOOKS_DIR, f"{book_id}.md")
        if not os.path.exists(book_file):
            return jsonify({"error": "Livro não encontrado"}), 404
        
        # Carrega o conteúdo do livro
        with open(book_file, 'r', encoding='utf-8') as f:
            book_content = f.read()
        
        # Parâmetros de configuração
        voice_type = data.get('voice_type', 'female_voice')
        healing_frequency = data.get('healing_frequency', '432')
        soundtrack_type = data.get('soundtrack_type', 'spiritual')
        section_id = data.get('section_id', None)  # Para gerar seção específica
        
        # Divide o conteúdo em seções se necessário
        if section_id:
            sections = split_book_into_sections(book_content)
            if section_id > len(sections):
                return jsonify({"error": "Seção não encontrada"}), 404
            content_to_generate = sections[section_id - 1]
        else:
            content_to_generate = book_content[:2000]  # Limita para demonstração
        
        # Gera o audiobook
        audiobook_id = str(uuid.uuid4())
        
        # Simulação de geração (em produção, usaria TTS real)
        audiobook_data = {
            "id": audiobook_id,
            "book_id": book_id,
            "title": format_book_title(book_id),
            "voice_type": voice_type,
            "healing_frequency": healing_frequency,
            "soundtrack_type": soundtrack_type,
            "section_id": section_id,
            "status": "generating",
            "progress": 0,
            "estimated_completion": 60,  # segundos
            "created_at": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "audiobook_id": audiobook_id,
            "status": "initiated",
            "message": "Geração de audiobook iniciada. Use /api/audiobook/status/{audiobook_id} para acompanhar."
        }), 202
        
    except Exception as e:
        return jsonify({"error": f"Erro na geração: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/books/<book_id>/sections', methods=['GET'])
def get_book_sections_for_audio(book_id):
    """
    Retorna as seções do livro disponíveis para geração de audiobook
    """
    try:
        book_file = os.path.join(PROCESSED_BOOKS_DIR, f"{book_id}.md")
        if not os.path.exists(book_file):
            return jsonify({"error": "Livro não encontrado"}), 404
        
        with open(book_file, 'r', encoding='utf-8') as f:
            book_content = f.read()
        
        sections = split_book_into_sections(book_content)
        
        sections_info = []
        for i, section in enumerate(sections, 1):
            sections_info.append({
                "id": i,
                "title": f"Seção {i}",
                "word_count": len(section.split()),
                "estimated_duration": estimate_audio_duration(section),
                "preview": section[:100] + "..."
            })
        
        return jsonify({
            "success": True,
            "book_id": book_id,
            "title": format_book_title(book_id),
            "sections": sections_info,
            "total_sections": len(sections_info)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao carregar seções: {str(e)}"}), 500

@mystic_audiobook_bp.route('/api/audiobook/books/<book_id>/preview', methods=['POST'])
def generate_book_preview(book_id):
    """
    Gera prévia de audiobook para um livro específico
    """
    try:
        data = request.get_json()
        
        book_file = os.path.join(PROCESSED_BOOKS_DIR, f"{book_id}.md")
        if not os.path.exists(book_file):
            return jsonify({"error": "Livro não encontrado"}), 404
        
        with open(book_file, 'r', encoding='utf-8') as f:
            book_content = f.read()
        
        # Pega apenas o início do livro para prévia
        preview_content = book_content[:500]  # Primeiras 500 caracteres
        
        voice_type = data.get('voice_type', 'female_voice')
        healing_frequency = data.get('healing_frequency', '432')
        
        # Gera prévia simulada
        preview_id = str(uuid.uuid4())
        
        return jsonify({
            "success": True,
            "preview_id": preview_id,
            "preview_url": f"/api/audiobook/preview/{preview_id}",
            "duration": 30,  # 30 segundos de prévia
            "voice_type": voice_type,
            "healing_frequency": healing_frequency,
            "book_title": format_book_title(book_id)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro na prévia: {str(e)}"}), 500

def split_book_into_sections(content):
    """
    Divide o conteúdo do livro em seções para audiobook
    """
    # Divide por parágrafos e agrupa em seções de ~1000 palavras
    paragraphs = content.split('\n\n')
    sections = []
    current_section = []
    words_per_section = 1000
    
    current_word_count = 0
    
    for paragraph in paragraphs:
        paragraph_words = len(paragraph.split())
        
        if current_word_count + paragraph_words > words_per_section and current_section:
            sections.append('\n\n'.join(current_section))
            current_section = [paragraph]
            current_word_count = paragraph_words
        else:
            current_section.append(paragraph)
            current_word_count += paragraph_words
    
    # Adiciona a última seção
    if current_section:
        sections.append('\n\n'.join(current_section))
    
    return sections

def estimate_audio_duration(text):
    """
    Estima duração do áudio baseado no texto (assumindo 150 palavras por minuto)
    """
    word_count = len(text.split())
    duration_minutes = max(1, word_count / 150)
    return round(duration_minutes, 1)

def format_book_title(book_id):
    """
    Formata o ID do livro em um título legível
    """
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
    
    return title_mapping.get(book_id, book_id.replace('_', ' ').replace('(', ' - ').replace(')', ''))

