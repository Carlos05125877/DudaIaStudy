'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  legalText: z.string().min(50, 'Legal text must be at least 50 characters.'),
});

type CreateStudyPlanFormProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export function CreateStudyPlanForm({ setIsOpen }: CreateStudyPlanFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const { addStudyPlan } = useStudyPlans();
  const { toast } = useToast();

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
      form.setError('legalText', { message: 'Please enter some text to refine.' });
      return;
    }
    setIsRefining(true);
    const result = await handleRefineText(legalText);
    if (result.success && result.refinedText) {
      form.setValue('legalText', result.refinedText);
      toast({
        title: 'Text Refined',
        description: 'Your text has been refined by AI.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Refinement Failed',
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
        ...result.studyPlan,
      };
      addStudyPlan(newPlan);
      toast({
        title: 'Study Plan Generated!',
        description: 'Your new study plan is ready.',
      });
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
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
              <FormLabel>Study Plan Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Contract Law Basics" {...field} />
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
              <FormLabel>Legal Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste your legal text here..."
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
                Refine with AI
            </Button>
            <Button type="submit" disabled={isGenerating || isRefining} className="flex-grow">
                {isGenerating ? <Loader2 className="animate-spin" /> : null}
                Generate Study Plan
            </Button>
        </div>
      </form>
    </Form>
  );
}
