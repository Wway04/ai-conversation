import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from './chat.service';
import { CreateSessionDto, RenameSessionDto, SendMessageDto } from './dto/chat.dto';
import {
  CHAT_UPLOAD_DEST,
  CHAT_UPLOAD_MAX_FILES,
  CHAT_UPLOAD_MAX_SIZE_MB,
} from './constants/chat.constants';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  createSession(@Body() dto: CreateSessionDto) {
    return this.chatService.createSession(dto.title);
  }

  @Get('sessions')
  findSessions() {
    return this.chatService.findSessions();
  }

  @Get('sessions/:id')
  findSession(@Param('id') sessionId: string) {
    return this.chatService.findSession(sessionId);
  }

  @Patch('sessions/:id/rename')
  renameSession(@Param('id') sessionId: string, @Body() dto: RenameSessionDto) {
    return this.chatService.renameSession(sessionId, dto.title);
  }

  @Post('sessions/:id/messages')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      CHAT_UPLOAD_MAX_FILES,
      {
        storage: diskStorage({
          destination: CHAT_UPLOAD_DEST,
          filename: (_req, uploadedFile, callback) => {
            callback(null, `${uuidv4()}${extname(uploadedFile.originalname)}`);
          },
        }),
        limits: { fileSize: CHAT_UPLOAD_MAX_SIZE_MB * 1024 * 1024 },
      },
    ),
  )
  sendMessage(
    @Param('id') sessionId: string,
    @Body() dto: SendMessageDto,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
  ) {
    return this.chatService.sendMessage(sessionId, dto.content, uploadedFiles || []);
  }

  @Delete('sessions/:id')
  deleteSession(@Param('id') sessionId: string) {
    return this.chatService.deleteSession(sessionId);
  }

  @Patch('sessions/:id/pin')
  togglePin(@Param('id') sessionId: string) {
    return this.chatService.togglePin(sessionId);
  }
}
