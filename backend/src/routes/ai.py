from flask import Blueprint, request, jsonify
import os
import openai
from src.models.story import Story, Character

ai_bp = Blueprint('ai', __name__)

# Configurar OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
openai.api_base = os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1')

@ai_bp.route('/ai/generate-seed', methods=['POST'])
def generate_story_seed():
    """Gera uma semente de história baseada em parâmetros"""
    try:
        data = request.get_json()
        
        theme = data.get('theme', 'aventura')
        mood = data.get('mood', 'neutro')
        audience = data.get('audience', 'geral')
        genre = data.get('genre', 'ficção')
        
        prompt = f"""
        Como um assistente criativo especializado em storytelling, gere uma semente de história original e envolvente com os seguintes parâmetros:
        
        - Tema: {theme}
        - Tom/Humor: {mood}
        - Público-alvo: {audience}
        - Gênero: {genre}
        
        A semente deve incluir:
        1. Uma premissa central intrigante
        2. Um protagonista interessante com motivação clara
        3. Um conflito principal
        4. Um elemento único que torna a história especial
        
        Responda em formato JSON com as chaves: "premise", "protagonist", "conflict", "unique_element", "suggested_title"
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é um assistente criativo especializado em gerar ideias para histórias. Sempre responda em português brasileiro e em formato JSON válido."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.8
            )
            
            content = response.choices[0].message.content
            
            # Tentar parsear como JSON
            import json
            try:
                seed_data = json.loads(content)
            except json.JSONDecodeError:
                # Se não conseguir parsear, criar estrutura manual
                seed_data = {
                    "premise": "Uma história envolvente sobre descoberta e crescimento pessoal.",
                    "protagonist": "Um jovem corajoso em busca de seu destino.",
                    "conflict": "Obstáculos internos e externos que testam a determinação.",
                    "unique_element": "Uma perspectiva única sobre a jornada do herói.",
                    "suggested_title": "A Jornada Inesperada"
                }
            
            return jsonify({
                'success': True,
                'seed': seed_data
            })
            
        except Exception as openai_error:
            # Fallback se a API da OpenAI falhar
            fallback_seeds = {
                'aventura': {
                    "premise": "Um jovem descobre um mapa antigo que leva a um tesouro perdido, mas cada pista revela segredos sobre sua própria família.",
                    "protagonist": "Alex, um estudante de arqueologia de 22 anos, curioso e determinado, mas inexperiente em aventuras reais.",
                    "conflict": "Outros caçadores de tesouros perigosos estão na mesma trilha, e Alex deve superar seus medos e inexperiência.",
                    "unique_element": "O tesouro não é ouro ou joias, mas conhecimento ancestral que pode mudar o mundo.",
                    "suggested_title": "O Mapa das Memórias Perdidas"
                },
                'romance': {
                    "premise": "Dois rivais de infância se reencontram como adultos trabalhando no mesmo projeto, forçados a colaborar.",
                    "protagonist": "Marina, arquiteta talentosa de 28 anos, independente mas com dificuldades em confiar nas pessoas.",
                    "conflict": "Antigas mágoas e mal-entendidos do passado interferem na colaboração profissional e no crescente interesse romântico.",
                    "unique_element": "Eles se comunicam através de desenhos e plantas arquitetônicas antes de conseguirem conversar de verdade.",
                    "suggested_title": "Plantas do Coração"
                }
            }
            
            seed_data = fallback_seeds.get(theme, fallback_seeds['aventura'])
            
            return jsonify({
                'success': True,
                'seed': seed_data,
                'note': 'Gerado com sistema de fallback'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_bp.route('/ai/improve-text', methods=['POST'])
def improve_text():
    """Melhora um texto usando IA"""
    try:
        data = request.get_json()
        
        text = data.get('text', '')
        mode = data.get('mode', 'creative')  # creative, academic, corporate, social
        tone = data.get('tone', 'neutral')   # serious, poetic, persuasive, summarized
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Texto é obrigatório'
            }), 400
        
        # Definir prompts baseados no modo e tom
        mode_prompts = {
            'creative': 'Melhore este texto criativo, tornando-o mais envolvente e imaginativo',
            'academic': 'Melhore este texto acadêmico, tornando-o mais claro e bem estruturado',
            'corporate': 'Melhore este texto corporativo, tornando-o mais profissional e objetivo',
            'social': 'Melhore este texto para redes sociais, tornando-o mais atrativo e engajador'
        }
        
        tone_prompts = {
            'serious': 'com um tom sério e formal',
            'poetic': 'com um tom poético e lírico',
            'persuasive': 'com um tom persuasivo e convincente',
            'summarized': 'de forma mais concisa e resumida',
            'neutral': 'mantendo um tom equilibrado e natural'
        }
        
        prompt = f"""
        {mode_prompts.get(mode, mode_prompts['creative'])} {tone_prompts.get(tone, tone_prompts['neutral'])}.
        
        Mantenha o significado original, mas melhore:
        - Clareza e fluidez
        - Gramática e ortografia
        - Estrutura das frases
        - Vocabulário apropriado
        
        Texto original:
        {text}
        
        Responda apenas com o texto melhorado, sem explicações adicionais.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é um assistente de escrita especializado em melhorar textos em português brasileiro. Mantenha sempre o significado original."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            improved_text = response.choices[0].message.content.strip()
            
            return jsonify({
                'success': True,
                'original_text': text,
                'improved_text': improved_text,
                'mode': mode,
                'tone': tone
            })
            
        except Exception as openai_error:
            # Fallback simples
            return jsonify({
                'success': True,
                'original_text': text,
                'improved_text': text,  # Retorna o texto original se a IA falhar
                'mode': mode,
                'tone': tone,
                'note': 'Serviço de IA temporariamente indisponível'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_bp.route('/ai/generate-character', methods=['POST'])
def generate_character():
    """Gera um personagem usando IA"""
    try:
        data = request.get_json()
        
        role = data.get('role', 'supporting')  # protagonist, antagonist, supporting
        story_context = data.get('story_context', '')
        genre = data.get('genre', 'ficção')
        
        prompt = f"""
        Crie um personagem detalhado para uma história de {genre} com o papel de {role}.
        
        Contexto da história: {story_context}
        
        O personagem deve ter:
        1. Nome apropriado
        2. Descrição física básica
        3. Personalidade (3-5 traços principais)
        4. Motivação principal
        5. Medo ou fraqueza
        6. Habilidade especial ou talento
        
        Responda em formato JSON com as chaves: "name", "description", "personality_traits", "motivation", "fear", "special_ability"
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é um especialista em criação de personagens para histórias. Sempre responda em português brasileiro e em formato JSON válido."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.8
            )
            
            content = response.choices[0].message.content
            
            import json
            try:
                character_data = json.loads(content)
            except json.JSONDecodeError:
                # Fallback
                character_data = {
                    "name": "Personagem Misterioso",
                    "description": "Uma pessoa intrigante com olhos expressivos e presença marcante.",
                    "personality_traits": ["Corajoso", "Curioso", "Leal", "Impulsivo"],
                    "motivation": "Descobrir a verdade sobre seu passado",
                    "fear": "Perder as pessoas que ama",
                    "special_ability": "Intuição aguçada para ler as intenções das pessoas"
                }
            
            return jsonify({
                'success': True,
                'character': character_data
            })
            
        except Exception as openai_error:
            # Fallback characters
            fallback_characters = {
                'protagonist': {
                    "name": "Elena Cardoso",
                    "description": "Jovem de 25 anos, cabelos castanhos ondulados, olhos verdes determinados, altura média.",
                    "personality_traits": ["Determinada", "Empática", "Inteligente", "Teimosa", "Corajosa"],
                    "motivation": "Proteger sua família e descobrir seus verdadeiros poderes",
                    "fear": "Não ser forte o suficiente quando precisarem dela",
                    "special_ability": "Capacidade de sentir as emoções dos outros"
                },
                'antagonist': {
                    "name": "Dr. Marcus Veil",
                    "description": "Homem de 45 anos, cabelos grisalhos, olhos frios azul-acinzentados, porte elegante mas intimidador.",
                    "personality_traits": ["Manipulador", "Inteligente", "Ambicioso", "Calculista", "Carismático"],
                    "motivation": "Obter poder absoluto através do conhecimento proibido",
                    "fear": "Ser esquecido pela história",
                    "special_ability": "Capacidade de convencer qualquer pessoa com suas palavras"
                }
            }
            
            character_data = fallback_characters.get(role, fallback_characters['protagonist'])
            
            return jsonify({
                'success': True,
                'character': character_data,
                'note': 'Gerado com sistema de fallback'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_bp.route('/ai/continue-story', methods=['POST'])
def continue_story():
    """Continua uma história usando IA"""
    try:
        data = request.get_json()
        
        current_text = data.get('current_text', '')
        direction = data.get('direction', 'natural')  # natural, dramatic, romantic, action, mystery
        length = data.get('length', 'medium')  # short, medium, long
        
        if not current_text:
            return jsonify({
                'success': False,
                'error': 'Texto atual é obrigatório'
            }), 400
        
        length_tokens = {
            'short': 100,
            'medium': 200,
            'long': 300
        }
        
        direction_prompts = {
            'natural': 'Continue a história de forma natural e fluida',
            'dramatic': 'Continue a história aumentando a tensão dramática',
            'romantic': 'Continue a história desenvolvendo elementos românticos',
            'action': 'Continue a história com mais ação e movimento',
            'mystery': 'Continue a história aprofundando o mistério'
        }
        
        prompt = f"""
        {direction_prompts.get(direction, direction_prompts['natural'])}.
        
        Mantenha:
        - Consistência com o tom e estilo existente
        - Coerência com os personagens já estabelecidos
        - Fluidez narrativa
        
        Texto atual:
        {current_text}
        
        Continue a partir daqui:
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é um escritor especializado em continuar histórias de forma coerente e envolvente. Escreva sempre em português brasileiro."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=length_tokens.get(length, 200),
                temperature=0.8
            )
            
            continuation = response.choices[0].message.content.strip()
            
            return jsonify({
                'success': True,
                'continuation': continuation,
                'direction': direction,
                'length': length
            })
            
        except Exception as openai_error:
            return jsonify({
                'success': False,
                'error': 'Serviço de IA temporariamente indisponível',
                'note': str(openai_error)
            }), 503
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_bp.route('/ai/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """Analisa o sentimento de um texto"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Texto é obrigatório'
            }), 400
        
        # Análise simples de sentimento (pode ser melhorada com bibliotecas especializadas)
        positive_words = ['feliz', 'alegre', 'amor', 'esperança', 'sucesso', 'vitória', 'bom', 'ótimo', 'maravilhoso']
        negative_words = ['triste', 'raiva', 'medo', 'dor', 'fracasso', 'derrota', 'ruim', 'terrível', 'horrível']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = 'positive'
            confidence = min(0.9, 0.5 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            sentiment = 'negative'
            confidence = min(0.9, 0.5 + (negative_count - positive_count) * 0.1)
        else:
            sentiment = 'neutral'
            confidence = 0.5
        
        return jsonify({
            'success': True,
            'sentiment': sentiment,
            'confidence': confidence,
            'analysis': {
                'positive_indicators': positive_count,
                'negative_indicators': negative_count,
                'word_count': len(text.split())
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

