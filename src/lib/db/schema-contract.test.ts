import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");

const model = (name: string) => {
  const match = schema.match(new RegExp(`model ${name} \\{([\\s\\S]*?)\\n\\}`));
  expect(match, `missing model ${name}`).not.toBeNull();
  return match![1];
};

describe("identity and chat schema contract", () => {
  it("contains only the required foundation models", () => {
    const required = [
      "User",
      "Account",
      "Session",
      "IdentityToken",
      "VerificationToken",
      "ConsentRecord",
      "TalentProfile",
      "BusinessProfile",
      "Project",
      "ProjectApplication",
      "ProjectAgreement",
      "ProjectConversation",
      "ConversationParticipant",
      "ChatMessage",
      "MessageReceipt",
    ];

    expect([...schema.matchAll(/^model (\w+) \{/gm)].map((match) => match[1])).toEqual(required);
  });

  it("enforces identity uniqueness and lookup indexes", () => {
    expect(model("User")).toMatch(/role\s+Role\s+@default\(TALENT\)/);
    expect(model("Account")).toContain("@@unique([provider, providerAccountId])");
    expect(model("Session")).toMatch(/sessionToken\s+String\s+@unique/);
    expect(model("Session")).toMatch(/sessionVersion\s+Int\s+@default\(1\)/);
    expect(model("Session")).toContain("@@index([userId, expires])");
    expect(model("IdentityToken")).toContain("@@unique([identifier, token])");
    expect(model("VerificationToken")).toMatch(/token\s+String\s+@unique/);
    expect(model("VerificationToken")).toContain("@@unique([identifier, token])");
    expect(model("ConsentRecord")).toContain("@@index([userId, purpose, createdAt])");
  });

  it("enforces project and ordered-message invariants", () => {
    expect(model("Project")).toMatch(/business\s+User\s+@relation\("BusinessProjects", fields: \[businessId\]/);
    expect(model("Project")).toMatch(/selectedTalent\s+User\?\s+@relation\("SelectedTalentProjects", fields: \[selectedTalentId\]/);
    expect(model("ProjectApplication")).toContain("@@unique([projectId, talentId])");
    expect(model("ProjectAgreement")).toMatch(/project\s+Project\s+@relation\(fields: \[projectId\]/);
    expect(model("ProjectConversation")).toMatch(/projectId\s+String\s+@unique/);
    expect(model("ConversationParticipant")).toContain("@@unique([conversationId, userId])");
    expect(model("ChatMessage")).toContain("@@unique([conversationId, sequenceNumber])");
    expect(model("ChatMessage")).toContain("@@unique([conversationId, clientMessageId])");
    expect(model("ChatMessage")).toContain("@@index([conversationId, createdAt])");
    expect(model("MessageReceipt")).toContain("@@unique([messageId, userId])");
  });

  it("retains conversation history when users and projects are deleted", () => {
    for (const name of ["ProjectConversation", "ConversationParticipant", "ChatMessage", "MessageReceipt"]) {
      expect(model(name)).not.toContain("onDelete: Cascade");
    }
  });

  it("excludes deferred treasury and support models", () => {
    for (const name of ["FundingReceipt", "LedgerEntry", "PayoutInstruction", "RefundInstruction", "WarrantyAgreement", "SupportTicket", "Dispute"]) {
      expect(schema).not.toContain(`model ${name} {`);
    }
  });
});
