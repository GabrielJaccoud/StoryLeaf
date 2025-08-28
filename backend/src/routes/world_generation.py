"""
API de Geração de Mundos - StoryLeaf 2.0
Integração com modelos generativos de mundo (Genie-3 e similares)
"""

from flask import Blueprint, request, jsonify
import json
import time
import uuid
from datetime import datetime
import os

world_generation_bp = Blueprint('world_generation', __name__)

# Simulação de dados de mundos gerados (em produção, seria integração com Genie-3)
SIMULATED_WORLDS = {
    "alice_wonderland": {
        "id": "alice_wonderland",
        "title": "Alice no País das Maravilhas",
        "description": "Um mundo mágico cheio de criaturas fantásticas e paisagens impossíveis",
        "environment_type": "fantasy_magical",
        "resolution": "720p",
        "fps": 24,
        "duration_minutes": 5,
        "interactive_elements": [
            {"type": "character", "name": "Gato de Cheshire", "position": [10, 5, 2]},
            {"type": "object", "name": "Mesa de Chá", "position": [15, 0, 8]},
            {"type": "portal", "name": "Toca do Coelho", "position": [0, 0, 0]}
        ],
        "physics_properties": {
            "gravity": 0.8,  # Gravidade reduzida para efeito mágico
            "wind_strength": 0.3,
            "lighting": "magical_twilight"
        },
        "audio_cues": [
            {"trigger": "character_interaction", "sound": "magical_chime"},
            {"trigger": "environment_change", "sound": "mystical_wind"}
        ]
    },
    "treasure_island": {
        "id": "treasure_island",
        "title": "A Ilha do Tesouro",
        "description": "Uma ilha tropical com praias douradas, cavernas misteriosas e navios piratas",
        "environment_type": "adventure_tropical",
        "resolution": "720p",
        "fps": 24,
        "duration_minutes": 5,
        "interactive_elements": [
            {"type": "character", "name": "Long John Silver", "position": [20, 0, 15]},
            {"type": "object", "name": "Baú do Tesouro", "position": [25, 2, 30]},
            {"type": "vehicle", "name": "Navio Hispaniola", "position": [0, 0, 50]}
        ],
        "physics_properties": {
            "gravity": 1.0,
            "wind_strength": 0.5,
            "lighting": "tropical_sunset"
        },
        "audio_cues": [
            {"trigger": "ocean_waves", "sound": "gentle_waves"},
            {"trigger": "pirate_encounter", "sound": "adventure_theme"}
        ]
    }
}

@world_generation_bp.route('/api/worlds/generate', methods=['POST'])
def generate_world():
    """
    Gera um novo mundo baseado em prompt de texto ou história
    """
    try:
        data = request.get_json()
        
        # Validação de entrada
        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400
        
        prompt = data.get('prompt', '')
        story_id = data.get('story_id', '')
        world_type = data.get('world_type', 'fantasy')
        
        if not prompt and not story_id:
            return jsonify({"error": "Prompt ou story_id deve ser fornecido"}), 400
        
        # Simulação de processamento (em produção, seria chamada para Genie-3)
        world_id = str(uuid.uuid4())
        
        # Análise do prompt para determinar características do mundo
        world_characteristics = analyze_prompt(prompt)
        
        # Geração simulada do mundo
        generated_world = {
            "id": world_id,
            "prompt": prompt,
            "story_id": story_id,
            "status": "generating",
            "progress": 0,
            "estimated_completion": 30,  # segundos
            "created_at": datetime.now().isoformat(),
            "characteristics": world_characteristics
        }
        
        # Em produção, aqui seria iniciado o processo assíncrono com Genie-3
        # Por agora, retornamos um mundo simulado
        return jsonify({
            "success": True,
            "world_id": world_id,
            "status": "initiated",
            "message": "Geração de mundo iniciada. Use /api/worlds/status/{world_id} para acompanhar o progresso."
        }), 202
        
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

@world_generation_bp.route('/api/worlds/status/<world_id>', methods=['GET'])
def get_world_status(world_id):
    """
    Verifica o status de geração de um mundo
    """
    try:
        # Simulação de progresso (em produção, consultaria status real do Genie-3)
        progress_simulation = {
            "id": world_id,
            "status": "completed",
            "progress": 100,
            "world_data": get_simulated_world_data(world_id),
            "message": "Mundo gerado com sucesso!"
        }
        
        return jsonify(progress_simulation), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao consultar status: {str(e)}"}), 500

@world_generation_bp.route('/api/worlds/<world_id>', methods=['GET'])
def get_world_data(world_id):
    """
    Retorna os dados completos de um mundo gerado
    """
    try:
        # Busca mundo simulado ou retorna dados padrão
        if world_id in SIMULATED_WORLDS:
            world_data = SIMULATED_WORLDS[world_id]
        else:
            world_data = get_simulated_world_data(world_id)
        
        return jsonify({
            "success": True,
            "world": world_data
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao buscar mundo: {str(e)}"}), 500

@world_generation_bp.route('/api/worlds/<world_id>/interact', methods=['POST'])
def interact_with_world(world_id):
    """
    Processa interações do usuário com o mundo (navegação, prompts, ações)
    """
    try:
        data = request.get_json()
        
        interaction_type = data.get('type', '')
        interaction_data = data.get('data', {})
        
        # Simulação de processamento de interação
        response = process_world_interaction(world_id, interaction_type, interaction_data)
        
        return jsonify({
            "success": True,
            "interaction_id": str(uuid.uuid4()),
            "response": response,
            "timestamp": datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro na interação: {str(e)}"}), 500

@world_generation_bp.route('/api/worlds/list', methods=['GET'])
def list_available_worlds():
    """
    Lista mundos disponíveis ou gerados pelo usuário
    """
    try:
        # Em produção, consultaria banco de dados do usuário
        worlds_list = []
        for world_id, world_data in SIMULATED_WORLDS.items():
            worlds_list.append({
                "id": world_id,
                "title": world_data["title"],
                "description": world_data["description"],
                "environment_type": world_data["environment_type"],
                "thumbnail": f"/api/worlds/{world_id}/thumbnail"
            })
        
        return jsonify({
            "success": True,
            "worlds": worlds_list,
            "total": len(worlds_list)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro ao listar mundos: {str(e)}"}), 500

def analyze_prompt(prompt):
    """
    Analisa o prompt para determinar características do mundo a ser gerado
    """
    characteristics = {
        "genre": "fantasy",
        "mood": "neutral",
        "complexity": "medium",
        "interactive_level": "high",
        "visual_style": "realistic"
    }
    
    # Análise simples baseada em palavras-chave
    prompt_lower = prompt.lower()
    
    if any(word in prompt_lower for word in ["mágico", "fantasia", "dragão", "fada"]):
        characteristics["genre"] = "fantasy"
        characteristics["visual_style"] = "magical"
    elif any(word in prompt_lower for word in ["pirata", "aventura", "tesouro", "ilha"]):
        characteristics["genre"] = "adventure"
        characteristics["visual_style"] = "cinematic"
    elif any(word in prompt_lower for word in ["científico", "futuro", "robô", "espaço"]):
        characteristics["genre"] = "sci-fi"
        characteristics["visual_style"] = "futuristic"
    
    if any(word in prompt_lower for word in ["sombrio", "terror", "medo", "escuro"]):
        characteristics["mood"] = "dark"
    elif any(word in prompt_lower for word in ["alegre", "colorido", "divertido", "feliz"]):
        characteristics["mood"] = "cheerful"
    
    return characteristics

def get_simulated_world_data(world_id):
    """
    Retorna dados simulados de um mundo (substitui integração real com Genie-3)
    """
    return {
        "id": world_id,
        "title": "Mundo Gerado",
        "description": "Um mundo único criado pela Árvore da Vida AI",
        "environment_type": "generated",
        "resolution": "720p",
        "fps": 24,
        "duration_minutes": 5,
        "interactive_elements": [
            {"type": "character", "name": "Guia Místico", "position": [0, 0, 5]},
            {"type": "object", "name": "Portal de Retorno", "position": [10, 0, 10]}
        ],
        "physics_properties": {
            "gravity": 1.0,
            "wind_strength": 0.2,
            "lighting": "dynamic"
        },
        "audio_cues": [
            {"trigger": "world_entry", "sound": "mystical_welcome"},
            {"trigger": "exploration", "sound": "ambient_nature"}
        ],
        "generated_at": datetime.now().isoformat()
    }

def process_world_interaction(world_id, interaction_type, interaction_data):
    """
    Processa diferentes tipos de interação com o mundo
    """
    responses = {
        "navigation": {
            "message": "Você se move pelo mundo mágico...",
            "new_position": interaction_data.get("target_position", [0, 0, 0]),
            "discovered_elements": ["Árvore Ancestral", "Riacho Cristalino"]
        },
        "prompt": {
            "message": f"A Árvore da Vida AI responde ao seu desejo: '{interaction_data.get('prompt', '')}'",
            "world_changes": ["O céu muda de cor", "Flores brotam no chão"],
            "new_elements": ["Ponte de Luz", "Borboletas Luminosas"]
        },
        "character_interaction": {
            "message": "O personagem responde à sua presença...",
            "dialogue": "Bem-vindo, viajante! Este mundo aguardava sua chegada.",
            "quest_offered": "Encontre as três Sementes da Sabedoria"
        }
    }
    
    return responses.get(interaction_type, {
        "message": "Interação não reconhecida",
        "suggestion": "Tente navegar, usar um prompt ou interagir com personagens"
    })

