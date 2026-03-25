import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IChatAI } from './providers/chat-ai.interface';
import { AI_PROVIDER } from './constants/chat.tokens';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly messageService: MessageService,
    @Inject(AI_PROVIDER) private readonly chatAI: IChatAI,
  ) {}

  createSession(title?: string) {
    return this.sessionService.createSession(title);
  }

  findSessions() {
    return this.sessionService.findAllActiveSessions();
  }

  findSession(sessionId: string) {
    return this.sessionService.findSessionWithMessages(sessionId);
  }

  renameSession(sessionId: string, newTitle: string) {
    return this.sessionService.renameSession(sessionId, newTitle);
  }

  deleteSession(sessionId: string) {
    return this.sessionService.softDeleteSession(sessionId);
  }

  togglePin(sessionId: string) {
    return this.sessionService.togglePin(sessionId);
  }

  async sendMessage(
    sessionId: string,
    content: string,
    uploadedFiles: Express.Multer.File[] = [],
  ) {
    // 1. Load session to get message history
    const session = await this.sessionService.findSessionWithMessages(sessionId);

    // 2. Save user message + attachments
    const userMessage = await this.messageService.saveUserMessage(sessionId, content);
    const attachedFiles = await this.messageService.attachFilesToMessage(userMessage.id, uploadedFiles);
    userMessage.files = attachedFiles;

    // 3. Build history and call AI
    const messageHistory = this.sessionService.buildMessageHistory(
      session.messages ?? [],
      content,
      attachedFiles,
    );
    const aiResponse = await this.chatAI.generateResponse(messageHistory);

    // 4. Save AI response
    const assistantMessage = await this.messageService.saveAssistantMessage(
      sessionId,
      aiResponse.content,
      aiResponse.suggestedActions ?? [],
    );

    // 5. Bump session updatedAt
    await this.sessionService.bumpSessionUpdatedAt(sessionId);

    return { userMessage, assistantMessage: { ...assistantMessage, files: [] } };
  }
}
