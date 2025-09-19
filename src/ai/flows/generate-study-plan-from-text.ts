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
    .describe('Um resumo exaustivo e detalhado do texto jurídico.'),
  quizzes: z
    .array(
      z.object({
        question: z.string().describe('A pergunta do quiz.'),
        answer: z.string().describe('A resposta correta para a pergunta.'),
        explanation: z
          .string()
          .describe('Uma explicação detalhada sobre a resposta.'),
      })
    )
    .describe(
      'Uma lista de 5 a 10 perguntas (múltipla escolha ou V/F) baseadas no texto.'
    ),
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('O termo ou conceito na frente do flashcard.'),
        back: z.string().describe('A definição ou explicação detalhada no verso do flashcard.'),
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
          'Uma explicação detalhada do conceito em termos muito simples, como se fosse para uma criança de 12 anos, mas sem perder a profundidade.'
        ),
      analogy: z
        .string()
        .describe(
          'Uma analogia ou exemplo do dia a dia bem elaborado para ilustrar o conceito.'
        ),
      gaps: z
        .string()
        .describe(
          'Pontos onde a explicação simplificada pode falhar e uma análise aprofundada das áreas que precisariam de mais estudo para um entendimento completo.'
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
  prompt: `Você é um jurista e educador sênior, conhecido por sua capacidade de ensinar temas complexos de forma profunda e clara. Sua tarefa é criar um plano de estudo exaustivo a partir do texto jurídico fornecido. O conteúdo gerado deve ser o mais detalhado e aprofundado possível. Destrinche totalmente o assunto.

Texto Jurídico:
{{{legalText}}}

Título do Plano (opcional): {{{title}}}

Instruções Detalhadas:
1.  **Resumo Aprofundado**: Crie um resumo exaustivo e detalhado do texto. Não se limite a uma visão geral; explore as nuances, os princípios subjacentes e as implicações de cada parte do texto.
2.  **Quizzes Desafiadores**: Elabore entre 5 e 10 perguntas que testem um entendimento profundo do texto. Para cada pergunta, forneça a resposta correta e uma explicação detalhada e abrangente.
3.  **Flashcards Completos**: Crie entre 5 e 10 flashcards. A "frente" deve ter um termo-chave. O "verso" deve conter uma definição completa e detalhada, incluindo contexto e exemplos.
4.  **Aprofundamento (Técnica de Feynman Avançada)**: Identifique o conceito central do texto. Explique-o de forma extremamente clara, mas sem sacrificar a profundidade. Use uma analogia robusta e bem desenvolvida. Ao final, faça uma análise crítica das lacunas e complexidades, indicando caminhos para um estudo ainda mais aprofundado.

Garanta que todo o conteúdo seja preciso, relevante e diretamente derivado do texto jurídico. A saída deve ser um objeto JSON válido que corresponda ao esquema definido.`,
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
