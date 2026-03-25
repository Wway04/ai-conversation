import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatFile } from '../entities/chat-file.entity';
import { MessageRole } from '../entities/enums';
import { CHAT_URL_PREFIX } from '../constants/chat.constants';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    @InjectRepository(ChatFile)
    private readonly fileRepository: Repository<ChatFile>,
  ) {}

  async saveUserMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const userMessage = this.messageRepository.create({
      sessionId,
      role: MessageRole.USER,
      content,
    });
    return this.messageRepository.save(userMessage);
  }

  async attachFilesToMessage(
    messageId: string,
    uploadedFiles: Express.Multer.File[],
  ): Promise<ChatFile[]> {
    const savedFiles: ChatFile[] = [];

    for (const uploadedFile of uploadedFiles) {
      const chatFile = this.fileRepository.create({
        messageId,
        originalName: uploadedFile.originalname,
        storedName: uploadedFile.filename,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        url: `${CHAT_URL_PREFIX}/${uploadedFile.filename}`,
      });
      savedFiles.push(await this.fileRepository.save(chatFile));
    }

    return savedFiles;
  }

  async saveAssistantMessage(
    sessionId: string,
    content: string,
    suggestedActions: string[] = [],
  ): Promise<ChatMessage> {
    const assistantMessage = this.messageRepository.create({
      sessionId,
      role: MessageRole.ASSISTANT,
      content,
      metadata: { suggestedActions },
    });
    return this.messageRepository.save(assistantMessage);
  }
}
