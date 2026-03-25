import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from '../entities/chat-session.entity';
import { CHAT_HISTORY_LIMIT } from '../constants/chat.constants';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
  ) {}

  async createSession(customTitle?: string): Promise<ChatSession> {
    const sessionTitle =
      customTitle?.trim() ||
      `Chat ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const newSession = this.sessionRepository.create({ title: sessionTitle });
    return this.sessionRepository.save(newSession);
  }

  async findAllActiveSessions(): Promise<ChatSession[]> {
    return this.sessionRepository.find({
      where: { isActive: true },
      order: {
        isPinned: 'DESC',
        updatedAt: 'DESC',
      },
    });
  }

  async togglePin(sessionId: string): Promise<ChatSession> {
    const session = await this.findSessionOrFail(sessionId);
    const newPinnedStatus = !session.isPinned;
    await this.sessionRepository.update(sessionId, { isPinned: newPinnedStatus });
    return { ...session, isPinned: newPinnedStatus };
  }

  async findSessionWithMessages(sessionId: string): Promise<ChatSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages', 'messages.files'],
      order: { messages: { createdAt: 'ASC' } } as any,
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async findSessionOrFail(sessionId: string): Promise<ChatSession> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async renameSession(sessionId: string, newTitle: string): Promise<ChatSession> {
    const session = await this.findSessionOrFail(sessionId);
    await this.sessionRepository.update(sessionId, { title: newTitle });
    return { ...session, title: newTitle };
  }

  async softDeleteSession(sessionId: string): Promise<{ message: string }> {
    await this.findSessionOrFail(sessionId);
    await this.sessionRepository.update(sessionId, { isActive: false });
    return { message: 'Session deleted' };
  }

  async bumpSessionUpdatedAt(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, { updatedAt: new Date() });
  }

  buildMessageHistory(
    existingMessages: any[],
    newUserContent: string,
    newUserFiles: any[] = [],
  ): any[] {
    const history = existingMessages.slice(-CHAT_HISTORY_LIMIT).map((message) => ({
      role: message.role,
      content: message.content,
      files: message.files?.map((file) => ({
        mimeType: file.mimeType,
        storedName: file.storedName,
      })),
    }));

    history.push({
      role: 'user',
      content: newUserContent,
      files: newUserFiles.map((file) => ({
        mimeType: file.mimeType,
        storedName: file.storedName,
      })),
    });

    return history;
  }
}
