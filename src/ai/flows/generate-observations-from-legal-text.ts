'use server';
/**
 * @fileOverview Um fluxo para gerar observações a partir de um texto jurídico.
 *
 * - generateObservations - Uma função que lida com a geração de observações a partir de um texto jurídico.
 * - GenerateObservationsInput - O tipo de entrada para a função generateObservations.
 * - GenerateObservationsOutput - O tipo de retorno para a função generateObservations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateObservationsInputSchema = z.object({
  legalText: z.string().describe('O texto jurídico a partir do qual gerar observações.'),
});
export type GenerateObservationsInput = z.infer<typeof GenerateObservationsInputSchema>;

const GenerateObservationsOutputSchema = z.object({
  observations: z.string().describe('As observações geradas a partir do texto jurídico.'),
});
export type GenerateObservationsOutput = z.infer<typeof GenerateObservationsOutputSchema>;

export async function generateObservations(input: GenerateObservationsInput): Promise<GenerateObservationsOutput> {
  return generateObservationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateObservationsPrompt',
  input: {schema: GenerateObservationsInputSchema},
  output: {schema: GenerateObservationsOutputSchema},
  prompt: `Você é um especialista em análise de textos jurídicos. Por favor, leia o seguinte texto jurídico e gere observações sobre ele.\n\nTexto Jurídico: {{{legalText}}}`,
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
