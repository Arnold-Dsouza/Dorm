
'use client';

/**
 * @fileOverview A flow for handling user feedback.
 *
 * - sendFeedback - A function that handles the feedback submission process.
 * - SendFeedbackInput - The input type for the sendFeedback function.
 * - SendFeedbackOutput - The return type for the sendFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SendFeedbackInputSchema = z.object({
  feedback: z.string().describe('The user feedback text.'),
});
export type SendFeedbackInput = z.infer<typeof SendFeedbackInputSchema>;

const SendFeedbackOutputSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully submitted.'),
});
export type SendFeedbackOutput = z.infer<typeof SendFeedbackOutputSchema>;

export async function sendFeedback(input: SendFeedbackInput): Promise<SendFeedbackOutput> {
  return sendFeedbackFlow(input);
}

const sendFeedbackFlow = ai.defineFlow(
  {
    name: 'sendFeedbackFlow',
    inputSchema: SendFeedbackInputSchema,
    outputSchema: SendFeedbackOutputSchema,
  },
  async (input) => {
    // In a real application, you would send this feedback to a database,
    // a support system, or an email address.
    console.log('Received feedback:', input.feedback);

    // For now, we'll just simulate a successful submission.
    return { success: true };
  }
);
