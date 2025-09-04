import React, { useState, useEffect } from 'react';
import { Book, Play, Eye, Sparkles, Download, FileText } from 'lucide-react';

interface ProcessedBook {
  id: string;
  title: string;
  filename: string;
  status: string;
  world_compatible: boolean;
  audiobook_compatible: boolean;
}

interface BookContent {
  id: string;
  title: string;
  content: string;
  sections: Array<{
    id: number;
    title: string;
    content: string;
    word_count: number;
  }>;
  word_count: number;
  reading_time_minutes: number;
}

interface BookLibraryProps {
  onBookSelect: (book: BookContent) => void;
  onWorldExplore: (bookId: string) => void;
  onAudiobookPlay: (bookId: string) => void;
}

const BookLibrary: React.FC<BookLibraryProps> = ({
  onBookSelect,
  onWorldExplore,
  onAudiobookPlay
}) => {
  const [books, setBooks] = useState<ProcessedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books/list');
      
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books || []);
      } else {
        throw new Error('Falha ao carregar livros');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRead = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}/content`);
      
      if (response.ok) {
        const data = await response.json();
        onBookSelect(data.book);
      } else {
        throw new Error('Falha ao carregar conteúdo do livro');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar livro');
    }
  };

  const getBookCover = (bookId: string) => {
    // Mapeia IDs de livros para cores/gradientes temáticos
    const coverStyles: { [key: string]: string } = {
      'Alice_in_Wonderland': 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
      'AIlhadoTesouro': 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
      'DomQuixote': 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600',
      'PeterPan': 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
      'OMágicodeOz': 'bg-gradient-to-br from-yellow-300 via-green-400 to-emerald-500',
      'OJardimSecreto': 'bg-gradient-to-br from-pink-300 via-rose-400 to-red-500',
      'iracema': 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
      'ViagemaoCentrodaTerra': 'bg-gradient-to-br from-gray-400 via-stone-500 to-slate-600'
    };

    return coverStyles[bookId] || 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
  };

  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Erro ao carregar biblioteca</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        <button
          onClick={fetchBooks}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Biblioteca Digital StoryLeaf
        </h2>
        <p className="text-gray-600">
          Explore clássicos da literatura com tecnologia imersiva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Capa do livro */}
            <div className={`h-48 ${getBookCover(book.id)} flex items-center justify-center`}>
              <div className="text-white text-center p-4">
                <Book className="h-12 w-12 mx-auto mb-2" />
                <h3 className="font-bold text-lg leading-tight">
                  {book.title}
                </h3>
              </div>
            </div>

            {/* Informações do livro */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{book.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.status === 'processed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {book.status === 'processed' ? 'Processado' : 'Processando'}
                  </span>
                </div>
              </div>

              {/* Recursos disponíveis */}
              <div className="flex flex-wrap gap-2 mb-4">
                {book.world_compatible && (
                  <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    <Eye className="h-3 w-3" />
                    WorldExplorer
                  </span>
                )}
                {book.audiobook_compatible && (
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <Play className="h-3 w-3" />
                    Audiobook
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  IA Árvore
                </span>
              </div>

              {/* Botões de ação */}
              <div className="space-y-2">
                <button
                  onClick={() => handleBookRead(book.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Book className="h-4 w-4" />
                  Ler Livro
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {book.world_compatible && (
                    <button
                      onClick={() => onWorldExplore(book.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Eye className="h-3 w-3" />
                      Explorar
                    </button>
                  )}
                  
                  {book.audiobook_compatible && (
                    <button
                      onClick={() => onAudiobookPlay(book.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Play className="h-3 w-3" />
                      Ouvir
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-gray-500">
            Os livros processados aparecerão aqui quando estiverem prontos.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookLibrary;

