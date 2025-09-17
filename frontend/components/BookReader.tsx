import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface BookReaderProps {
  bookId: string;
  bookTitle: string;
  onBack: () => void;
}

interface Section {
  id: number;
  title: string;
  content: string;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId, bookTitle, onBack }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/library/${bookId}/content`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.book && data.book.sections) {
          setSections(data.book.sections);
        } else {
          setError('Formato de dados do livro inválido.');
        }
      } catch (err) {
        console.error('Erro ao buscar conteúdo do livro:', err);
        setError('Não foi possível carregar o conteúdo do livro.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookContent();
    }
  }, [bookId]);

  const currentSection = sections[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Carregando livro...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Erro: {error}</div>;
  }

  if (!currentSection) {
    return <div className="p-6 text-center text-gray-500">Nenhuma seção encontrada para este livro.</div>;
  }

  return (
    <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
      <button onClick={onBack} className="mb-4 flex items-center text-green-600 hover:text-green-800">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar para a Biblioteca
      </button>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{bookTitle} - {currentSection.title}</h3>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentSection.content }} />

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousSection}
          disabled={currentSectionIndex === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l-lg disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-600 py-2 px-4">
          Seção {currentSectionIndex + 1} de {sections.length}
        </span>
        <button
          onClick={handleNextSection}
          disabled={currentSectionIndex === sections.length - 1}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default BookReader;


