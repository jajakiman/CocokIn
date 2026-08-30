import { describe, expect, test } from "vitest";
import { InMemoryChatStore } from "./in-memory-store";
import {
  ChatAccessError,
  ChatValidationError,
  authorizeConversationAccess,
  createMessage,
  listMessagesAfter,
  markConversationRead,
} from "./service";
import type { RealtimeEvent, RealtimePublisher } from "./types";

class RecordingPublisher implements RealtimePublisher {
  events: RealtimeEvent[] = [];
  fail = false;
  onPublish?: () => void;

  async publish(event: RealtimeEvent) {
    this.onPublish?.();
    if (this.fail) throw new Error("realtime unavailable");
    this.events.push(event);
  }
}

function setup(status: "PENDING" | "ACTIVE" | "SUPPORT_ACTIVE" | "READ_ONLY" = "ACTIVE") {
  const store = new InMemoryChatStore();
  store.addConversation({ id: "conversation-1", projectId: "project-1", status });
  store.addParticipant({
    conversationId: "conversation-1",
    userId: "user-1",
    userStatus: "ACTIVE",
    emailVerifiedAt: new Date("2026-08-30T00:00:00Z"),
  });
  return { store, publisher: new RecordingPublisher() };
}

describe("chat service", () => {
  test("authorizes only active, verified conversation participants", async () => {
    const { store } = setup();

    await expect(authorizeConversationAccess(store, "conversation-1", "user-1")).resolves.toMatchObject({
      userId: "user-1",
    });
    await expect(authorizeConversationAccess(store, "conversation-1", "outsider")).rejects.toMatchObject({
      reason: "ACCESS_DENIED",
    });
    await expect(authorizeConversationAccess(store, "missing", "user-1")).rejects.toBeInstanceOf(
      ChatAccessError,
    );

    store.participants[0].userStatus = "SUSPENDED";
    await expect(authorizeConversationAccess(store, "conversation-1", "user-1")).rejects.toMatchObject({
      reason: "USER_SUSPENDED",
    });
    store.participants[0].userStatus = "ACTIVE";
    store.participants[0].emailVerifiedAt = null;
    await expect(authorizeConversationAccess(store, "conversation-1", "user-1")).rejects.toMatchObject({
      reason: "EMAIL_UNVERIFIED",
    });
  });

  test.each(["PENDING", "READ_ONLY"] as const)("rejects messages while conversation is %s", async (status) => {
    const { store, publisher } = setup(status);

    await expect(
      createMessage(store, publisher, {
        conversationId: "conversation-1",
        senderId: "user-1",
        clientMessageId: "client-1",
        type: "TEXT",
        content: "Hello",
      }),
    ).rejects.toMatchObject({ reason: "CONVERSATION_NOT_WRITABLE" });
  });

  test.each(["ACTIVE", "SUPPORT_ACTIVE"] as const)("creates trimmed text in %s conversations", async (status) => {
    const { store, publisher } = setup(status);

    const result = await createMessage(store, publisher, {
      conversationId: "conversation-1",
      senderId: "user-1",
      clientMessageId: "client-1",
      type: "TEXT",
      content: "  Hello  ",
    });

    expect(result).toMatchObject({ message: { content: "Hello", sequenceNumber: 1 }, published: true });
    expect(publisher.events).toEqual([{ type: "message.created", message: result.message }]);
  });

  test.each(["", "   "])("rejects empty text content", async (content) => {
    const { store, publisher } = setup();

    await expect(
      createMessage(store, publisher, {
        conversationId: "conversation-1",
        senderId: "user-1",
        clientMessageId: "client-1",
        type: "TEXT",
        content,
      }),
    ).rejects.toBeInstanceOf(ChatValidationError);
  });

  test.each(["", "   "])("rejects empty client message ids", async (clientMessageId) => {
    const { store, publisher } = setup();

    await expect(
      createMessage(store, publisher, {
        conversationId: "conversation-1",
        senderId: "user-1",
        clientMessageId,
        type: "TEXT",
        content: "Hello",
      }),
    ).rejects.toMatchObject({ field: "clientMessageId" });
  });

  test("returns an idempotent duplicate without allocating or publishing twice", async () => {
    const { store, publisher } = setup();
    const input = {
      conversationId: "conversation-1",
      senderId: "user-1",
      clientMessageId: "client-1",
      type: "TEXT" as const,
      content: "Hello",
    };

    const first = await createMessage(store, publisher, input);
    const duplicate = await createMessage(store, publisher, input);

    expect(duplicate).toEqual({ message: first.message, published: false });
    expect(store.messages).toHaveLength(1);
    expect(publisher.events).toHaveLength(1);
  });

  test("allocates monotonic sequence numbers atomically", async () => {
    const { store, publisher } = setup();

    const results = await Promise.all(
      Array.from({ length: 20 }, (_, index) =>
        createMessage(store, publisher, {
          conversationId: "conversation-1",
          senderId: "user-1",
          clientMessageId: `client-${index}`,
          type: "TEXT",
          content: `Message ${index}`,
        }),
      ),
    );

    expect(results.map(({ message }) => message.sequenceNumber).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
  });

  test("keeps and returns a committed message when publishing fails", async () => {
    const { store, publisher } = setup();
    publisher.fail = true;
    publisher.onPublish = () => expect(store.messages).toHaveLength(1);

    const result = await createMessage(store, publisher, {
      conversationId: "conversation-1",
      senderId: "user-1",
      clientMessageId: "client-1",
      type: "TEXT",
      content: "Persist me",
    });

    expect(store.messages).toEqual([result.message]);
    expect(result.published).toBe(false);
    expect(result.publishError).toBeInstanceOf(Error);
  });

  test("lists messages after a sequence in ascending order with a bounded limit", async () => {
    const { store, publisher } = setup();
    for (let index = 0; index < 105; index += 1) {
      await createMessage(store, publisher, {
        conversationId: "conversation-1",
        senderId: "user-1",
        clientMessageId: `client-${index}`,
        type: "TEXT",
        content: `Message ${index}`,
      });
    }

    const page = await listMessagesAfter(store, {
      conversationId: "conversation-1",
      userId: "user-1",
      afterSequence: 2,
      limit: 500,
    });

    expect(page).toHaveLength(100);
    expect(page[0].sequenceNumber).toBe(3);
    expect(page.at(-1)?.sequenceNumber).toBe(102);
  });

  test("marks read monotonically and derives unread from latest sequence", async () => {
    const { store, publisher } = setup();
    for (let index = 0; index < 3; index += 1) {
      await createMessage(store, publisher, {
        conversationId: "conversation-1",
        senderId: "user-1",
        clientMessageId: `client-${index}`,
        type: "TEXT",
        content: `Message ${index}`,
      });
    }

    await expect(
      markConversationRead(store, { conversationId: "conversation-1", userId: "user-1", sequenceNumber: 2 }),
    ).resolves.toEqual({ lastReadSequence: 2, latestSequence: 3, unreadCount: 1 });
    await expect(
      markConversationRead(store, { conversationId: "conversation-1", userId: "user-1", sequenceNumber: 1 }),
    ).resolves.toEqual({ lastReadSequence: 2, latestSequence: 3, unreadCount: 1 });
    await expect(
      markConversationRead(store, { conversationId: "conversation-1", userId: "user-1", sequenceNumber: 99 }),
    ).resolves.toEqual({ lastReadSequence: 3, latestSequence: 3, unreadCount: 0 });
  });
});
