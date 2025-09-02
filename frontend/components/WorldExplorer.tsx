'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Map, MessageCircle, Wand2, Camera, Compass, Book } from 'lucide-react';

interface WorldElement {
  type: 'character' | 'object' | 'portal' | 'vehicle';
  name: string;
  position: [number, number, number];
  description?: string;
  interactive?: boolean;
}

interface WorldData {
  id: string;
  title: string;
  description: string;
  environment_type: string;
  interactive_elements: WorldElement[];
  physics_properties: {
    gravity: number;
    wind_strength: number;
    lighting: string;
  };
  audio_cues: Array<{
    trigger: string;
    sound: string;
  }>;
}

interface WorldExplorerProps {
  worldId: string;
  storyTitle: string;
  onExit?: () => void;
}

const WorldExplorer: React.FC<WorldExplorerProps> = ({ worldId, storyTitle, onExit }) => {
  const [worldData, setWorldData] = useState<WorldData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [discoveredElements, setDiscoveredElements] = useState<string[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [explorationLog, setExplorationLog] = useState<string[]>([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadWorldData();
  }, [worldId]);

  const loadWorldData = async () => {
    try {
      setIsLoading(true);
      // Simulação de carregamento de dados do mundo
      // Em produção, seria uma chamada para a API de geração de mundos
      const response = await fetch(`/api/worlds/${worldId}`);
      if (response.ok) {
        const data = await response.json();
        setWorldData(data.world);
      } else {
        // Dados simulados para demonstração
        setWorldData({
          id: worldId,
          title: storyTitle,
          description: "Um mundo mágico gerado pela Árvore da Vida AI",
          environment_type: "fantasy_magical",
          interactive_elements: [
            {
              type: 'character',
              name: 'Guia Místico',
              position: [5, 0, 5],
              description: 'Um ser sábio que conhece os segredos deste mundo',
              interactive: true
            },
            {
              type: 'object',
              name: 'Árvore Ancestral',
              position: [10, 0, 10],
              description: 'Uma árvore antiga que sussurra histórias do passado',
              interactive: true
            },
            {
              type: 'portal',
              name: 'Portal de Retorno',
              position: [0, 0, 0],
              description: 'O caminho de volta ao mundo real',
              interactive: true
            }
          ],
          physics_properties: {
            gravity: 0.8,
            wind_strength: 0.3,
            lighting: 'magical_twilight'
          },
          audio_cues: [
            { trigger: 'world_entry', sound: 'mystical_welcome' },
            { trigger: 'exploration', sound: 'ambient_nature' }
          ]
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do mundo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = async (direction: string) => {
    if (!worldData || isExploring) return;

    setIsExploring(true);
    
    // Simula movimento no mundo
    const [x, y, z] = currentPosition;
    let newPosition: [number, number, number] = [x, y, z];

    switch (direction) {
      case 'forward':
        newPosition = [x, y, z + 2];
        break;
      case 'backward':
        newPosition = [x, y, z - 2];
        break;
      case 'left':
        newPosition = [x - 2, y, z];
        break;
      case 'right':
        newPosition = [x + 2, y, z];
        break;
    }

    setCurrentPosition(newPosition);

    // Verifica se descobriu novos elementos
    const nearbyElements = worldData.interactive_elements.filter(element => {
      const distance = Math.sqrt(
        Math.pow(element.position[0] - newPosition[0], 2) +
        Math.pow(element.position[2] - newPosition[2], 2)
      );
      return distance < 3; // Raio de descoberta
    });

    const newDiscoveries = nearbyElements
      .filter(element => !discoveredElements.includes(element.name))
      .map(element => element.name);

    if (newDiscoveries.length > 0) {
      setDiscoveredElements(prev => [...prev, ...newDiscoveries]);
      setExplorationLog(prev => [
        ...prev,
        `Você descobriu: ${newDiscoveries.join(', ')}`
      ]);
    }

    // Simula tempo de exploração
    setTimeout(() => {
      setIsExploring(false);
    }, 1500);
  };

  const handlePromptInteraction = async () => {
    if (!currentPrompt.trim() || !worldData) return;

    try {
      const response = await fetch(`/api/worlds/${worldId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'prompt',
          data: { prompt: currentPrompt, position: currentPosition }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setExplorationLog(prev => [
          ...prev,
          `Você: ${currentPrompt}`,
          `Mundo: ${result.response.message}`
        ]);
        
        if (result.response.world_changes) {
          setExplorationLog(prev => [
            ...prev,
            `Mudanças no mundo: ${result.response.world_changes.join(', ')}`
          ]);
        }
      }
    } catch (error) {
      console.error('Erro na interação:', error);
    }

    setCurrentPrompt('');
  };

  const handleElementInteraction = async (element: WorldElement) => {
    if (!element.interactive) return;

    try {
      const response = await fetch(`/api/worlds/${worldId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'character_interaction',
          data: { element_name: element.name, position: currentPosition }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setExplorationLog(prev => [
          ...prev,
          `Interação com ${element.name}:`,
          result.response.dialogue || result.response.message
        ]);
      }
    } catch (error) {
      console.error('Erro na interação com elemento:', error);
    }
  };

  const renderMiniMap = () => {
    if (!showMiniMap || !worldData) return null;

    return (
      <div className="absolute top-4 right-4 w-48 h-48 bg-black/70 rounded-lg p-2">
        <div className="relative w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded">
          {/* Posição atual */}
          <div 
            className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1 -translate-y-1"
            style={{
              left: `${(currentPosition[0] + 20) * 2.4}px`,
              top: `${(currentPosition[2] + 20) * 2.4}px`
            }}
          />
          
          {/* Elementos descobertos */}
          {worldData.interactive_elements
            .filter(element => discoveredElements.includes(element.name))
            .map((element, index) => (
              <div
                key={index}
                className="absolute w-1.5 h-1.5 bg-green-400 rounded-full transform -translate-x-0.5 -translate-y-0.5"
                style={{
                  left: `${(element.position[0] + 20) * 2.4}px`,
                  top: `${(element.position[2] + 20) * 2.4}px`
                }}
                title={element.name}
              />
            ))}
        </div>
        <div className="text-xs text-white/70 mt-1">Mini Mapa</div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Gerando mundo mágico...</p>
          <p className="text-white/70 text-sm">A Árvore da Vida AI está criando sua realidade</p>
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Erro ao Carregar Mundo</h2>
          <p className="mb-4">Não foi possível acessar este mundo mágico.</p>
          <button 
            onClick={onExit}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retornar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Fundo animado com partículas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Book className="w-6 h-6 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">{worldData.title}</h1>
              <p className="text-sm text-white/70">Exploração Interativa</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`p-2 rounded-lg transition-colors ${showMiniMap ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <Map className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg transition-colors ${audioEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <Volume2 className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Área principal de exploração */}
      <div className="relative z-10 flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          
          {/* Viewport principal */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm rounded-lg p-6 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-64 bg-gradient-to-b from-blue-400/20 to-green-400/20 rounded-lg mb-4"
              width={800}
              height={400}
            />
            
            <div className="text-center text-white mb-4">
              <h3 className="text-lg font-semibold mb-2">{worldData.description}</h3>
              <p className="text-sm text-white/70">
                Posição: ({currentPosition[0]}, {currentPosition[1]}, {currentPosition[2]})
              </p>
            </div>

            {/* Controles de navegação */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
              <div></div>
              <button
                onClick={() => handleNavigation('forward')}
                disabled={isExploring}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
              >
                ↑
              </button>
              <div></div>
              
              <button
                onClick={() => handleNavigation('left')}
                disabled={isExploring}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
              >
                ←
              </button>
              
              <div className="flex items-center justify-center">
                {isExploring && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                )}
              </div>
              
              <button
                onClick={() => handleNavigation('right')}
                disabled={isExploring}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
              >
                →
              </button>
              
              <div></div>
              <button
                onClick={() => handleNavigation('backward')}
                disabled={isExploring}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
              >
                ↓
              </button>
              <div></div>
            </div>

            {/* Prompt de interação */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="Digite um comando ou desejo para o mundo..."
                className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && handlePromptInteraction()}
              />
              <button
                onClick={handlePromptInteraction}
                disabled={!currentPrompt.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg text-white transition-colors flex items-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Usar</span>
              </button>
            </div>
          </div>

          {/* Painel lateral */}
          <div className="space-y-4">
            
            {/* Descobertas */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-yellow-400" />
                Descobertas
              </h3>
              <div className="space-y-2">
                {discoveredElements.length === 0 ? (
                  <p className="text-white/50 text-sm">Explore para descobrir elementos mágicos</p>
                ) : (
                  discoveredElements.map((element, index) => {
                    const elementData = worldData.interactive_elements.find(e => e.name === element);
                    return (
                      <div
                        key={index}
                        onClick={() => elementData && handleElementInteraction(elementData)}
                        className="p-2 bg-white/10 rounded cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        <div className="text-white font-medium text-sm">{element}</div>
                        {elementData?.description && (
                          <div className="text-white/70 text-xs mt-1">{elementData.description}</div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Log de exploração */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
                Diário de Aventura
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {explorationLog.length === 0 ? (
                  <p className="text-white/50 text-sm">Sua jornada começará aqui...</p>
                ) : (
                  explorationLog.map((entry, index) => (
                    <div key={index} className="text-white/80 text-sm p-2 bg-white/5 rounded">
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini mapa */}
      {renderMiniMap()}
    </div>
  );
};

export default WorldExplorer;

