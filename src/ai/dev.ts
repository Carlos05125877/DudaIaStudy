import { config } from 'dotenv';
config();

import '@/ai/flows/generate-study-plan-from-text.ts';
import '@/ai/flows/refine-uploaded-text-with-ai.ts';
import '@/ai/flows/generate-observations-from-legal-text.ts';