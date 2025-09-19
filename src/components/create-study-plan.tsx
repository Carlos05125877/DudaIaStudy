'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateStudyPlan, handleRefineText } from '@/lib/actions';
import { useStudyPlans } from '@/hooks/use-study-plans';
import { Loader2, Sparkles } from 'lucide-react';
import type { StudyPlan } from '@/lib/types';
import { DialogClose } from './ui/dialog';

const formSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  legalText: z.string().min(50, 'O texto jurídico deve ter pelo menos 50 caracteres.'),
});

export function CreateStudyPlanForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const { addStudyPlan } = useStudyPlans();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      legalText: '',
    },
  });

  const onRefine = async () => {
    const legalText = form.getValues('legalText');
    if (!legalText) {
      form.setError('legalText', { message: 'Por favor, insira algum texto para refinar.' });
      return;
    }
    setIsRefining(true);
    const result = await handleRefineText(legalText);
    if (result.success && result.refinedText) {
      form.setValue('legalText', result.refinedText);
      toast({
        title: 'Texto Refinado',
        description: 'Seu texto foi refinado pela IA.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Refinamento',
        description: result.error,
      });
    }
    setIsRefining(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    const result = await handleGenerateStudyPlan(values.title, values.legalText);
    
    if (result.success && result.studyPlan) {
      const newPlan: StudyPlan = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        title: values.title,
        sourceText: values.legalText,
        summary: result.studyPlan.summary,
        quizzes: result.studyPlan.quizzes,
        flashcards: result.studyPlan.flashcards,
        deepDive: result.studyPlan.deepDive,
        observations: result.studyPlan.observations,
      };
      addStudyPlan(newPlan);
      toast({
        title: 'Plano de Estudo Gerado!',
        description: 'Seu novo plano de estudo está pronto.',
      });
      router.push(`/study-plans/${newPlan.id}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha na Geração',
        description: result.error,
      });
    }
    setIsGenerating(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Plano de Estudo</FormLabel>
              <FormControl>
                <Input placeholder="ex: Noções Básicas de Direito Contratual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto Jurídico</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cole seu texto jurídico aqui..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onRefine} disabled={isRefining || isGenerating}>
                {isRefining ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Refinar com IA
            </Button>
            <Button type="submit" disabled={isGenerating || isRefining} className="flex-grow">
                {isGenerating ? <Loader2 className="animate-spin" /> : null}
                Gerar Plano de Estudo
            </Button>
        </div>
      </form>
    </Form>
  );
}
