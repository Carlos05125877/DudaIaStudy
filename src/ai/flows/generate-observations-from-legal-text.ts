'use server';
/**
 * @fileOverview A flow to generate observations from legal text.
 *
 * - generateObservations - A function that handles the generation of observations from legal text.
 * - GenerateObservationsInput - The input type for the generateObservations function.
 * - GenerateObservationsOutput - The return type for the generateObservations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateObservationsInputSchema = z.object({
  legalText: z.string().describe('The legal text to generate observations from.'),
});
export type GenerateObservationsInput = z.infer<typeof GenerateObservationsInputSchema>;

const GenerateObservationsOutputSchema = z.object({
  observations: z.string().describe('The observations generated from the legal text.'),
});
export type GenerateObservationsOutput = z.infer<typeof GenerateObservationsOutputSchema>;

export async function generateObservations(input: GenerateObservationsInput): Promise<GenerateObservationsOutput> {
  return generateObservationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateObservationsPrompt',
  input: {schema: GenerateObservationsInputSchema},
  output: {schema: GenerateObservationsOutputSchema},
  prompt: `You are an expert in legal text analysis. Please read the following legal text and generate observations about it.\n\nLegal Text: {{{legalText}}}`,
});

const generateObservationsFlow = ai.defineFlow(
  {
    name: 'generateObservationsFlow',
    inputSchema: GenerateObservationsInputSchema,
    outputSchema: GenerateObservationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
