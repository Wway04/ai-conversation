export interface ChatAIResponse {
  content: string;
  suggestedActions?: string[];
}

export interface IChatAI {
  generateResponse(
    messages: {
      role: string;
      content: string;
      files?: { mimeType: string; storedName: string }[];
    }[],
  ): Promise<ChatAIResponse>;
}
