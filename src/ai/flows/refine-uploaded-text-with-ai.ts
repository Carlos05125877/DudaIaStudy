'use server';

/**
 * @fileOverview Um agente de IA que refina o texto jurídico enviado para otimizá-lo para a criação de materiais de estudo.
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
  refinedText: z.string().describe('O texto jurídico reescrito para maior clareza e adequação para fins de estudo.'),
});
export type RefineUploadedTextOutput = z.infer<typeof RefineUploadedTextOutputSchema>;

export async function refineUploadedText(input: RefineUploadedTextInput): Promise<RefineUploadedTextOutput> {
  return refineUploadedTextFlow(input);
}

const refineUploadedTextPrompt = ai.definePrompt({
  name: 'refineUploadedTextPrompt',
  input: {schema: RefineUploadedTextInputSchema},
  output: {schema: RefineUploadedTextOutputSchema},
  prompt: `Você é um editor jurídico especializado em simplificar textos complexos para estudantes. Sua tarefa é refinar o texto abaixo para que ele seja ideal para a criação de resumos, quizzes e flashcards.

Instruções:
1.  Melhore a clareza e a concisão sem perder o significado jurídico.
2.  Estruture o texto de forma lógica, usando parágrafos curtos e, se apropriado, listas.
3.  Elimine jargões desnecessários ou explique-os de forma simples.
4.  O resultado deve ser apenas o texto refinado, sem comentários adicionais.

Texto Original:
{{{text}}}

Texto Refinado:`,
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
