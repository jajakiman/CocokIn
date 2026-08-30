import type {
  ChatMessageType,
  ChatStore,
  ConversationAccess,
  MessageWrite,
  RealtimePublisher,
} from "./types";

export type ChatAccessFailure =
  | "ACCESS_DENIED"
  | "USER_SUSPENDED"
  | "EMAIL_UNVERIFIED"
  | "CONVERSATION_NOT_WRITABLE";

export class ChatAccessError extends Error {
  constructor(public readonly reason: ChatAccessFailure) {
    super(reason);
    this.name = "ChatAccessError";
  }
}

export class ChatValidationError extends Error {
  constructor(public readonly field: "content" | "clientMessageId" | "afterSequence" | "limit" | "sequenceNumber") {
    super(`Invalid ${field}`);
    this.name = "ChatValidationError";
  }
}

export function assertConversationAccess(access: ConversationAccess | null, requireWritable = false) {
  if (!access) throw new ChatAccessError("ACCESS_DENIED");
  if (access.userStatus === "SUSPENDED") throw new ChatAccessError("USER_SUSPENDED");
  if (!access.emailVerifiedAt) throw new ChatAccessError("EMAIL_UNVERIFIED");
  if (
    requireWritable &&
    access.conversationStatus !== "ACTIVE" &&
    access.conversationStatus !== "SUPPORT_ACTIVE"
  ) {
    throw new ChatAccessError("CONVERSATION_NOT_WRITABLE");
  }
  return access;
}

export async function authorizeConversationAccess(
  store: ChatStore,
  conversationId: string,
  userId: string,
  options: { requireWritable?: boolean } = {},
) {
  return assertConversationAccess(
    await store.findConversationAccess(conversationId, userId),
    options.requireWritable,
  );
}

export async function createMessage(
  store: ChatStore,
  publisher: RealtimePublisher,
  input: {
    conversationId: string;
    senderId: string;
    clientMessageId: string;
    type: ChatMessageType;
    content: string;
  },
) {
  await authorizeConversationAccess(store, input.conversationId, input.senderId, {
    requireWritable: true,
  });
  const clientMessageId = input.clientMessageId.trim();
  if (!clientMessageId) throw new ChatValidationError("clientMessageId");
  const content = input.content.trim();
  if (!content) throw new ChatValidationError("content");

  const persisted = await store.persistMessage({ ...input, clientMessageId, content });
  if (!persisted.created) return { message: persisted.message, published: false as const };

  try {
    await publisher.publish({ type: "message.created", message: persisted.message });
    return { message: persisted.message, published: true as const };
  } catch (publishError) {
    return { message: persisted.message, published: false as const, publishError };
  }
}

export async function listMessagesAfter(
  store: ChatStore,
  input: { conversationId: string; userId: string; afterSequence?: number; limit?: number },
) {
  await authorizeConversationAccess(store, input.conversationId, input.userId);
  const afterSequence = input.afterSequence ?? 0;
  if (!Number.isSafeInteger(afterSequence) || afterSequence < 0) {
    throw new ChatValidationError("afterSequence");
  }
  const requestedLimit = input.limit ?? 50;
  if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
    throw new ChatValidationError("limit");
  }
  return store.listMessagesAfter(input.conversationId, afterSequence, Math.min(requestedLimit, 100));
}

export async function markConversationRead(
  store: ChatStore,
  input: { conversationId: string; userId: string; sequenceNumber: number },
) {
  await authorizeConversationAccess(store, input.conversationId, input.userId);
  if (!Number.isSafeInteger(input.sequenceNumber) || input.sequenceNumber < 0) {
    throw new ChatValidationError("sequenceNumber");
  }
  const state = await store.markRead(input.conversationId, input.userId, input.sequenceNumber);
  return { ...state, unreadCount: state.latestSequence - state.lastReadSequence };
}

export type { MessageWrite };
