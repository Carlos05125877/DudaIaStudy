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
  legalText: z
    .string()
    .describe('O texto jurídico a partir do qual gerar um plano de estudo.'),
  title: z
    .string()
    .optional()
    .describe('Título personalizado opcional para o plano de estudo.'),
});
export type GenerateStudyPlanFromTextInput = z.infer<
  typeof GenerateStudyPlanFromTextInputSchema
>;

const GenerateStudyPlanFromTextOutputSchema = z.object({
  summary: z
    .string()
    .describe('Um resumo conciso do texto jurídico, com no máximo 300 palavras.'),
  quizzes: z
    .array(
      z.object({
        question: z.string().describe('A pergunta do quiz.'),
        answer: z.string().describe('A resposta correta para a pergunta.'),
        explanation: z
          .string()
          .describe('Uma breve explicação sobre a resposta.'),
      })
    )
    .describe(
      'Uma lista de 5 a 10 perguntas (múltipla escolha ou V/F) baseadas no texto.'
    ),
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('O termo ou conceito na frente do flashcard.'),
        back: z.string().describe('A definição ou explicação no verso do flashcard.'),
      })
    )
    .describe('Uma lista de 5 a 10 flashcards.'),
  deepDive: z.object({
    feynman: z.object({
      concept: z
        .string()
        .describe(
          'O principal conceito jurídico do texto a ser explicado.'
        ),
      explanation: z
        .string()
        .describe(
          'Uma explicação do conceito em termos muito simples, como se fosse para uma criança de 12 anos.'
        ),
      analogy: z
        .string()
        .describe(
          'Uma analogia ou exemplo do dia a dia para ilustrar o conceito.'
        ),
      gaps: z
        .string()
        .describe(
          'Pontos onde a explicação simplificada pode falhar ou áreas que precisariam de mais estudo para um entendimento completo.'
        ),
    }),
  }),
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
2.  **Quizzes**: Elabore entre 5 e 10 perguntas (múltipla escolha ou verdadeiro/falso) que testem o conhecimento sobre o texto. Para cada pergunta, forneça a questão, a resposta correta e uma breve explicação.
3.  **Flashcards**: Crie entre 5 e 10 flashcards. Cada um deve conter um termo ou conceito chave na "frente" e sua definição ou explicação no "verso".
4.  **Aprofundamento (Técnica de Feynman)**: Identifique o conceito central do texto. Explique-o de forma extremamente simples, como se estivesse ensinando a alguém sem conhecimento jurídico. Use uma analogia do cotidiano e, ao final, aponte quais são as lacunas ou simplificações em sua explicação que um estudante precisaria aprofundar.

Garanta que todo o conteúdo gerado seja preciso, relevante e diretamente derivado do texto jurídico. A saída deve ser um objeto JSON válido que corresponda ao esquema definido.`,
});

const generateStudyPlanFromTextFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFromTextFlow',
    inputSchema: GenerateStudyPlanFromTextInputSchema,
    outputSchema: GenerateStudyPlanFromTextOutputSchema,
  },
  async (input) => {
    const {output} = await generateStudyPlanPrompt(input);
    return output!;
  }
);
