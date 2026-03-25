import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatSession } from './chat-session.entity';
import { ChatFile } from './chat-file.entity';
import { MessageRole } from './enums';

@Entity('chat_messages')
@Index(['sessionId', 'createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => ChatSession, (session) => session.messages)
  session: ChatSession;

  @Column({ type: 'enum', enum: MessageRole })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  // { referencedOrderId?, suggestedActions?, tokenCount? }
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => ChatFile, (file) => file.message, { cascade: true, eager: true })
  files: ChatFile[];

  @CreateDateColumn()
  createdAt: Date;
}
