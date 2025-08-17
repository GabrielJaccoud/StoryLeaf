'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  progress: number;
  popularity: number;
  status: 'unread' | 'reading' | 'completed';
  cover?: string;
  description: string;
  chapters: number;
  readingTime: number; // em minutos
}

interface UserProgress {
  totalBooksRead: number;
  totalReadingTime: number;
  currentStreak: number;
  orvalho: number; // XP points
  achievements: string[];
}

export default function ReadPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalBooksRead: 0,
    totalReadingTime: 0,
    currentStreak: 0,
    orvalho: 0,
    achievements: []
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tempestade' | 'primavera' | 'neblina'>('all');
  const [viewMode, setViewMode] = useState<'forest' | 'grid'>('forest');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Simular dados de livros
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: 1,
        title: "O Senhor dos Anéis",
        author: "J.R.R. Tolkien",
        genre: "fantasia",
        progress: 65,
        popularity: 95,
        status: "reading",
        description: "Uma épica jornada através da Terra Média...",
        chapters: 62,
        readingTime: 1200
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        genre: "distopia",
        progress: 100,
        popularity: 88,
        status: "completed",
        description: "Um futuro sombrio onde a liberdade é uma ilusão...",
        chapters: 23,
        readingTime: 480
      },
      {
        id: 3,
        title: "Orgulho e Preconceito",
        author: "Jane Austen",
        genre: "romance",
        progress: 0,
        popularity: 82,
        status: "unread",
        description: "Uma história de amor e sociedade na Inglaterra do século XIX...",
        chapters: 61,
        readingTime: 720
      },
      {
        id: 4,
        title: "O Nome da Rosa",
        author: "Umberto Eco",
        genre: "mistério",
        progress: 30,
        popularity: 76,
        status: "reading",
        description: "Um mistério medieval em uma abadia italiana...",
        chapters: 45,
        readingTime: 960
      },
      {
        id: 5,
        title: "Duna",
        author: "Frank Herbert",
        genre: "ficção científica",
        progress: 0,
        popularity: 91,
        status: "unread",
        description: "Uma saga épica em um planeta desértico...",
        chapters: 48,
        readingTime: 1080
      }
    ];

    setBooks(mockBooks);
    
    // Simular progresso do usuário
    setUserProgress({
      totalBooksRead: 12,
      totalReadingTime: 8640, // em minutos
      currentStreak: 7,
      orvalho: 2450,
      achievements: ["Explorador de Mundos", "Leitor Dedicado", "Detetive Literário"]
    });
  }, []);

  const getGenreColor = (genre: string) => {
    const colors = {
      'fantasia': 'from-purple-400 to-purple-600',
      'romance': 'from-pink-400 to-rose-500',
      'mistério': 'from-gray-500 to-gray-700',
      'distopia': 'from-red-500 to-red-700',
      'ficção científica': 'from-blue-400 to-blue-600',
      'default': 'from-green-400 to-green-600'
    };
    return colors[genre as keyof typeof colors] || colors.default;
  };

  const getTreeHeight = (popularity: number) => {
    return Math.max(120, (popularity / 100) * 200);
  };

  const getLeafState = (status: string, progress: number) => {
    if (status === 'completed') return '🍂'; // folhas douradas
    if (status === 'reading') return progress > 50 ? '🌿' : '🌱'; // folhas verdes ou brotos
    return '🌰'; // sementes para não lidos
  };

  const filteredBooks = books.filter(book => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'tempestade') return book.genre === 'mistério' || book.genre === 'distopia';
    if (selectedFilter === 'primavera') return book.genre === 'romance';
    if (selectedFilter === 'neblina') return book.genre === 'mistério';
    return true;
  });

  const openBookReader = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
              <h2 className="text-xl font-semibold text-emerald-600">READ - Floresta de Histórias</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-amber-100 px-3 py-1 rounded-full">
                <span className="text-amber-600">💧</span>
                <span className="font-semibold text-amber-700">{userProgress.orvalho}</span>
              </div>
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📚</span>
              <div>
                <p className="text-sm text-gray-600">Livros Lidos</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.totalBooksRead}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⏰</span>
              <div>
                <p className="text-sm text-gray-600">Tempo de Leitura</p>
                <p className="text-2xl font-bold text-gray-900">{Math.floor(userProgress.totalReadingTime / 60)}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="text-sm text-gray-600">Sequência</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.currentStreak} dias</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-sm text-gray-600">Conquistas</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.achievements.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-green-100'
              }`}
            >
              🌍 Toda Floresta
            </button>
            <button
              onClick={() => setSelectedFilter('tempestade')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'tempestade'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-gray-100'
              }`}
            >
              ⛈️ Tempestade
            </button>
            <button
              onClick={() => setSelectedFilter('primavera')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'primavera'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-pink-100'
              }`}
            >
              🌸 Primavera
            </button>
            <button
              onClick={() => setSelectedFilter('neblina')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === 'neblina'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌫️ Neblina
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('forest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'forest'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-green-100'
              }`}
            >
              🌳 Vista Floresta
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/60 text-gray-600 hover:bg-green-100'
              }`}
            >
              📋 Vista Grade
            </button>
          </div>
        </div>

        {/* Books Display */}
        {viewMode === 'forest' ? (
          /* Forest View */
          <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-8 min-h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-green-300/30 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">🌲 Sua Floresta de Histórias 🌲</h3>
              <div className="flex flex-wrap justify-center items-end space-x-4 space-y-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => openBookReader(book)}
                    style={{ height: `${getTreeHeight(book.popularity)}px` }}
                  >
                    {/* Tree Crown */}
                    <div 
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGenreColor(book.genre)} flex items-center justify-center text-2xl shadow-lg mb-2`}
                    >
                      {getLeafState(book.status, book.progress)}
                    </div>
                    
                    {/* Tree Trunk */}
                    <div className="w-4 bg-amber-700 rounded-sm flex-1 mb-2"></div>
                    
                    {/* Book Info */}
                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg text-center min-w-24 shadow-md">
                      <p className="text-xs font-semibold text-gray-800 truncate">{book.title}</p>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                      {book.status === 'reading' && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openBookReader(book)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${getGenreColor(book.genre)} flex items-center justify-center text-2xl shadow-md`}>
                    📖
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{book.chapters} capítulos</span>
                      <span>{Math.floor(book.readingTime / 60)}h {book.readingTime % 60}min</span>
                    </div>
                    
                    {book.status === 'reading' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{book.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-lg">{getLeafState(book.status, book.progress)}</span>
                      <span className="text-xs text-gray-500 capitalize">{book.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievements Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Suas Conquistas</h3>
          <div className="flex flex-wrap gap-3">
            {userProgress.achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                🏅 {achievement}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBook.title}</h2>
                  <p className="text-gray-600">{selectedBook.author}</p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{selectedBook.description}</p>
                
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-green-800 mb-2">📊 Informações do Livro</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capítulos:</span>
                      <span className="ml-2 font-medium">{selectedBook.chapters}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tempo estimado:</span>
                      <span className="ml-2 font-medium">{Math.floor(selectedBook.readingTime / 60)}h {selectedBook.readingTime % 60}min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gênero:</span>
                      <span className="ml-2 font-medium capitalize">{selectedBook.genre}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium capitalize">{selectedBook.status}</span>
                    </div>
                  </div>
                </div>

                {selectedBook.status === 'reading' && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">📖 Progresso de Leitura</h4>
                    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedBook.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-blue-700">{selectedBook.progress}% concluído</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    {selectedBook.status === 'unread' ? '🌱 Começar Leitura' : '📖 Continuar Lendo'}
                  </button>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    🕶️ Modo RA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

