import { type CoreMessage, streamText } from 'ai';
import { z } from 'zod';
import { tool } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { model } from './ai';
import { DOCS_BASE_HOST } from './config';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(null, { status: 405 });
    }

    // Only accept requests to chat
    if (url.pathname !== "/api/chat") {
      return new Response(null, { status: 404 });
    }


    const ai = env.AI;
    if (!ai) {
      return new Response('AI not defined', { status: 500 });
    }

    const { messages } = (await request.json()) as { messages: CoreMessage[] };

    const result = streamText({
      system: SYSTEM_PROMPT,
      model,
      temperature: 0,
      maxRetries: 2,
      maxTokens: 8192,
      maxSteps: 5,
      messages,
      tools: {
        search_docs: tool({
          description: 'Search the Groq documentation. Returns a string with the search results of relevant documentation pages.',
          parameters: z.object({
            query: z.string().describe('The query to search the documentation for, such as "responses api" or "structured outputs"')
          }),
          execute: async ({ query }) => {
            const searchResponse = await ai.autorag(env.AI_SEARCH_NAME).search({
              query,
              rewrite_query: false,
              max_num_results: 10,
              ranking_options: {
                score_threshold: 0.4
              }
            });

            if (searchResponse.data.length === 0) {
              return '<no search results found>';
            }

            return searchResponse.data.map((item) => {
              const url = new URL(item.filename);
              url.hostname = DOCS_BASE_HOST;
              return `<file name="${url.toString()}">${item.content.map((content) => content.text).join('\n\n')}</file>`;
            }).join('\n\n');
          },
        }),
      },
      // onFinish: (result) => {
      //   console.log('Finished:', result);
      // },
      onError: (error) => {
        console.error(error);
      },
    })

    return result.toDataStreamResponse();
  },
} satisfies ExportedHandler<Env>;
