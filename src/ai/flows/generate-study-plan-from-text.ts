'use server';
/**
 * @fileOverview Generates a study plan from legal text, including summaries, quizzes, and flashcards.
 *
 * - generateStudyPlanFromText - A function that generates a study plan from text.
 * - GenerateStudyPlanFromTextInput - The input type for the generateStudyPlanFromText function.
 * - GenerateStudyPlanFromTextOutput - The return type for the generateStudyPlanFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanFromTextInputSchema = z.object({
  legalText: z.string().describe('The legal text to generate a study plan from.'),
  title: z.string().optional().describe('Optional custom title for the study plan.'),
});
export type GenerateStudyPlanFromTextInput = z.infer<
  typeof GenerateStudyPlanFromTextInputSchema
>;

const GenerateStudyPlanFromTextOutputSchema = z.object({
  summary: z.string().describe('A summary of the legal text.'),
  quizzes: z.array(z.string()).describe('A list of quizzes generated from the legal text.'),
  flashcards: z.array(z.string()).describe('A list of flashcards generated from the legal text.'),
  observations: z.string().describe('Observations about the legal text.'),
});

export type GenerateStudyPlanFromTextOutput = z.infer<
  typeof GenerateStudyPlanFromTextOutputSchema
>;

export async function generateStudyPlanFromText(
  input: GenerateStudyPlanFromTextInput
): Promise<GenerateStudyPlanFromTextOutput> {
  return generateStudyPlanFromTextFlow(input);
}

const generateStudyPlanPrompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanFromTextInputSchema},
  output: {schema: GenerateStudyPlanFromTextOutputSchema},
  prompt: `You are an AI study plan generator for legal texts. Generate a study plan based on the following text. Use the title {{{title}}} if provided.

Legal Text: {{{legalText}}}

Your study plan should include:

*   A summary of the legal text.
*   A list of quizzes generated from the legal text.
*   A list of flashcards generated from the legal text.
*   Observations about the legal text.

Follow these instructions:
*   Each quiz and flashcard should be a question.
*   The legal text should be interpretable with your output.
*   The output should be valid JSON.

`,
});

const generateStudyPlanFromTextFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFromTextFlow',
    inputSchema: GenerateStudyPlanFromTextInputSchema,
    outputSchema: GenerateStudyPlanFromTextOutputSchema,
  },
  async input => {
    const {output} = await generateStudyPlanPrompt(input);
    return output!;
  }
);
