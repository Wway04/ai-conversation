import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Content,
  Part,
} from '@google/generative-ai';
import { ChatAIResponse, IChatAI } from './chat-ai.interface';
import { CHAT_UPLOAD_DEST } from '../constants/chat.constants';

const SYSTEM_PROMPT = `You are a helpful, friendly AI assistant.
Answer clearly and concisely. Use markdown formatting where appropriate (code blocks, bullet points, tables, bold).
If you don't know something, say so honestly. Be conversational and helpful.`;

@Injectable()
export class GeminiChatAI implements IChatAI {
  private readonly logger = new Logger(GeminiChatAI.name);
  private readonly genAI: GoogleGenerativeAI | null = null;

  // Model priority: try each in order until one works
  private readonly modelCandidates = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest',
  ];

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GOOGLE_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log(`✅ Gemini AI initialized`);
    } else {
      this.logger.warn('⚠️  GOOGLE_API_KEY not set — falling back to stub AI');
    }
  }

  async generateResponse(
    messages: {
      role: string;
      content: string;
      files?: { mimeType: string; storedName: string }[];
    }[],
  ): Promise<ChatAIResponse> {
    if (!this.genAI) {
      return {
        content: '⚠️ AI not configured. Add `GOOGLE_API_KEY` to `.env` and restart.',
        suggestedActions: [],
      };
    }

    const { history, currentMessageParts } = this.buildHistory(messages);

    let lastError: any;
    for (const modelName of this.modelCandidates) {
      try {
        const result = await this.callModel(modelName, history, currentMessageParts);
        return result;
      } catch (err: any) {
        lastError = err;
        const is429 = err?.message?.includes('429') || err?.message?.includes('quota');
        const is404 = err?.message?.includes('404') || err?.message?.includes('not found');
        if (is429 || is404) {
          this.logger.warn(`Model ${modelName} unavailable (${is429 ? 'quota' : 'not found'}), trying next…`);
          continue;
        }
        break; // Non-retryable error
      }
    }

    this.logger.error('All Gemini models failed:', lastError?.message);
    return {
      content: `❌ AI error: ${lastError?.message || 'Unknown error'}. Please try again.`,
      suggestedActions: [],
    };
  }

  private async callModel(
    modelName: string,
    history: Content[],
    currentMessageParts: Part[],
  ): Promise<ChatAIResponse> {
    const model = this.genAI!.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const chat = model.startChat({
      history,
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(currentMessageParts);
    const responseText = result.response.text();
    this.logger.log(`✅ ${modelName} → ${responseText.length} chars`);

    return { content: responseText, suggestedActions: [] };
  }

  private buildHistory(
    messages: {
      role: string;
      content: string;
      files?: { mimeType: string; storedName: string }[];
    }[],
  ): {
    history: Content[];
    currentMessageParts: Part[];
  } {
    const historyMessages = messages.slice(0, -1);
    const currentMsg = messages[messages.length - 1];
    
    // Process current message parts
    const currentMessageParts: Part[] = [];
    if (currentMsg?.content) currentMessageParts.push({ text: currentMsg.content });
    if (currentMsg?.files) {
      for (const file of currentMsg.files) {
        const filePart = this.fileToPart(file.mimeType, file.storedName);
        if (filePart) currentMessageParts.push(filePart);
      }
    }

    const history: Content[] = [];

    for (const msg of historyMessages) {
      const geminiRole = msg.role === 'assistant' ? 'model' : 'user';
      const parts: Part[] = [{ text: msg.content || '' }];

      if (msg.role === 'user' && msg.files) {
        for (const file of msg.files) {
          const filePart = this.fileToPart(file.mimeType, file.storedName);
          if (filePart) parts.push(filePart);
        }
      }

      const last = history[history.length - 1];
      if (last && last.role === geminiRole) {
        // Merge consecutive same-role messages
        last.parts.push(...parts);
      } else {
        history.push({ role: geminiRole, parts });
      }
    }

    // Gemini requirements: starts with 'user', pairs turns
    while (history.length > 0 && history[0].role !== 'user') history.shift();
    while (history.length > 0 && history[history.length - 1].role !== 'model') history.pop();

    return { history, currentMessageParts };
  }

  private fileToPart(mimeType: string, storedName: string): Part | null {
    try {
      // Support common multi-modal types
      if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf') {
        return null; 
      }

      const filePath = join(process.cwd(), CHAT_UPLOAD_DEST, storedName);
      if (!fs.existsSync(filePath)) return null;

      const base64Data = fs.readFileSync(filePath, 'base64');
      return {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };
    } catch (err) {
      this.logger.error(`Error processing file ${storedName}:`, err);
      return null;
    }
  }
}
