import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Settings, Heart, Waves, Sparkles, Music, BookOpen, SkipForward, SkipBack } from 'lucide-react';

interface BookSection {
  id: number;
  title: string;
  word_count: number;
  estimated_duration: number;
  preview: string;
}

interface AudiobookSettings {
  voice_type: string;
  soundtrack_type: string;
  healing_frequency: string;
  volume: number;
  playback_speed: number;
}

interface BookAudioPlayerProps {
  bookId: string;
  bookTitle: string;
  onClose?: () => void;
}

const BookAudioPlayer: React.FC<BookAudioPlayerProps> = ({ 
  bookId, 
  bookTitle, 
  onClose 
}) => {
  const [sections, setSections] = useState<BookSection[]>([]);
  const [currentSection, setCurrentSection] = useState<number>(1);
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
  const [loading, setLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [settings, setSettings] = useState<AudiobookSettings>({
    voice_type: 'female_voice',
    soundtrack_type: 'spiritual',
    healing_frequency: '432',
    volume: 0.8,
    playback_speed: 1.0
  });

  const voiceOptions = {
    'female_voice': 'Voz Feminina Suave',
    'male_voice': 'Voz Masculina Profunda'
  };

  const soundtrackOptions = {
    'spiritual': 'Espiritual - Tons Contemplativos',
    'children': 'Infantil - Melodias Suaves',
    'adventure': 'Aventura - Trilhas Épicas',
    'classical': 'Clássica - Música Erudita',
    'nature': 'Natureza - Sons Ambientais'
  };

  const healingFrequencies = {
    '174': '174 Hz - Alívio da Dor',
    '285': '285 Hz - Regeneração',
    '396': '396 Hz - Liberação do Medo',
    '417': '417 Hz - Mudança Positiva',
    '432': '432 Hz - Harmonia Universal',
    '528': '528 Hz - Transformação e Amor',
    '639': '639 Hz - Relacionamentos',
    '741': '741 Hz - Despertar Intuitivo',
    '852': '852 Hz - Ordem Espiritual',
    '963': '963 Hz - Conexão Divina'
  };

  useEffect(() => {
    fetchBookSections();
  }, [bookId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = settings.playback_speed;
    }
  }, [volume, isMuted, settings.playback_speed]);

  const fetchBookSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/audiobook/books/${bookId}/sections`);
      
      if (response.ok) {
        const data = await response.json();
        setSections(data.sections || []);
      } else {
        console.error('Falha ao carregar seções do livro');
      }
    } catch (error) {
      console.error('Erro ao carregar seções:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAudiobook = async (sectionId?: number) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setCurrentStep('Preparando geração...');

      const response = await fetch(`/api/audiobook/books/${bookId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_type: settings.voice_type,
          soundtrack_type: settings.soundtrack_type,
          healing_frequency: settings.healing_frequency,
          section_id: sectionId || currentSection
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simula progresso de geração
        simulateGenerationProgress(data.audiobook_id);
      } else {
        throw new Error('Falha na geração do audiobook');
      }
    } catch (error) {
      console.error('Erro na geração:', error);
      setIsGenerating(false);
    }
  };

  const simulateGenerationProgress = (audiobookId: string) => {
    const steps = [
      'Analisando texto...',
      'Aplicando frequência terapêutica...',
      'Gerando narração...',
      'Criando trilha sonora...',
      'Mixando áudio...',
      'Finalizando audiobook...'
    ];

    let progress = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (stepIndex < steps.length - 1 && progress > (stepIndex + 1) * (100 / steps.length)) {
        stepIndex++;
      }
      
      setCurrentStep(steps[stepIndex]);
      setGenerationProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setCurrentStep('Audiobook gerado com sucesso!');
        
        // Simula URL do áudio gerado
        setAudioUrl(`/api/audiobook/play/${audiobookId}`);
        setDuration(sections[currentSection - 1]?.estimated_duration * 60 || 300);
      }
    }, 500);
  };

  const togglePlayPause = () => {
    if (!audioUrl) {
      generateAudiobook();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
      setAudioUrl(null);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const previousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setAudioUrl(null);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-purple-300" />
          <div>
            <h1 className="text-2xl font-bold">{bookTitle}</h1>
            <p className="text-purple-300">Audiobook Místico</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Fechar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visualização da Seção Atual */}
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-semibold">
                Seção {currentSection} de {sections.length}
              </h3>
            </div>
            
            {sections[currentSection - 1] && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-purple-300">
                  {sections[currentSection - 1].title}
                </h4>
                <p className="text-gray-300 text-sm">
                  {sections[currentSection - 1].preview}
                </p>
                <div className="flex gap-4 text-sm text-purple-300">
                  <span>{sections[currentSection - 1].word_count} palavras</span>
                  <span>~{sections[currentSection - 1].estimated_duration} min</span>
                </div>
              </div>
            )}
          </div>

          {/* Controles de Reprodução */}
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Waves className="h-6 w-6 text-purple-400 animate-pulse" />
                  <span className="text-lg">Gerando Audiobook Místico...</span>
                </div>
                
                <div className="w-full bg-purple-900/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-purple-300">{currentStep}</p>
                <p className="text-sm text-gray-400">{Math.round(generationProgress)}% concluído</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Controles principais */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={previousSection}
                    disabled={currentSection === 1}
                    className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={togglePlayPause}
                    className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-all transform hover:scale-105"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </button>
                  
                  <button
                    onClick={nextSection}
                    disabled={currentSection === sections.length}
                    className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>

                {/* Barra de progresso */}
                {audioUrl && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-purple-300">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}

                {/* Controles de volume */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Configurações */}
          {showSettings && (
            <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Místicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Voz</label>
                  <select
                    value={settings.voice_type}
                    onChange={(e) => setSettings({...settings, voice_type: e.target.value})}
                    className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
                  >
                    {Object.entries(voiceOptions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Trilha Sonora</label>
                  <select
                    value={settings.soundtrack_type}
                    onChange={(e) => setSettings({...settings, soundtrack_type: e.target.value})}
                    className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
                  >
                    {Object.entries(soundtrackOptions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Frequência Terapêutica</label>
                  <select
                    value={settings.healing_frequency}
                    onChange={(e) => setSettings({...settings, healing_frequency: e.target.value})}
                    className="w-full p-2 bg-purple-900/50 border border-purple-700 rounded-lg text-white"
                  >
                    {Object.entries(healingFrequencies).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Seções */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Music className="h-5 w-5" />
            Seções do Livro
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentSection === section.id
                    ? 'bg-purple-600/50 border border-purple-400'
                    : 'bg-black/20 hover:bg-purple-800/30'
                }`}
              >
                <div className="font-medium">{section.title}</div>
                <div className="text-sm text-purple-300">
                  {section.word_count} palavras • ~{section.estimated_duration} min
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (currentSection < sections.length) {
              nextSection();
            }
          }}
        />
      )}
    </div>
  );
};

export default BookAudioPlayer;

