'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Brain, Target, Trophy, BookOpen, Lightbulb, Users, Sparkles, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  category: string;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

const LearnPage = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userStats, setUserStats] = useState({
    totalXP: 2450,
    currentLevel: 8,
    streak: 12,
    completedPaths: 3
  });

  useEffect(() => {
    // Simulação de dados de aprendizado
    setLearningPaths([
      {
        id: 'storytelling-basics',
        title: 'Fundamentos da Narrativa',
        description: 'Aprenda os elementos essenciais para criar histórias envolventes',
        difficulty: 'Iniciante',
        progress: 75,
        totalLessons: 12,
        completedLessons: 9,
        estimatedTime: '2h 30min',
        category: 'Escrita',
        color: 'from-green-400 to-emerald-500'
      },
      {
        id: 'character-development',
        title: 'Desenvolvimento de Personagens',
        description: 'Crie personagens memoráveis e tridimensionais',
        difficulty: 'Intermediário',
        progress: 40,
        totalLessons: 15,
        completedLessons: 6,
        estimatedTime: '3h 45min',
        category: 'Escrita',
        color: 'from-blue-400 to-cyan-500'
      },
      {
        id: 'world-building',
        title: 'Construção de Mundos',
        description: 'Desenvolva universos ricos e coerentes para suas histórias',
        difficulty: 'Avançado',
        progress: 20,
        totalLessons: 20,
        completedLessons: 4,
        estimatedTime: '5h 15min',
        category: 'Criação',
        color: 'from-purple-400 to-pink-500'
      },
      {
        id: 'reading-comprehension',
        title: 'Compreensão Literária',
        description: 'Desenvolva habilidades avançadas de interpretação textual',
        difficulty: 'Intermediário',
        progress: 60,
        totalLessons: 10,
        completedLessons: 6,
        estimatedTime: '2h 15min',
        category: 'Leitura',
        color: 'from-yellow-400 to-orange-500'
      }
    ]);

    setAchievements([
      {
        id: 'first-story',
        title: 'Primeira História',
        description: 'Complete sua primeira história no StoryLeaf',
        icon: '📝',
        unlocked: true,
        progress: 100
      },
      {
        id: 'speed-reader',
        title: 'Leitor Veloz',
        description: 'Leia 5 livros em um mês',
        icon: '⚡',
        unlocked: true,
        progress: 100
      },
      {
        id: 'world-builder',
        title: 'Construtor de Mundos',
        description: 'Crie 3 mundos únicos',
        icon: '🌍',
        unlocked: false,
        progress: 66
      },
      {
        id: 'mentor',
        title: 'Mentor',
        description: 'Ajude 10 outros usuários',
        icon: '🎓',
        unlocked: false,
        progress: 30
      }
    ]);
  }, []);

  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'Escrita', name: 'Escrita', icon: GraduationCap },
    { id: 'Leitura', name: 'Leitura', icon: Brain },
    { id: 'Criação', name: 'Criação', icon: Lightbulb }
  ];

  const filteredPaths = selectedCategory === 'all' 
    ? learningPaths 
    : learningPaths.filter(path => path.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <GraduationCap className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StoryLeaf LEARN 2.0</h1>
                <p className="text-gray-600">Clareira do Conhecimento Adaptativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Powered by Árvore da Vida AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard do Usuário */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nível Atual</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.currentLevel}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Total</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalXP.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🔥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sequência</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.streak} dias</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Trilhas Completas</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedPaths}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trilhas de Aprendizado</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                  }
                `}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trilhas de Aprendizado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              
              {/* Header do Card */}
              <div className={`h-2 bg-gradient-to-r ${path.color}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${path.difficulty === 'Iniciante' ? 'bg-green-100 text-green-800' :
                          path.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {path.difficulty}
                      </span>
                      <span>{path.estimatedTime}</span>
                      <span>{path.completedLessons}/{path.totalLessons} lições</span>
                    </div>
                  </div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${path.color} rounded-full flex items-center justify-center`}>
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${path.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Botão de Ação */}
                <button className={`
                  w-full bg-gradient-to-r ${path.color} hover:shadow-lg
                  text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300
                  flex items-center justify-center space-x-2
                `}>
                  <Play className="w-4 h-4" />
                  <span>{path.progress > 0 ? 'Continuar' : 'Começar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Conquistas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            Conquistas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300
                  ${achievement.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                  }
                `}
              >
                <div className="text-center">
                  <div className={`
                    text-4xl mb-2 transition-all duration-300
                    ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}
                  `}>
                    {achievement.icon}
                  </div>
                  
                  <h4 className={`
                    font-semibold mb-1
                    ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {achievement.title}
                  </h4>
                  
                  <p className={`
                    text-xs mb-3
                    ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recursos da Árvore da Vida AI */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aprendizado Adaptativo com IA</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A Árvore da Vida AI personaliza sua jornada de aprendizado, adaptando conteúdo e ritmo às suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Personalização Inteligente</h4>
              <p className="text-gray-600 text-sm">
                Conteúdo adaptado ao seu estilo de aprendizado e velocidade
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Aprendizado Colaborativo</h4>
              <p className="text-gray-600 text-sm">
                Conecte-se com outros aprendizes e mentores da comunidade
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Insights Inteligentes</h4>
              <p className="text-gray-600 text-sm">
                Receba feedback personalizado e sugestões de melhoria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;

