import { Injectable } from '@nestjs/common';
import { ChatAIResponse, IChatAI } from './chat-ai.interface';

@Injectable()
export class StubChatAI implements IChatAI {
  async generateResponse(
    messages: {
      role: string;
      content: string;
      files?: { mimeType: string; storedName: string }[];
    }[],
  ): Promise<ChatAIResponse> {
    const last = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (/hello|hi|hey|xin chào|chào/.test(last)) {
      return {
        content: "Hello! I'm your AI assistant. How can I help you today?",
        suggestedActions: ['What can you do?', 'Help me write something', 'Explain a concept'],
      };
    }

    if (/what can you do|help|capabilities/.test(last)) {
      return {
        content: `I can help you with:\n- **Writing** — emails, essays, summaries\n- **Coding** — explain, debug, review code\n- **Research** — answer questions, explain concepts\n- **Analysis** — data, text, ideas\n\nWhat would you like to do?`,
        suggestedActions: ['Write an email', 'Explain a concept', 'Debug my code'],
      };
    }

    return {
      content: `I received your message. _(AI provider not configured — add \`GOOGLE_API_KEY\` to \`.env\` to enable real AI responses.)_`,
      suggestedActions: [],
    };
  }
}
