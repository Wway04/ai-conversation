import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatSession } from './entities/chat-session.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatFile } from './entities/chat-file.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { GeminiChatAI } from './providers/gemini-chat-ai';
import { StubChatAI } from './providers/stub-chat-ai';
import { AI_PROVIDER } from './constants/chat.tokens';
import { CHAT_UPLOAD_DEST } from './constants/chat.constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ChatSession, ChatMessage, ChatFile]),
    MulterModule.register({ dest: CHAT_UPLOAD_DEST }),
  ],
  controllers: [ChatController],
  providers: [
    SessionService,
    MessageService,
    ChatService,
    GeminiChatAI,
    StubChatAI,
    {
      provide: AI_PROVIDER,
      useFactory: (geminiChatAI: GeminiChatAI, configService: ConfigService) => {
        const hasGoogleApiKey = !!configService.get<string>('GOOGLE_API_KEY');
        return hasGoogleApiKey ? geminiChatAI : new StubChatAI();
      },
      inject: [GeminiChatAI, ConfigService],
    },
  ],
})
export class ChatModule {}
