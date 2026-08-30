import { assertConversationAccess } from "./service";
import type {
  ChatMessage,
  ChatStore,
  ConversationAccess,
  ConversationStatus,
  MessageWrite,
} from "./types";

type TestConversation = {
  id: string;
  projectId: string;
  status: ConversationStatus;
  nextSequenceNumber: number;
};

export class InMemoryChatStore implements ChatStore {
  conversations: TestConversation[] = [];
  participants: ConversationAccess[] = [];
  messages: ChatMessage[] = [];

  addConversation(input: Omit<TestConversation, "nextSequenceNumber">) {
    this.conversations.push({ ...input, nextSequenceNumber: 1 });
  }

  addParticipant(input: {
    conversationId: string;
    userId: string;
    userStatus: "ACTIVE" | "SUSPENDED";
    emailVerifiedAt: Date | null;
    lastReadSequence?: number;
  }) {
    const conversation = this.conversations.find(({ id }) => id === input.conversationId);
    if (!conversation) throw new Error("Unknown test conversation");
    this.participants.push({
      ...input,
      projectId: conversation.projectId,
      conversationStatus: conversation.status,
      lastReadSequence: input.lastReadSequence ?? 0,
    });
  }

  async findConversationAccess(conversationId: string, userId: string) {
    const participant = this.participants.find(
      (candidate) => candidate.conversationId === conversationId && candidate.userId === userId,
    );
    const conversation = this.conversations.find(({ id }) => id === conversationId);
    return participant && conversation
      ? { ...participant, conversationStatus: conversation.status }
      : null;
  }

  async persistMessage(input: MessageWrite) {
    assertConversationAccess(
      await this.findConversationAccess(input.conversationId, input.senderId),
      true,
    );
    const duplicate = this.messages.find(
      ({ conversationId, clientMessageId }) =>
        conversationId === input.conversationId && clientMessageId === input.clientMessageId,
    );
    if (duplicate) return { message: duplicate, created: false };

    const conversation = this.conversations.find(({ id }) => id === input.conversationId)!;
    const message: ChatMessage = {
      id: `message-${this.messages.length + 1}`,
      ...input,
      sequenceNumber: conversation.nextSequenceNumber,
      createdAt: new Date(),
    };
    conversation.nextSequenceNumber += 1;
    this.messages.push(message);
    return { message, created: true };
  }

  async listMessagesAfter(conversationId: string, afterSequence: number, limit: number) {
    return this.messages
      .filter(
        (message) =>
          message.conversationId === conversationId && message.sequenceNumber > afterSequence,
      )
      .sort((left, right) => left.sequenceNumber - right.sequenceNumber)
      .slice(0, limit);
  }

  async markRead(conversationId: string, userId: string, sequenceNumber: number) {
    const access = assertConversationAccess(
      await this.findConversationAccess(conversationId, userId),
    );
    const conversation = this.conversations.find(({ id }) => id === conversationId)!;
    const latestSequence = conversation.nextSequenceNumber - 1;
    const participant = this.participants.find(
      (candidate) => candidate.conversationId === conversationId && candidate.userId === userId,
    )!;
    participant.lastReadSequence = Math.max(
      access.lastReadSequence,
      Math.min(sequenceNumber, latestSequence),
    );
    return { lastReadSequence: participant.lastReadSequence, latestSequence };
  }
}
