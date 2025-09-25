# Groq Documentation Chat

**AI-powered documentation assistant that helps developers build AI applications with Groq's fast inference platform**



https://github.com/user-attachments/assets/b95d9232-f82e-45c4-8044-94ce75ef8925


## Live Demo

[**Try it out now!**](https://groq-docs-chat.groqcloud.dev/)


## Overview

This application demonstrates intelligent documentation search and assistance using [Groq's API](https://console.groq.com/home) for lightning-fast AI responses with [Cloudflare's AI Search capabilities](https://developers.cloudflare.com/ai-search/). Built as a complete, end-to-end template that you can fork, customize, and deploy to help users navigate and understand AI documentation.

**Key Features:**
- Real-time AI-powered documentation search using [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/) + [Groq Inference](https://console.groq.com/home)
- Interactive chat interface with streaming responses
- Tool-based architecture with expandable search indicators
- Chunked markdown rendering for better UX during streaming
- Sub-second response times, efficient concurrent request handling, and production-grade performance powered by Groq

## Architecture

**Tech Stack:**
- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Cloudflare Workers with AI Search
- **AI Infrastructure:** Groq API with multiple model fallbacks, powered by [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/)
- **Deployment:** Cloudflare Workers
- **Styling:** CSS Modules with custom components

## Quick Start

### Prerequisites
- Node.js 20+ and npm
- Groq API key ([Create a free GroqCloud account and generate an API key here](https://console.groq.com/keys))
- Cloudflare account with Workers and AI enabled

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/build-with-groq/groq-docs-chat
   cd groq-docs-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Cloudflare AI Gateway and enable Groq as a Provider:**
    a. [Cloudflare AI Gateway + Groq documentation](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/)
    b. Get a [Groq API Key](https://console.groq.com/keys)

4. [**Create a Cloudflare AI Search**](https://developers.cloudflare.com/ai-search/)

3. **Configure environment variables**
   Create a `.env.local` file or set these in your Cloudflare Worker:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_AI_GATEWAY_ID=your_ai_gateway_id
   AI_SEARCH_NAME=your_ai_search_search_name
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Deploy to Cloudflare**
   ```bash
   npm run deploy
   ```

## Customization
This template is designed to be a foundation for you to get started with. Key areas for customization:
- **Model Selection:** Update Groq model configuration in `worker/ai.ts:17-18`
- **Search Integration:** Modify AI Search parameters in `worker/index.ts:58-65`
- **UI/Styling:** Customize themes and components in `src/styles.module.css`
- **System Prompt:** Adjust AI behavior in `worker/prompt.ts`

## Next Steps
### For Developers
- **Create your free GroqCloud account:** Access official API docs, the playground for experimentation, and more resources via [Groq Console](https://console.groq.com).
- **Build and customize:** Fork this repo and start customizing to build out your own AI-powered documentation assistant.
- **Get support:** Connect with other developers building on Groq, chat with our team, and submit feature requests on our [Groq Developer Forum](https://community.groq.com).
### For Founders and Business Leaders
- **See enterprise capabilities:** This template showcases production-ready AI that can handle realtime business workloads. Explore other applications and use cases.
- **Discuss Your needs:** [Contact our team](https://groq.com/enterprise-access/) to explore how Groq can accelerate your AI initiatives.


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Credits
Created by [Ben Ankiel](https://www.linkedin.com/in/ben-ankiel).
