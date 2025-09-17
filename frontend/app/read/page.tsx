
'use client';

import React, { useState, useEffect } from 'react';
import { Book, Play, Eye, Sparkles, ArrowLeft, Headphones } from 'lucide-react';
import BookReader from '../../components/BookReader';
import WorldExplorer from '../../components/WorldExplorer';
import MysticAudiobook from '../../components/MysticAudiobook';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url?: string;
  world_available?: boolean;
  audiobook_available?: boolean;
}

const ReadPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'reading' | 'exploring' | 'audiobook'>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/library/list");
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else {
        // Dados simulados para demonstração
        setBooks([
          {
            id: 'Alice_in_Wonderland',
            title: 'Alice no País das Maravilhas',
            author: 'Lewis Carroll',
            description: 'Uma aventura mágica através de um mundo fantástico cheio de criaturas extraordinárias.',
            world_available: true,
            audiobook_available: true
          },
          {
            id: 'AIlhadoTesouro(RobertLouisStevenson)',
            title: 'A Ilha do Tesouro',
            author: 'Robert Louis Stevenson',
            description: 'Uma emocionante aventura pirata em busca de tesouros perdidos.',
            world_available: true,
            audiobook_available: true
          },
          {
            id: 'OJardimSecreto(FrancesHodgsonBurnett)',
            title: 'O Jardim Secreto',
            author: 'Frances Hodgson Burnett',
            description: 'A história de uma menina que descobre um jardim mágico escondido.',
            world_available: false,
            audiobook_available: true
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadBook = (book: Book) => {
    setSelectedBook(book);
    setViewMode('reading');
  };

  const handleExploreWorld = (book: Book) => {
    setSelectedBook(book);
    setViewMode('exploring');
  };

  const handleListenAudiobook = (book: Book) => {
    setSelectedBook(book);
    setViewMode('audiobook');
  };

  const handleBackToList = () => {
    setSelectedBook(null);
    setViewMode('list');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando biblioteca mágica...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'reading' && selectedBook) {
    return <BookReader bookId={selectedBook.id} bookTitle={selectedBook.title} onBack={handleBackToList} />;
  }

  if (viewMode === 'exploring' && selectedBook) {
    return (
      <WorldExplorer 
        worldId={selectedBook.id}
        storyTitle={selectedBook.title}
        onExit={handleBackToList}
      />
    );
  }

  if (viewMode === 'audiobook' && selectedBook) {
    return (
      <MysticAudiobook
        bookId={selectedBook.id}
        bookTitle={selectedBook.title}
        onClose={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Book className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StoryLeaf READ 2.0</h1>
                <p className="text-gray-600">Explore mundos literários interativos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Powered by Árvore da Vida AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biblioteca de livros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Biblioteca Interativa</h2>
          <p className="text-gray-600">
            Escolha entre leitura tradicional, exploração imersiva de mundos 3D ou audiolivros místicos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Capa do livro */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">{book.title}</h3>
                  <p className="text-white/80 text-sm">{book.author}</p>
                </div>
                {book.world_available && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Mundo 3D
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do livro */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  {/* Removido reading_time e difficulty pois não estão na API */}
                  <span className="bg-gray-100 px-2 py-1 rounded">{book.genre || 'Fantasia'}</span>
                </div>

                {/* Botões de ação */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReadBook(book)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Book className="w-4 h-4" />
                    <span>Ler</span>
                  </button>
                  
                  {book.world_available ? (
                    <button
                      onClick={() => handleExploreWorld(book)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Explorar</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Mundo 3D</span>
                    </button>
                  )}

                  {book.audiobook_available ? (
                    <button
                      onClick={() => handleListenAudiobook(book)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Ouvir</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>Audiolivro</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de recursos */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recursos do READ 2.0</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Leitura Tradicional</h4>
              <p className="text-gray-600 text-sm">
                Experiência de leitura clássica com recursos de acessibilidade
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Exploração 3D</h4>
              <p className="text-gray-600 text-sm">
                Navegue pelos mundos das histórias em ambientes interativos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">IA Adaptativa</h4>
              <p className="text-gray-600 text-sm">
                A Árvore da Vida AI personaliza sua experiência de leitura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;


