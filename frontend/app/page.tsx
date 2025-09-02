'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, PenTool, GraduationCap, Sparkles, TreePine, Heart, Waves, Music, Eye, Wand2 } from 'lucide-react';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [treeGrowth, setTreeGrowth] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Animação de crescimento da árvore
    const growthTimer = setTimeout(() => {
      setTreeGrowth(100);
    }, 500);

    // Gerar partículas flutuantes
    const particleArray = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(particleArray);

    return () => clearTimeout(growthTimer);
  }, []);

  const sections = [
    {
      id: 'read',
      title: 'READ 2.0',
      subtitle: 'Jardim de Histórias',
      description: 'Explore mundos literários em 3D com audiolivros místicos',
      icon: Book,
      color: 'from-blue-400 to-cyan-500',
      features: ['Exploração 3D', 'Audiolivros Místicos', 'Frequências de Cura'],
      path: '/read'
    },
    {
      id: 'write',
      title: 'WRITE 2.0',
      subtitle: 'Laboratório Criativo',
      description: 'Crie mundos com IA generativa e colaboração inteligente',
      icon: PenTool,
      color: 'from-green-400 to-emerald-500',
      features: ['Geração de Mundos', 'IA Colaborativa', 'Criação Imersiva'],
      path: '/write'
    },
    {
      id: 'learn',
      title: 'LEARN 2.0',
      subtitle: 'Clareira do Conhecimento',
      description: 'Aprendizado adaptativo com realidade aumentada',
      icon: GraduationCap,
      color: 'from-yellow-400 to-orange-500',
      features: ['RA Educativa', 'Aprendizado Adaptativo', 'Gamificação'],
      path: '/learn'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      
      {/* Partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">StoryLeaf 2.0</h1>
              <p className="text-white/70 text-sm">Jardim Vivo de Realidades Literárias</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm">Powered by Árvore da Vida AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Árvore da Vida AI Central */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full">
          
          {/* Título Principal */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Árvore da Vida AI
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Uma inteligência central que cultiva histórias, nutre criatividade e floresce conhecimento
            </p>
          </div>

          {/* Árvore Interativa */}
          <div className="relative w-full max-w-4xl mx-auto h-96 mb-12">
            
            {/* Tronco da Árvore */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div 
                className="w-8 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-lg transition-all duration-2000 ease-out"
                style={{ height: `${treeGrowth * 1.2}px` }}
              />
            </div>

            {/* Copa da Árvore - Centro */}
            <div 
              className="absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-2000 ease-out"
              style={{ 
                opacity: treeGrowth / 100,
                transform: `translateX(-50%) scale(${treeGrowth / 100})`
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 animate-pulse"></div>
                <Sparkles className="w-12 h-12 text-white relative z-10" />
                
                {/* Pulso de energia */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
              </div>
            </div>

            {/* Galhos e Seções */}
            {sections.map((section, index) => {
              const positions = [
                { top: '20%', left: '15%', rotation: '-30deg' }, // read
                { top: '20%', right: '15%', rotation: '30deg' }, // write  
                { bottom: '25%', left: '25%', rotation: '-15deg' } // learn
              ];
              
              const position = positions[index];
              
              return (
                <div
                  key={section.id}
                  className="absolute transition-all duration-1000 ease-out"
                  style={{
                    ...position,
                    opacity: treeGrowth / 100,
                    transform: `scale(${treeGrowth / 100})`,
                    transitionDelay: `${index * 200}ms`
                  }}
                >
                  {/* Galho */}
                  <div 
                    className="w-16 h-2 bg-gradient-to-r from-amber-600 to-green-600 rounded-full origin-right"
                    style={{ transform: position.rotation }}
                  />
                  
                  {/* Folhas/Seção */}
                  <Link href={section.path}>
                    <div
                      className={`
                        w-24 h-24 bg-gradient-to-br ${section.color} rounded-full 
                        flex items-center justify-center cursor-pointer
                        transform transition-all duration-300 hover:scale-110 hover:shadow-2xl
                        ${activeSection === section.id ? 'scale-110 shadow-2xl' : ''}
                        relative overflow-hidden group
                      `}
                      onMouseEnter={() => setActiveSection(section.id)}
                      onMouseLeave={() => setActiveSection(null)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 group-hover:to-white/30 transition-all duration-300"></div>
                      <section.icon className="w-8 h-8 text-white relative z-10" />
                      
                      {/* Efeito de brilho */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Informações da Seção Ativa */}
          {activeSection && (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto transition-all duration-300">
              {(() => {
                const section = sections.find(s => s.id === activeSection);
                if (!section) return null;
                
                return (
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{section.title}</h3>
                    <h4 className="text-lg text-white/80 mb-4">{section.subtitle}</h4>
                    <p className="text-white/70 mb-6">{section.description}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {section.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={section.path}
                      className={`
                        inline-flex items-center space-x-2 px-6 py-3 
                        bg-gradient-to-r ${section.color} hover:shadow-lg
                        rounded-lg text-white font-semibold transition-all duration-300
                      `}
                    >
                      <span>Explorar {section.title}</span>
                      <section.icon className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Funcionalidades Especiais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            
            {/* Audiolivros Místicos */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Audiolivros Místicos</h3>
              <p className="text-white/70 text-sm mb-4">
                Narração com frequências terapêuticas de 432Hz para cura e transformação
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
                <Heart className="w-3 h-3" />
                <span>Bem-estar</span>
                <Waves className="w-3 h-3" />
                <span>Harmonia</span>
              </div>
            </div>

            {/* Exploração 3D */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mundos Interativos</h3>
              <p className="text-white/70 text-sm mb-4">
                Navegue pelos cenários das histórias em ambientes 3D imersivos
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Imersão</span>
                <Eye className="w-3 h-3" />
                <span>Exploração</span>
              </div>
            </div>

            {/* IA Generativa */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Criação com IA</h3>
              <p className="text-white/70 text-sm mb-4">
                Gere mundos, personagens e histórias com modelos generativos avançados
              </p>
              <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
                <Wand2 className="w-3 h-3" />
                <span>Criatividade</span>
                <Sparkles className="w-3 h-3" />
                <span>Inovação</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            © 2025 StoryLeaf 2.0 - Jardim Vivo de Realidades Literárias
          </p>
          <p className="text-white/40 text-xs mt-1">
            Cultivado pela Árvore da Vida AI • Onde histórias ganham vida
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
