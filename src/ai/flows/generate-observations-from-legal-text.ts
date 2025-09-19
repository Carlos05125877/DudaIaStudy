'use server';
/**
 * @fileOverview Um fluxo para gerar observações e pontos de atenção a partir de um texto jurídico.
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
  observations: z.string().describe('Uma análise aprofundada e detalhada dos pontos de atenção, ambiguidades ou implicações práticas do texto jurídico.'),
});
export type GenerateObservationsOutput = z.infer<typeof GenerateObservationsOutputSchema>;

export async function generateObservations(input: GenerateObservationsInput): Promise<GenerateObservationsOutput> {
  return generateObservationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateObservationsPrompt',
  input: {schema: GenerateObservationsInputSchema},
  output: {schema: GenerateObservationsOutputSchema},
  prompt: `Você é um advogado sênior altamente experiente, com notório saber jurídico, preparando um parecer detalhado sobre um documento para um cliente importante. Sua análise precisa ser exaustiva, minuciosa e academicamente robusta. Leia o texto jurídico abaixo e destrinche todos os pontos de atenção.

Texto Jurídico:
{{{legalText}}}

Sua análise deve ser extremamente aprofundada, focando em:
-   **Pontos Críticos e Estratégicos**: Quais são as cláusulas ou artigos mais importantes e por quê? Quais são as implicações estratégicas de cada um?
-   **Análise de Riscos e Ambiguidades**: Identifique todos os termos vagos, potenciais brechas, riscos ocultos e passivos contingentes. Aprofunde-se nas possíveis interpretações e seus cenários.
-   **Fundamentação Jurídica**: Para cada ponto relevante, cite o artigo de lei específico (ex: do Código Civil, CLT, etc.), súmulas de tribunais superiores, ou doutrina consagrada que embase sua análise. Não faça uma análise superficial.
-   **Implicações Práticas e Operacionais**: Como este texto se traduzirá em operações do dia a dia? Quais são as consequências práticas, financeiras e operacionais de cada termo?
-   **Recomendações e Pontos de Ação**: Com base na sua análise, forneça recomendações claras e pontos de ação estratégicos para o cliente.

Formate suas observações como um parecer jurídico completo, coeso e de fácil compreensão, mas sem sacrificar a profundidade técnica e a fundamentação legal.`,
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
