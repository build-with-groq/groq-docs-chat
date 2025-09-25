import { createGroq } from '@ai-sdk/groq';
import { createAiGateway } from 'ai-gateway-provider';
import { env } from 'cloudflare:workers';

export const aigateway = createAiGateway({
  accountId: env.CLOUDFLARE_ACCOUNT_ID!,
  gateway: env.CLOUDFLARE_AI_GATEWAY_ID!,
  apiKey: env.CLOUDFLARE_AI_GATEWAY_API_KEY,
});

export const groq = createGroq({
  apiKey: env.GROQ_API_KEY ?? "",
  baseURL: env.GROQ_BASE_URL || undefined
});

export const model = aigateway([
  groq('openai/gpt-oss-20b'),
  groq('llama-3.1-8b-instant')
]);