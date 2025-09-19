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
  summary: z.string().describe('Um resumo conciso do texto jurídico, com no máximo 300 palavras.'),
  quizzes: z.array(z.string()).describe('Uma lista de 5 a 10 perguntas de múltipla escolha ou verdadeiro/falso baseadas no texto. Cada pergunta deve incluir a resposta correta e uma breve explicação.'),
  flashcards: z.array(z.string()).describe('Uma lista de 5 a 10 flashcards. Cada flashcard deve ter uma pergunta (termo ou conceito) na frente e uma resposta (definição ou explicação) no verso.'),
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
  prompt: `Você é um especialista em educação jurídica. Crie um plano de estudo claro e eficaz a partir do texto jurídico fornecido.

Texto Jurídico:
{{{legalText}}}

Título do Plano (opcional): {{{title}}}

Instruções Detalhadas:
1.  **Resumo**: Crie um resumo informativo e conciso do texto, destacando os pontos jurídicos mais importantes. Limite a 300 palavras.
2.  **Quizzes**: Elabore entre 5 e 10 perguntas de múltipla escolha ou verdadeiro/falso que testem o conhecimento sobre o texto. Para cada pergunta, forneça a questão, a resposta correta e uma breve explicação do porquê.
3.  **Flashcards**: Crie entre 5 e 10 flashcards. Cada um deve conter um termo jurídico ou conceito chave na "frente" e sua definição ou explicação no "verso", baseando-se estritamente no conteúdo do texto fornecido. Formate cada flashcard como "Frente: [pergunta]? Verso: [resposta]".

Garanta que todo o conteúdo gerado seja preciso, relevante e diretamente derivado do texto jurídico. A saída deve ser um objeto JSON válido que corresponda ao esquema definido.`,
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
