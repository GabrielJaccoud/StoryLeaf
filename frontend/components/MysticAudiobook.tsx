
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Settings, Heart, Waves, Sparkles, Music } from 'lucide-react';

interface AudiobookSettings {
  voice_type: string;
  soundtrack_type: string;
  healing_frequency: string;
  volume: number;
  playback_speed: number;
}

interface MysticAudiobookProps {
  bookId: string;
  bookTitle: string;
  onClose?: () => void;
}

const MysticAudiobook: React.FC<MysticAudiobookProps> = ({
  bookId,
  bookTitle,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [bookContent, setBookContent] = useState<string>('');
  const [loadingBookContent, setLoadingBookContent] = useState<boolean>(true);
  const [errorBookContent, setErrorBookContent] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const [settings, setSettings] = useState<AudiobookSettings>({
    voice_type: 'female_narrator',
    soundtrack_type: 'spiritual',
    healing_frequency: '432',
    volume: 0.8,
    playback_speed: 1.0
  });

  const voiceOptions = {
    'female_narrator': 'Narradora Feminina',
    'male_narrator': 'Narrador Masculino',
    'mystic_voice': 'Voz Mística',
    'child_friendly': 'Amigável para Crianças'
  };

  const soundtrackOptions = {
    'spiritual': 'Espiritual',
    'children': 'Infantil',
    'adventure': 'Aventura',
    'suspense': 'Suspense',
    'romance': 'Romance',
    'healing': 'Cura'
  };

  const frequencyOptions = {
    '174': '174Hz - Alívio da Dor',
    '285': '285Hz - Regeneração',
    '396': '396Hz - Liberação do Medo',
    '417': '417Hz - Mudança Positiva',
    '432': '432Hz - Harmonia Universal',
    '528': '528Hz - Transformação e Amor',
    '639': '639Hz - Relacionamentos',
    '741': '741Hz - Despertar Intuitivo',
    '852': '852Hz - Ordem Espiritual',
    '963': '963Hz - Conexão Divina'
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  useEffect(() => {
    const fetchBookContentForAudiobook = async () => {
      try {
        setLoadingBookContent(true);
        const response = await fetch(`/api/library/${bookId}/content`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.book && data.book.sections) {
          // Concatenar o conteúdo de todas as seções para o audiobook
          const fullContent = data.book.sections.map((section: any) => section.content).join(' ');
          setBookContent(fullContent);
        } else {
          setErrorBookContent('Formato de dados do livro inválido para audiobook.');
        }
      } catch (err) {
        console.error('Erro ao buscar conteúdo do livro para audiobook:', err);
        setErrorBookContent('Não foi possível carregar o conteúdo do livro para audiobook.');
      } finally {
        setLoadingBookContent(false);
      }
    };

    if (bookId) {
      fetchBookContentForAudiobook();
    }
  }, [bookId]);

  const generateAudiobook = async () => {
    if (!bookContent) {
      setCurrentStep('Conteúdo do livro não disponível.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Iniciando geração...');

    try {
      const steps = [
        'Analisando o texto...',
        'Gerando narração com voz selecionada...',
        'Criando trilha sonora mística...',
        'Aplicando frequências de cura...',
        'Sincronizando áudio e música...',
        'Finalizando audiolivro...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const response = await fetch('/api/audiobook/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: bookContent.substring(0, 1000), // Usar o conteúdo completo ou uma parte
          voice_type: settings.voice_type,
          soundtrack_type: settings.soundtrack_type,
          healing_frequency: settings.healing_frequency,
          chapter_title: bookTitle
        })
      });

      if (response.ok) {
        // Para demonstração, usa o arquivo de demo gerado
        setAudioUrl('/demo_mystic_audiobook.wav');
        setCurrentStep('Audiolivro místico pronto!');
      } else {
        throw new Error('Erro na geração do audiolivro');
      }
    } catch (error) {
      console.error('Erro ao gerar audiolivro:', error);
      setCurrentStep('Erro na geração. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadAudiobook = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${bookTitle}_mystic_audiobook.wav`;
      link.click();
    }
  };

  if (loadingBookContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando conteúdo do livro para audiobook...</p>
        </div>
      </div>
    );
  }

  if (errorBookContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Erro ao Carregar Conteúdo</h2>
          <p className="mb-4">{errorBookContent}</p>
          <button
            onClick={onClose}
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
      {/* Fundo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Audiolivro Místico</h1>
              <p className="text-white/70">{bookTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex-1 p-6">
        <div className="max-w-4xl mx-auto">

          {/* Painel de configurações */}
          {showSettings && (
            <div className="mb-6 bg-black/40 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Configurações Místicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Voz do Narrador</label>
                  <select
                    value={settings.voice_type}
                    onChange={(e) => setSettings({ ...settings, voice_type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {Object.entries(voiceOptions).map(([key, label]) => (
                      <option key={key} value={key} className="bg-gray-800">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Trilha Sonora</label>
                  <select
                    value={settings.soundtrack_type}
                    onChange={(e) => setSettings({ ...settings, soundtrack_type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {Object.entries(soundtrackOptions).map(([key, label]) => (
                      <option key={key} value={key} className="bg-gray-800">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Frequência de Cura</label>
                  <select
                    value={settings.healing_frequency}
                    onChange={(e) => setSettings({ ...settings, healing_frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  >
                    {Object.entries(frequencyOptions).map(([key, label]) => (
                      <option key={key} value={key} className="bg-gray-800">{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Player principal */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8">

            {/* Visualização de frequência */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 animate-pulse"></div>
                <div className="relative z-10 text-white text-center">
                  <Waves className="w-8 h-8 mx-auto mb-1" />
                  <div className="text-lg font-bold">{settings.healing_frequency}Hz</div>
                  <div className="text-xs opacity-70">Cura</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {frequencyOptions[settings.healing_frequency as keyof typeof frequencyOptions]}
              </h3>
              <p className="text-white/70 text-sm">
                Frequência sintonizada para harmonia e bem-estar
              </p>
            </div>

            {/* Geração do audiolivro */}
            {!audioUrl && (
              <div className="text-center mb-8">
                {!isGenerating ? (
                  <button
                    onClick={generateAudiobook}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all duration-300 flex items-center space-x-3 mx-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Gerar Audiolivro Místico</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-white/80">{currentStep}</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  </div>
                )}
              </div>
            )}

            {/* Player de áudio */}
            {audioUrl && (
              <div className="space-y-6">
                <audio ref={audioRef} src={audioUrl} />

                {/* Controles principais */}
                <div className="flex items-center justify-center space-x-6">
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>

                  <button
                    onClick={downloadAudiobook}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Barra de progresso */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controles de volume */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}

            {/* Benefícios da frequência */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Bem-estar</h4>
                <p className="text-white/60 text-xs">Promove relaxamento profundo</p>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Waves className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Harmonia</h4>
                <p className="text-white/60 text-xs">Equilibra energia e emoções</p>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-white font-medium mb-1">Transformação</h4>
                <p className="text-white/60 text-xs">Facilita crescimento pessoal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysticAudiobook;


