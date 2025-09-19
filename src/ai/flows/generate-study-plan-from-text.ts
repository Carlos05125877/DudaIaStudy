'use server';
/**
 * @fileOverview Gera um plano de estudo a partir de um texto jurídico, incluindo resumos, quizzes e flashcards.
 *
 * - generateStudyPlanFromText - Uma função que gera um plano de estudo a partir de um texto.
 * - GenerateStudyPlanFromTextInput - O tipo de entrada para a função generateStudyPlanFromText.
 * - GenerateStudyPlanFromTextOutput - O tipo de retorno para a função generateStudyPlanFromText.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanFromTextInputSchema = z.object({
  legalText: z.string().describe('O texto jurídico a partir do qual gerar um plano de estudo.'),
  title: z.string().optional().describe('Título personalizado opcional para o plano de estudo.'),
});
export type GenerateStudyPlanFromTextInput = z.infer<
  typeof GenerateStudyPlanFromTextInputSchema
>;

const GenerateStudyPlanFromTextOutputSchema = z.object({
  summary: z.string().describe('Um resumo do texto jurídico.'),
  quizzes: z.array(z.string()).describe('Uma lista de quizzes gerados a partir do texto jurídico.'),
  flashcards: z.array(z.string()).describe('Uma lista de flashcards gerados a partir do texto jurídico.'),
  observations: z.string().describe('Observações sobre o texto jurídico.'),
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
  prompt: `Você é um gerador de planos de estudo de IA para textos jurídicos. Gere um plano de estudo com base no seguinte texto. Use o título {{{title}}} se fornecido.

Texto Jurídico: {{{legalText}}}

Seu plano de estudo deve incluir:

*   Um resumo do texto jurídico.
*   Uma lista de quizzes gerados a partir do texto jurídico.
*   Uma lista de flashcards gerados a partir do texto jurídico.
*   Observações sobre o texto jurídico.

Siga estas instruções:
*   Cada quiz e flashcard deve ser uma pergunta.
*   O texto jurídico deve ser interpretável com sua saída.
*   A saída deve ser um JSON válido.

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
