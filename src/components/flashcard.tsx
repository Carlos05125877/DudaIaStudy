'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FlashcardProps = {
  content: string;
};

// A very simple heuristic to split question and answer.
// Assumes the first '?' separates the question from the answer.
const parseContent = (content: string) => {
  const parts = content.split('?');
  if (parts.length > 1) {
    const question = parts[0] + '?';
    const answer = parts.slice(1).join('?').trim();
    return { question, answer };
  }
  return { question: content, answer: 'Nenhuma resposta encontrada.' };
};

export function Flashcard({ content }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { question, answer } = parseContent(content);

  const cardBaseClasses = "absolute w-full h-full backface-hidden flex items-center justify-center p-6 text-center";

  return (
    <div
      className="group h-64 w-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setIsFlipped(!isFlipped) : null}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-700 transform-style-3d',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of the card */}
        <Card className={cn(cardBaseClasses, 'bg-card')}>
          <CardContent className="p-0">
            <p className="font-semibold text-lg">{question}</p>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className={cn(cardBaseClasses, 'bg-accent text-accent-foreground rotate-y-180')}>
          <CardContent className="p-0">
            <p className="text-md">{answer}</p>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
