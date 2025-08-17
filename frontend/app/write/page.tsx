'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Story {
  id?: number;
  title: string;
  content: string;
  genre: string;
  mood: string;
  target_audience: string;
  seed_idea: string;
  trunk_plot: string;
  ai_mode: string;
  ai_tone: string;
}

interface Character {
  id?: number;
  name: string;
  description: string;
  role: string;
  personality: any;
}

export default function WritePage() {
  const [story, setStory] = useState<Story>({
    title: '',
    content: '',
    genre: 'ficção',
    mood: 'neutro',
    target_audience: 'geral',
    seed_idea: '',
    trunk_plot: '',
    ai_mode: 'creative',
    ai_tone: 'neutral'
  });

  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<'seed' | 'write' | 'characters'>('seed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStoryId, setSavedStoryId] = useState<number | null>(null);

  // Gerar semente de história
  const generateSeed = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: story.genre,
          mood: story.mood,
          audience: story.target_audience,
          genre: story.genre
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStory(prev => ({
          ...prev,
          seed_idea: `${data.seed.premise}\n\nProtagonista: ${data.seed.protagonist}\n\nConflito: ${data.seed.conflict}\n\nElemento Único: ${data.seed.unique_element}`,
          title: data.seed.suggested_title || prev.title,
          trunk_plot: data.seed.premise
        }));
      }
    } catch (error) {
      console.error('Erro ao gerar semente:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Melhorar texto com IA
  const improveText = async () => {
    if (!story.content) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story.content,
          mode: story.ai_mode,
          tone: story.ai_tone
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStory(prev => ({
          ...prev,
          content: data.improved_text
        }));
      }
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Continuar história
  const continueStory = async () => {
    if (!story.content) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/continue-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_text: story.content,
          direction: 'natural',
          length: 'medium'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStory(prev => ({
          ...prev,
          content: prev.content + '\n\n' + data.continuation
        }));
      }
    } catch (error) {
      console.error('Erro ao continuar história:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Gerar personagem
  const generateCharacter = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'supporting',
          story_context: story.trunk_plot || story.seed_idea,
          genre: story.genre
        }),
      });

      const data = await response.json();
      if (data.success) {
        const newCharacter: Character = {
          name: data.character.name,
          description: data.character.description,
          role: 'supporting',
          personality: data.character.personality_traits
        };
        setCharacters(prev => [...prev, newCharacter]);
      }
    } catch (error) {
      console.error('Erro ao gerar personagem:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Salvar história
  const saveStory = async () => {
    setIsSaving(true);
    try {
      const method = savedStoryId ? 'PUT' : 'POST';
      const url = savedStoryId ? `/api/stories/${savedStoryId}` : '/api/stories';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(story),
      });

      const data = await response.json();
      if (data.success) {
        setSavedStoryId(data.story.id);
        alert('História salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar história:', error);
      alert('Erro ao salvar história');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🌿</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">StoryLeaf</h1>
              </Link>
              <span className="text-gray-400">•</span>
              <h2 className="text-xl font-semibold text-green-600">WRITE - Jardim de Ideias</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={saveStory}
                disabled={isSaving}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : '💾 Salvar'}
              </button>
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('seed')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'seed'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            🌱 Semente da História
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'write'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            ✍️ Escrever
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'characters'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            👥 Personagens
          </button>
        </div>

        {/* Seed Tab */}
        {activeTab === 'seed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configurações */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🌱 Configurar Semente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da História
                  </label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Digite o título da sua história..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <select
                    value={story.genre}
                    onChange={(e) => setStory(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="ficção">Ficção</option>
                    <option value="romance">Romance</option>
                    <option value="aventura">Aventura</option>
                    <option value="mistério">Mistério</option>
                    <option value="fantasia">Fantasia</option>
                    <option value="ficção científica">Ficção Científica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tom/Humor
                  </label>
                  <select
                    value={story.mood}
                    onChange={(e) => setStory(prev => ({ ...prev, mood: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="neutro">Neutro</option>
                    <option value="alegre">Alegre</option>
                    <option value="sério">Sério</option>
                    <option value="dramático">Dramático</option>
                    <option value="humorístico">Humorístico</option>
                    <option value="melancólico">Melancólico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público-alvo
                  </label>
                  <select
                    value={story.target_audience}
                    onChange={(e) => setStory(prev => ({ ...prev, target_audience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="geral">Geral</option>
                    <option value="infantil">Infantil</option>
                    <option value="jovem">Jovem</option>
                    <option value="adulto">Adulto</option>
                  </select>
                </div>

                <button
                  onClick={generateSeed}
                  disabled={isGenerating}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? '🌱 Gerando...' : '🌱 Gerar Semente com IA'}
                </button>
              </div>
            </div>

            {/* Semente Gerada */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🌳 Sua Semente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ideia Original (Raiz)
                  </label>
                  <textarea
                    value={story.seed_idea}
                    onChange={(e) => setStory(prev => ({ ...prev, seed_idea: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                    placeholder="A IA gerará uma ideia original aqui, ou você pode escrever a sua própria..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enredo Principal (Tronco)
                  </label>
                  <textarea
                    value={story.trunk_plot}
                    onChange={(e) => setStory(prev => ({ ...prev, trunk_plot: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                    placeholder="O enredo principal da sua história..."
                  />
                </div>

                {story.seed_idea && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ Semente plantada! Agora você pode ir para a aba "Escrever" para desenvolver sua história.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Write Tab */}
        {activeTab === 'write' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Principal */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">✍️ Editor de História</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={improveText}
                    disabled={isGenerating || !story.content}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    ✨ Melhorar
                  </button>
                  <button
                    onClick={continueStory}
                    disabled={isGenerating || !story.content}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    ➡️ Continuar
                  </button>
                </div>
              </div>

              <textarea
                value={story.content}
                onChange={(e) => setStory(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-96 font-mono text-sm"
                placeholder="Comece a escrever sua história aqui... Use a semente gerada como inspiração!"
              />

              <div className="mt-4 text-sm text-gray-500">
                Palavras: {story.content.split(' ').filter(word => word.length > 0).length}
              </div>
            </div>

            {/* Configurações de IA */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🤖 Assistente de IA</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo de Escrita
                  </label>
                  <select
                    value={story.ai_mode}
                    onChange={(e) => setStory(prev => ({ ...prev, ai_mode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="creative">Criativo</option>
                    <option value="academic">Acadêmico</option>
                    <option value="corporate">Corporativo</option>
                    <option value="social">Redes Sociais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tom da IA
                  </label>
                  <select
                    value={story.ai_tone}
                    onChange={(e) => setStory(prev => ({ ...prev, ai_tone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="neutral">Neutro</option>
                    <option value="serious">Sério</option>
                    <option value="poetic">Poético</option>
                    <option value="persuasive">Persuasivo</option>
                    <option value="summarized">Resumido</option>
                  </select>
                </div>

                {isGenerating && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      🤖 IA trabalhando...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Characters Tab */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Personagens */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">👥 Personagens</h3>
                <button
                  onClick={generateCharacter}
                  disabled={isGenerating}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : '+ Gerar com IA'}
                </button>
              </div>

              <div className="space-y-4">
                {characters.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum personagem criado ainda. Use a IA para gerar personagens automaticamente!
                  </p>
                ) : (
                  characters.map((character, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                      <h4 className="font-bold text-gray-900">{character.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{character.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(character.personality) && character.personality.map((trait: string, i: number) => (
                          <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Árvore Genealógica */}
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🌳 Árvore de Personagens</h3>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌳</div>
                <p className="text-gray-500">
                  A árvore genealógica dos seus personagens aparecerá aqui conforme você os criar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

