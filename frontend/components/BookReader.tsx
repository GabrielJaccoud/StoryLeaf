
import React, { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url?: string;
  content: string;
  reading_time: number;
  difficulty: string;
  genre: string;
  world_available?: boolean;
}

interface BookReaderProps {
  book: Book;
  onBack: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onBack }) => {
  const [chapterContent, setChapterContent] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState<number>(1);

  useEffect(() => {
    // Simular carregamento de conteúdo do capítulo
    if (book && book.content) {
      // Aqui você pode dividir o conteúdo do livro em capítulos se necessário
      // Por enquanto, vamos usar o conteúdo completo como um único capítulo
      setChapterContent(book.content);
    }
  }, [book]);

  if (!book) {
    return <div className="p-6 text-center text-gray-500">Selecione um livro para ler.</div>;
  }

  return (
    <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Capítulo {currentChapter}: {book.title}</h3>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: chapterContent }} />
      {/* Adicione controles de navegação entre capítulos aqui, se houver múltiplos capítulos */}
    </div>
  );
};

export default BookReader;


