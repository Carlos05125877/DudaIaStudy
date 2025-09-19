'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Brain, Repeat } from 'lucide-react';

type FlashcardProps = {
  front: string;
  back: string;
};

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardBaseClasses = "absolute w-full h-full backface-hidden flex items-center justify-center p-6 text-center rounded-xl transition-all duration-500";

  return (
    <div
      className="group h-80 w-full perspective-1000 cursor-pointer"
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
        <Card className={cn(cardBaseClasses, 'bg-card border-2 shadow-lg')}>
          <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
            <Brain className="h-10 w-10 text-primary" />
            <p className="font-headline text-2xl">{front}</p>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className={cn(cardBaseClasses, 'bg-primary text-primary-foreground border-2 border-primary rotate-y-180 shadow-lg')}>
          <CardContent className="p-0 [transform:rotateY(-180deg)]">
            <p className="text-md">{back}</p>
          </CardContent>
        </Card>
      </div>

      {/* Flip instruction */}
      <div className="flex items-center justify-center text-sm text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Repeat className="h-4 w-4 mr-2" />
        Clique para virar
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
