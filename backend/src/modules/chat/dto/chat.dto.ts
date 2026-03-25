import { IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class RenameSessionDto {
  @IsString()
  title: string;
}

export class SendMessageDto {
  @IsString()
  content: string;
}
