'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('checking');

  useEffect(() => {
    // Check API health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') {
          setApiStatus('healthy');
        } else {
          setApiStatus('error');
        }
      })
      .catch(() => setApiStatus('error'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌿</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">StoryLeaf</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-green-600 transition-colors">
                Funcionalidades
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-green-600 transition-colors">
                Sobre
              </Link>
              <Link href="/write" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Começar a Escrever
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              No StoryLeaf, cada palavra é uma{" "}
              <span className="text-green-500">semente</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Cada história, uma árvore. E cada leitor, um jardineiro da imaginação.
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              Plataforma revolucionária para criar, ler e aprender com histórias, 
              utilizando a metáfora da árvore onde histórias crescem como folhas.
            </p>
          </div>

          {/* API Status */}
          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              apiStatus === 'healthy' ? 'bg-green-100 text-green-800' :
              apiStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                apiStatus === 'healthy' ? 'bg-green-500' :
                apiStatus === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              API Status: {apiStatus === 'healthy' ? 'Online' : apiStatus === 'error' ? 'Offline' : 'Verificando...'}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/write"
              className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🌱 Plantar Nova História
            </Link>
            <Link 
              href="/read"
              className="bg-white text-green-600 border-2 border-green-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Explorar Floresta
            </Link>
          </div>

          {/* Tree Metaphor Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="text-6xl mb-4">🌳</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🌱</div>
                <h3 className="font-bold text-gray-900 mb-2">Raiz</h3>
                <p className="text-gray-600 text-sm">Ideia original e inspiração</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🌲</div>
                <h3 className="font-bold text-gray-900 mb-2">Tronco</h3>
                <p className="text-gray-600 text-sm">Enredo principal</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🌿</div>
                <h3 className="font-bold text-gray-900 mb-2">Galhos</h3>
                <p className="text-gray-600 text-sm">Ramificações narrativas</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="text-3xl mb-3">🍃</div>
                <h3 className="font-bold text-gray-900 mb-2">Folhas</h3>
                <p className="text-gray-600 text-sm">Capítulos e momentos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra as ferramentas que transformarão sua experiência de escrita e leitura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* StoryLeaf WRITE */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🖋️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">StoryLeaf WRITE</h3>
              <p className="text-gray-600 mb-4">O Jardim de Ideias com IA para gerar enredos e desenvolver personagens</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Semente de História com IA</li>
                <li>• Mapas de Personagens</li>
                <li>• Colaboração em Tempo Real</li>
              </ul>
            </div>

            {/* StoryLeaf READ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">StoryLeaf read</h3>
              <p className="text-gray-600 mb-4">A Floresta de Histórias com experiência imersiva e interativa</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Biblioteca Visual</li>
                <li>• Narrativa Interativa</li>
                <li>• Realidade Aumentada</li>
              </ul>
            </div>

            {/* StoryLeaf LEARN */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">StoryLeaf LEARN</h3>
              <p className="text-gray-600 mb-4">Folhas de Aprendizado com gamificação educacional</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Árvore de Conhecimento</li>
                <li>• Integração LMS</li>
                <li>• Conteúdo Adaptativo</li>
              </ul>
            </div>

            {/* StoryLeaf CONVERT */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">StoryLeaf CONVERT</h3>
              <p className="text-gray-600 mb-4">Transforme livros em experiências vividas</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Importação Universal</li>
                <li>• Templates Criativos</li>
                <li>• Gamificação Embutida</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🌿</span>
                </div>
                <h3 className="text-xl font-bold">StoryLeaf</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Onde histórias crescem e florescem. Transformando a experiência de leitura e escrita.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 StoryLeaf. Todos os direitos reservados.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/write" className="hover:text-white transition-colors">Escrever</Link></li>
                <li><Link href="/read" className="hover:text-white transition-colors">Ler</Link></li>
                <li><Link href="/learn" className="hover:text-white transition-colors">Aprender</Link></li>
                <li><Link href="/convert" className="hover:text-white transition-colors">Converter</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Suporte</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
