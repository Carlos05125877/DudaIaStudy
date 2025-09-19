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
  observations: z.string().describe('Uma análise dos pontos de atenção, ambiguidades ou implicações práticas do texto jurídico.'),
});
export type GenerateObservationsOutput = z.infer<typeof GenerateObservationsOutputSchema>;

export async function generateObservations(input: GenerateObservationsInput): Promise<GenerateObservationsOutput> {
  return generateObservationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateObservationsPrompt',
  input: {schema: GenerateObservationsInputSchema},
  output: {schema: GenerateObservationsOutputSchema},
  prompt: `Você é um advogado experiente analisando um documento para um colega júnior. Leia o texto jurídico abaixo e identifique os principais pontos de atenção.

Texto Jurídico:
{{{legalText}}}

Sua análise deve focar em:
-   **Pontos Críticos**: Quais são as cláusulas ou artigos mais importantes e por quê?
-   **Ambiguidades ou Riscos**: Existem termos vagos, potenciais brechas ou riscos que um estudante de direito deva notar?
-   **Implicações Práticas**: Como este texto se aplica em situações reais? Quais são as consequências práticas dos seus termos?

Formate suas observações como um texto coeso e de fácil compreensão.`,
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
