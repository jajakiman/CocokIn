export type ConversationStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUPPORT_ACTIVE"
  | "READ_ONLY"
  | "REOPEN_REQUESTED";
export type ChatMessageType = "TEXT" | "SYSTEM";

export type ConversationAccess = {
  conversationId: string;
  projectId: string;
  conversationStatus: ConversationStatus;
  userId: string;
  userStatus: "ACTIVE" | "SUSPENDED";
  emailVerifiedAt: Date | null;
  lastReadSequence: number;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  clientMessageId: string;
  sequenceNumber: number;
  type: ChatMessageType;
  content: string;
  createdAt: Date;
};

export type MessageWrite = Pick<
  ChatMessage,
  "conversationId" | "senderId" | "clientMessageId" | "type" | "content"
>;

export interface ChatStore {
  findConversationAccess(conversationId: string, userId: string): Promise<ConversationAccess | null>;
  persistMessage(input: MessageWrite): Promise<{ message: ChatMessage; created: boolean }>;
  listMessagesAfter(conversationId: string, afterSequence: number, limit: number): Promise<ChatMessage[]>;
  markRead(
    conversationId: string,
    userId: string,
    sequenceNumber: number,
  ): Promise<{ lastReadSequence: number; latestSequence: number }>;
}

export type RealtimeEvent = { type: "message.created"; message: ChatMessage };

export interface RealtimePublisher {
  publish(event: RealtimeEvent): Promise<void>;
}
