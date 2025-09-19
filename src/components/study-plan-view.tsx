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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Lightbulb, Scale, GraduationCap } from 'lucide-react';

export function StudyPlanView({ plan }: { plan: StudyPlan }) {
  const hasDeepDive = plan.deepDive && plan.deepDive.feynman;
  const hasObservations = plan.observations;

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
        <TabsTrigger value="summary">Resumo</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        {hasDeepDive && <TabsTrigger value="deep-dive">Aprofundamento</TabsTrigger>}
        {hasObservations && <TabsTrigger value="observations">Observações</TabsTrigger>}
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[60vh] pr-4">
              <p className="whitespace-pre-wrap">{plan.summary}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="flashcards" className="mt-4">
        <Carousel
          className="w-full max-w-xl mx-auto"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {plan.flashcards.map((card, index) => (
              <CarouselItem key={index}>
                <Flashcard front={card.front} back={card.back} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      </TabsContent>

      <TabsContent value="quizzes" className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {plan.quizzes.map((quiz, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{quiz.question}</AccordionTrigger>
              <AccordionContent>
                <p className="font-semibold text-primary mb-2">Resposta:</p>
                <p className="mb-4">{quiz.answer}</p>
                <p className="font-semibold text-primary mb-2">Explicação:</p>
                <p>{quiz.explanation}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      {hasDeepDive && (
        <TabsContent value="deep-dive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Técnica de Feynman: {plan.deepDive.feynman.concept}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <ScrollArea className="h-[55vh] pr-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5" />
                    Explicação Simples
                  </h3>
                  <p className="pl-7">{plan.deepDive.feynman.explanation}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <Scale className="h-5 w-5" />
                    Analogia
                  </h3>
                  <p className="pl-7">{plan.deepDive.feynman.analogy}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5" />
                    Pontos para Aprofundar
                  </h3>
                  <p className="pl-7">{plan.deepDive.feynman.gaps}</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {hasObservations && (
        <TabsContent value="observations" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[60vh] pr-4">
                <p className="whitespace-pre-wrap">{plan.observations}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
