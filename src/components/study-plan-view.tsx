'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Flashcard } from './flashcard';
import type { StudyPlan } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

type StudyPlanViewProps = {
  plan: StudyPlan;
};

// A very simple heuristic to split quiz question and answer.
// Assumes the first '?' separates the question from the answer.
const parseQuizContent = (content: string) => {
    const parts = content.split('?');
    if (parts.length > 1) {
      const question = parts[0] + '?';
      const answer = parts.slice(1).join('?').trim();
      return { question, answer };
    }
    return { question: content, answer: 'Nenhuma resposta encontrada.' };
  };

export function StudyPlanView({ plan }: StudyPlanViewProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="summary">Resumo</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="observations">Observações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="mt-4">
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[60vh]">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{plan.summary}</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="flashcards" className="mt-4">
        <Carousel className="w-full max-w-xl mx-auto" opts={{ loop: true }}>
          <CarouselContent>
            {plan.flashcards.map((card, index) => (
              <CarouselItem key={index}>
                <Flashcard content={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TabsContent>

      <TabsContent value="quizzes" className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {plan.quizzes.map((quiz, index) => {
            const { question, answer } = parseQuizContent(quiz);
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </TabsContent>

      <TabsContent value="observations" className="mt-4">
        <Card>
          <CardContent className="p-6">
             <ScrollArea className="h-[60vh]">
                <p className="whitespace-pre-wrap">{plan.observations}</p>
             </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
