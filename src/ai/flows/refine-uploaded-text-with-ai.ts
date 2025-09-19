'use server';

/**
 * @fileOverview An AI agent that refines uploaded legal text using AI suggestions.
 *
 * - refineUploadedText - A function that refines the text with AI suggestions.
 * - RefineUploadedTextInput - The input type for the refineUploadedText function.
 * - RefineUploadedTextOutput - The return type for the refineUploadedText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineUploadedTextInputSchema = z.object({
  text: z.string().describe('The legal text to be refined.'),
});
export type RefineUploadedTextInput = z.infer<typeof RefineUploadedTextInputSchema>;

const RefineUploadedTextOutputSchema = z.object({
  refinedText: z.string().describe('The refined legal text with AI suggestions applied.'),
});
export type RefineUploadedTextOutput = z.infer<typeof RefineUploadedTextOutputSchema>;

export async function refineUploadedText(input: RefineUploadedTextInput): Promise<RefineUploadedTextOutput> {
  return refineUploadedTextFlow(input);
}

const refineUploadedTextPrompt = ai.definePrompt({
  name: 'refineUploadedTextPrompt',
  input: {schema: RefineUploadedTextInputSchema},
  output: {schema: RefineUploadedTextOutputSchema},
  prompt: `You are an AI assistant designed to refine legal texts to improve their quality and focus for study plan generation.

  Please review the following legal text and suggest refinements to enhance clarity, conciseness, and relevance. Focus on suggesting improvements that would make the text more suitable for generating summaries, quizzes, and flashcards.

  Original Text: {{{text}}}

  Refined Text:`, // Ensure the output is the refined text only
});

const refineUploadedTextFlow = ai.defineFlow(
  {
    name: 'refineUploadedTextFlow',
    inputSchema: RefineUploadedTextInputSchema,
    outputSchema: RefineUploadedTextOutputSchema,
  },
  async input => {
    const {output} = await refineUploadedTextPrompt(input);
    return output!;
  }
);
