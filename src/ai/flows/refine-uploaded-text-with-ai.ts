'use server';

/**
 * @fileOverview Um agente de IA que refina o texto jurídico enviado usando sugestões de IA.
 *
 * - refineUploadedText - Uma função que refina o texto com sugestões de IA.
 * - RefineUploadedTextInput - O tipo de entrada para a função refineUploadedText.
 * - RefineUploadedTextOutput - O tipo de retorno para a função refineUploadedText.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineUploadedTextInputSchema = z.object({
  text: z.string().describe('O texto jurídico a ser refinado.'),
});
export type RefineUploadedTextInput = z.infer<typeof RefineUploadedTextInputSchema>;

const RefineUploadedTextOutputSchema = z.object({
  refinedText: z.string().describe('O texto jurídico refinado com as sugestões de IA aplicadas.'),
});
export type RefineUploadedTextOutput = z.infer<typeof RefineUploadedTextOutputSchema>;

export async function refineUploadedText(input: RefineUploadedTextInput): Promise<RefineUploadedTextOutput> {
  return refineUploadedTextFlow(input);
}

const refineUploadedTextPrompt = ai.definePrompt({
  name: 'refineUploadedTextPrompt',
  input: {schema: RefineUploadedTextInputSchema},
  output: {schema: RefineUploadedTextOutputSchema},
  prompt: `Você é um assistente de IA projetado para refinar textos jurídicos para melhorar sua qualidade e foco para a geração de planos de estudo.

  Por favor, revise o seguinte texto jurídico e sugira refinamentos para melhorar a clareza, concisão e relevância. Concentre-se em sugerir melhorias que tornariam o texto mais adequado para gerar resumos, quizzes e flashcards.

  Texto Original: {{{text}}}

  Texto Refinado:`, // Garanta que a saída seja apenas o texto refinado
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
