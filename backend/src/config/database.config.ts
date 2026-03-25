import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChatSession } from '../modules/chat/entities/chat-session.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';
import { ChatFile } from '../modules/chat/entities/chat-file.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [ChatSession, ChatMessage, ChatFile],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  // Force PostgreSQL session timezone to UTC so pg driver serializes/deserializes
  // timestamps consistently — prevents double timezone-offset when server is UTC+7
  extra: {
    options: '-c timezone=UTC',
  },
});
