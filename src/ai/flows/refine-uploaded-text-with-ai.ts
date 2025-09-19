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
  refinedText: z.string().describe('O texto jurídico reescrito para máxima clareza, profundidade e adequação para fins de estudo.'),
});
export type RefineUploadedTextOutput = z.infer<typeof RefineUploadedTextOutputSchema>;

export async function refineUploadedText(input: RefineUploadedTextInput): Promise<RefineUploadedTextOutput> {
  return refineUploadedTextFlow(input);
}

const refineUploadedTextPrompt = ai.definePrompt({
  name: 'refineUploadedTextPrompt',
  input: {schema: RefineUploadedTextInputSchema},
  output: {schema: RefineUploadedTextOutputSchema},
  prompt: `Você é um editor jurídico sênior, especializado em transformar textos densos em materiais de estudo claros e profundos. Sua tarefa é refinar o texto abaixo para que ele seja a base ideal para uma análise jurídica aprofundada.

Instruções:
1.  **Clareza e Profundidade**: Aumente a clareza e a concisão, mas, crucialmente, adicione contexto ou explicações onde for necessário para aprofundar o entendimento. Não perca nenhum detalhe jurídico importante.
2.  **Estrutura Lógica**: Organize o texto de forma impecavelmente lógica. Use parágrafos bem definidos, listas e outros elementos para criar uma estrutura que facilite a análise e o estudo.
3.  **Jargão com Contexto**: Não elimine jargões importantes. Em vez disso, certifique-se de que seu significado seja absolutamente claro no contexto do documento.
4.  **Resultado Puro**: O resultado deve ser apenas o texto refinado, pronto para ser usado como material de estudo principal.

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
