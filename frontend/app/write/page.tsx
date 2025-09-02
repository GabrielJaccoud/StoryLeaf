'use client';

import React, { useState, useEffect } from 'react';
import { PenTool, Wand2, Globe, Users, Save, Download, Eye, Sparkles, TreePine, BookOpen, Lightbulb, Layers, Map, Palette } from 'lucide-react';

interface WorldElement {
  id: string;
  type: 'character' | 'location' | 'object' | 'concept';
  name: string;
  description: string;
  connections: string[];
}

interface Story {
  title: string;
  content: string;
  genre: string;
  world: WorldElement[];
  plotPoints: string[];
}

const WritePage = () => {
  const [story, setStory] = useState<Story>({
    title: '',
    content: '',
    genre: '',
    world: [],
    plotPoints: []
  });
  
  const [activeTab, setActiveTab] = useState<'write' | 'world' | 'collaborate'>('write');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [worldGenerationPrompt, setWorldGenerationPrompt] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(story.content.split(' ').filter(word => word.length > 0).length);
  }, [story.content]);

  const generateAISuggestion = async () => {
    setIsGenerating(true);
    
    // Simular chamada para API da Árvore da Vida AI
    setTimeout(() => {
      const suggestions = [
        "A Árvore da Vida AI sugere: Que tal adicionar um elemento de mistério neste ponto da história?",
        "Insight da IA: Considere desenvolver mais o background do protagonista aqui.",
        "Sugestão inteligente: Este seria um bom momento para introduzir um conflito secundário.",
        "Recomendação da Árvore: Uma reviravolta inesperada poderia enriquecer a narrativa.",
        "IA Criativa: Explore as emoções do personagem neste momento crucial."
      ];
      
      setAiSuggestions([suggestions[Math.floor(Math.random() * suggestions.length)]]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateWorld = async () => {
    if (!worldGenerationPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simular geração de mundo com IA
    setTimeout(() => {
      const newWorldElements: WorldElement[] = [
        {
          id: 'char-1',
          type: 'character',
          name: 'Protagonista Misterioso',
          description: 'Um personagem com habilidades únicas gerado pela IA',
          connections: ['loc-1']
        },
        {
          id: 'loc-1',
          type: 'location',
          name: 'Cidade Flutuante',
          description: 'Uma metrópole suspensa nas nuvens, criada pela Árvore da Vida AI',
          connections: ['char-1', 'obj-1']
        },
        {
          id: 'obj-1',
          type: 'object',
          name: 'Cristal de Energia',
          description: 'Fonte de poder que mantém a cidade no ar',
          connections: ['loc-1']
        }
      ];
      
      setStory(prev => ({
        ...prev,
        world: [...prev.world, ...newWorldElements]
      }));
      
      setWorldGenerationPrompt('');
      setIsGenerating(false);
    }, 3000);
  };

  const saveStory = () => {
    console.log('Salvando história:', story);
    alert('História salva com sucesso na Árvore da Vida AI!');
  };

  const tabs = [
    { id: 'write', name: 'Escrever', icon: PenTool },
    { id: 'world', name: 'Criar Mundo', icon: Globe },
    { id: 'collaborate', name: 'Colaborar', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">StoryLeaf WRITE 2.0</h1>
                <p className="text-gray-600 text-sm">Laboratório Criativo com IA Generativa</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span>Powered by Árvore da Vida AI</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <TreePine className="w-4 h-4 text-green-500" />
                <span>Palavras: {wordCount}</span>
              </div>
              
              <button
                onClick={saveStory}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab: Escrever */}
        {activeTab === 'write' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Painel Principal de Escrita */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Informações da História */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da História
                    </label>
                    <input
                      type="text"
                      value={story.title}
                      onChange={(e) => setStory({...story, title: e.target.value})}
                      placeholder="Digite o título da sua história..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gênero
                    </label>
                    <select
                      value={story.genre}
                      onChange={(e) => setStory({...story, genre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Selecione um gênero</option>
                      <option value="fantasia">Fantasia</option>
                      <option value="ficcao-cientifica">Ficção Científica</option>
                      <option value="romance">Romance</option>
                      <option value="misterio">Mistério</option>
                      <option value="aventura">Aventura</option>
                      <option value="drama">Drama</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Editor de Texto */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sua História</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={story.content}
                  onChange={(e) => setStory({...story, content: e.target.value})}
                  placeholder="Era uma vez... Comece sua história aqui! A Árvore da Vida AI está pronta para ajudar."
                  className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Painel Lateral - Ferramentas de IA */}
            <div className="space-y-6">
              
              {/* Assistente de IA */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Árvore da Vida AI</h3>
                </div>
                
                <button
                  onClick={generateAISuggestion}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Consultando IA...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Pedir Sugestão</span>
                    </>
                  )}
                </button>
                
                {aiSuggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <TreePine className="w-4 h-4 mr-1" />
                      Insight da Árvore da Vida AI:
                    </h4>
                    <p className="text-yellow-700 text-sm">{aiSuggestions[0]}</p>
                  </div>
                )}
              </div>

              {/* Ferramentas de Desenvolvimento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ferramentas Criativas</h3>
                
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-blue-900">Gerador de Personagens</p>
                        <p className="text-blue-600 text-sm">IA cria personagens únicos</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-purple-900">Estrutura Narrativa</p>
                        <p className="text-purple-600 text-sm">Organize com IA</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-900">Ideias de Plot</p>
                        <p className="text-green-600 text-sm">Inspiração inteligente</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palavras:</span>
                    <span className="font-semibold text-gray-900">{wordCount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caracteres:</span>
                    <span className="font-semibold text-gray-900">{story.content.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elementos do Mundo:</span>
                    <span className="font-semibold text-gray-900">{story.world.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo de leitura:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.ceil(wordCount / 200)} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Criar Mundo */}
        {activeTab === 'world' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Gerador de Mundo */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Prompt de Geração */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900">Gerador de Mundos IA</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descreva o mundo que você quer criar:
                    </label>
                    <textarea
                      value={worldGenerationPrompt}
                      onChange={(e) => setWorldGenerationPrompt(e.target.value)}
                      placeholder="Ex: Uma cidade steampunk flutuante com dirigíveis e engrenagens gigantes..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={generateWorld}
                    disabled={isGenerating || !worldGenerationPrompt.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Gerando Mundo...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Gerar Mundo com IA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Elementos do Mundo */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Elementos do Mundo</h3>
                
                {story.world.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum elemento criado ainda.</p>
                    <p className="text-sm">Use o gerador de IA para começar!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {story.world.map((element) => (
                      <div key={element.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          {element.type === 'character' && <Users className="w-4 h-4 text-blue-500" />}
                          {element.type === 'location' && <Map className="w-4 h-4 text-green-500" />}
                          {element.type === 'object' && <Layers className="w-4 h-4 text-purple-500" />}
                          {element.type === 'concept' && <Lightbulb className="w-4 h-4 text-yellow-500" />}
                          <h4 className="font-medium text-gray-900">{element.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{element.description}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Tipo:</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                            {element.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Painel de Ferramentas */}
            <div className="space-y-6">
              
              {/* Tipos de Elementos */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Elementos</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-900">Personagens</p>
                      <p className="text-blue-600 text-sm">Heróis, vilões, aliados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Map className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-900">Localizações</p>
                      <p className="text-green-600 text-sm">Cidades, florestas, castelos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-purple-900">Objetos</p>
                      <p className="text-purple-600 text-sm">Armas, artefatos, itens</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-yellow-900">Conceitos</p>
                      <p className="text-yellow-600 text-sm">Magias, tecnologias, leis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dicas da IA */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Dicas da Árvore da Vida AI</h4>
                </div>
                
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Seja específico nas descrições para melhores resultados</li>
                  <li>• Combine elementos diferentes para criar conexões interessantes</li>
                  <li>• Use referências visuais e sensoriais</li>
                  <li>• Pense na história e cultura do seu mundo</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Colaborar */}
        {activeTab === 'collaborate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Área de Colaboração */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Users className="w-6 h-6 text-purple-500" />
                  <h3 className="text-xl font-semibold text-gray-900">Colaboração em Tempo Real</h3>
                </div>
                
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Funcionalidade em Desenvolvimento</h4>
                  <p className="text-gray-600 mb-6">
                    Em breve você poderá colaborar com outros escritores em tempo real, 
                    com suporte da Árvore da Vida AI para facilitar a criação conjunta.
                  </p>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h5 className="font-medium text-purple-900 mb-2">Recursos Planejados:</h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Edição colaborativa em tempo real</li>
                      <li>• Chat integrado com IA</li>
                      <li>• Controle de versões inteligente</li>
                      <li>• Sugestões de merge automático</li>
                      <li>• Roles e permissões flexíveis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Colaboradores */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Colaboradores Ativos</h3>
                
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Nenhum colaborador ativo</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Convitar Colaboradores</h3>
                
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email do colaborador"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                    Enviar Convite
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritePage;

