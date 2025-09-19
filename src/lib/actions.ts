'use server';

import { generateStudyPlanFromText } from '@/ai/flows/generate-study-plan-from-text';
import { refineUploadedText } from '@/ai/flows/refine-uploaded-text-with-ai';

export async function handleRefineText(text: string) {
  try {
    const result = await refineUploadedText({ text });
    return { success: true, refinedText: result.refinedText };
  } catch (error) {
    console.error('Error refining text:', error);
    return { success: false, error: 'Falha ao refinar o texto.' };
  }
}

export async function handleGenerateStudyPlan(title: string, legalText: string) {
  try {
    const result = await generateStudyPlanFromText({ title, legalText });
    return { success: true, studyPlan: result };
  } catch (error) {
    console.error('Error generating study plan:', error);
    return { success: false, error: 'Falha ao gerar o plano de estudo.' };
  }
}
