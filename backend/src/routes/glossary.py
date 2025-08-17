from flask import Blueprint, request, jsonify

glossary_bp = Blueprint("glossary", __name__)

MOCK_GLOSSARY = {
    "hobbit": {
        "definition": "Uma raça fictícia de seres pequenos, semelhantes a humanos, que vivem em tocas subterrâneas e são conhecidos por seu amor à paz, comida e conforto. Criados por J.R.R. Tolkien.",
        "illustration_url": "/assets/glossary/hobbit.png"
    },
    "Terra Média": {
        "definition": "Um continente fictício no universo de J.R.R. Tolkien, onde se passam as histórias de O Senhor dos Anéis e O Hobbit. É um mundo de fantasia com diversas raças e paisagens.",
        "illustration_url": "/assets/glossary/middle_earth.png"
    },
    "anel": {
        "definition": "Refere-se ao Um Anel de Poder, um artefato mágico central na mitologia de Tolkien, forjado pelo Senhor do Escuro Sauron para controlar os outros Anéis de Poder e dominar a Terra Média.",
        "illustration_url": "/assets/glossary/the_one_ring.png"
    },
    "Grande Irmão": {
        "definition": "A figura ditatorial e onipresente que governa a Oceania no romance '1984' de George Orwell. Ele é o líder do Partido e um símbolo do controle totalitário.",
        "illustration_url": "/assets/glossary/big_brother.png"
    },
    "Ministério da Verdade": {
        "definition": "Um dos quatro ministérios do governo da Oceania em '1984', responsável pela propaganda, reescrita da história e manipulação da informação para se adequar à ideologia do Partido.",
        "illustration_url": "/assets/glossary/ministry_of_truth.png"
    },
    "duplipensar": {
        "definition": "Um conceito em '1984' que descreve a capacidade de manter duas crenças contraditórias simultaneamente e aceitar ambas como verdadeiras, sem perceber a contradição.",
        "illustration_url": "/assets/glossary/doublethink.png"
    },
    "sociedade": {
        "definition": "No contexto de 'Orgulho e Preconceito', refere-se às complexas regras sociais, hierarquias e expectativas que governam as interações entre as classes alta e média na Inglaterra do século XIX.",
        "illustration_url": "/assets/glossary/society.png"
    },
    "casamento": {
        "definition": "Em 'Orgulho e Preconceito', o casamento é um tema central, frequentemente motivado por considerações sociais e financeiras, além do amor. É um meio de ascensão social para as mulheres da época.",
        "illustration_url": "/assets/glossary/marriage.png"
    },
    "fortuna": {
        "definition": "Em 'Orgulho e Preconceito', a fortuna refere-se à riqueza e propriedades, que eram cruciais para o status social e as perspectivas de casamento na sociedade da época.",
        "illustration_url": "/assets/glossary/fortune.png"
    },
    "abadia": {
        "definition": "Em 'O Nome da Rosa', a abadia é o cenário principal, um mosteiro medieval onde ocorrem assassinatos misteriosos. É um centro de conhecimento e poder religioso.",
        "illustration_url": "/assets/glossary/abbey.png"
    },
    "manuscritos": {
        "definition": "Em 'O Nome da Rosa', os manuscritos são livros antigos e valiosos, muitos deles únicos, guardados na biblioteca da abadia. Eles são o foco da investigação e a causa dos conflitos.",
        "illustration_url": "/assets/glossary/manuscripts.png"
    },
    "heresia": {
        "definition": "Em 'O Nome da Rosa', a heresia é um tema recorrente, referindo-se a crenças ou doutrinas que contradizem os ensinamentos oficiais da Igreja Católica. A inquisição é um elemento importante na trama.",
        "illustration_url": "/assets/glossary/heresy.png"
    },
    "especiaria": {
        "definition": "Em 'Duna', a especiaria (melange) é a substância mais valiosa do universo, encontrada apenas no planeta Arrakis. Ela prolonga a vida, expande a consciência e é essencial para a navegação espacial.",
        "illustration_url": "/assets/glossary/spice.png"
    },
    "Fremen": {
        "definition": "Em 'Duna', os Fremen são os habitantes nativos de Arrakis, adaptados à vida no deserto. São guerreiros ferozes e guardiões dos segredos do planeta, incluindo a especiaria.",
        "illustration_url": "/assets/glossary/fremen.png"
    },
    "Kwisatz Haderach": {
        "definition": "Em 'Duna', é um termo Bene Gesserit para um ser superdotado com habilidades mentais e precognitivas extraordinárias, capaz de 'ligar' o espaço e o tempo. Paul Atreides é o Kwisatz Haderach.",
        "illustration_url": "/assets/glossary/kwisatz_haderach.png"
    }
}

@glossary_bp.route("/glossary/<term>", methods=["GET"])
def get_glossary_term(term):
    term_lower = term.lower()
    if term_lower in MOCK_GLOSSARY:
        return jsonify({"success": True, "term": term_lower, "data": MOCK_GLOSSARY[term_lower]})
    else:
        return jsonify({"success": False, "message": "Termo não encontrado no glossário."}), 404


