-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TALENT', 'BUSINESS', 'ADMIN');

-- CreateEnum
CREATE TYPE "IdentityStatus" AS ENUM ('UNVERIFIED', 'CONTACT_VERIFIED', 'KYC_PENDING', 'KYC_VERIFIED', 'KYC_REJECTED');

-- CreateEnum
CREATE TYPE "BusinessVerificationStatus" AS ENUM ('UNVERIFIED', 'BASIC_VERIFIED', 'VERIFIED_BUSINESS', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'TALENT_SELECTED', 'AGREEMENT_CONFIRMED', 'FUNDING_PENDING', 'FUNDED', 'IN_PROGRESS', 'STAGING_REVIEW', 'PRODUCTION_DEPLOYMENT', 'HANDOVER_PENDING', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'READY_FOR_REVIEW', 'APPROVED', 'PAYOUT_DUE', 'PAID', 'REVISION_REQUESTED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "FundingStatus" AS ENUM ('AWAITING_PAYMENT', 'PROOF_SUBMITTED', 'RECONCILIATION_PENDING', 'FUNDED', 'AMOUNT_MISMATCH', 'UNMATCHED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PAYOUT_DUE', 'PROCESSING', 'PROOF_UPLOADED', 'TALENT_CONFIRMED', 'PAID', 'FAILED', 'MISMATCH', 'DISPUTED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('REFUND_REQUESTED', 'ELIGIBILITY_REVIEW', 'AMOUNT_CALCULATED', 'USER_CONFIRMED_BREAKDOWN', 'APPROVED', 'PROCESSING', 'PROOF_UPLOADED', 'UMKM_CONFIRMED', 'REFUNDED', 'REJECTED', 'PARTIALLY_REFUNDED', 'FAILED', 'RETRY_REQUIRED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUPPORT_ACTIVE', 'READ_ONLY', 'REOPEN_REQUESTED');

-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('NOT_STARTED', 'ACTIVE', 'EXPIRING', 'COMPLETED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('SIMULATED', 'REAL');

-- CreateEnum
CREATE TYPE "EvidenceLevel" AS ENUM ('SELF_DECLARED', 'ASSESSED', 'PROJECT_APPLIED', 'PROJECT_VERIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TALENT',
    "identityStatus" "IdentityStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "university" TEXT,
    "major" TEXT,
    "workModePreference" TEXT,
    "timeAvailability" TEXT,
    "careerTarget" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentSkill" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "evidenceLevel" "EvidenceLevel" NOT NULL DEFAULT 'SELF_DECLARED',

    CONSTRAINT "TalentSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerSkillRequirement" (
    "id" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "benchmarkScore" INTEGER NOT NULL,

    CONSTRAINT "CareerSkillRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TalentAssessmentResult" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "technicalScore" INTEGER NOT NULL,
    "softSkillScore" INTEGER NOT NULL,
    "compositeScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TalentAssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioEntry" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "problemSummary" TEXT NOT NULL,
    "solutionBuilt" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "industryCategory" TEXT,
    "location" TEXT,
    "description" TEXT,
    "scale" TEXT,
    "contactPerson" TEXT,
    "verificationStatus" "BusinessVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAssessmentResult" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "readinessScore" INTEGER NOT NULL,
    "financeScore" INTEGER NOT NULL DEFAULT 0,
    "marketingScore" INTEGER NOT NULL DEFAULT 0,
    "teamScore" INTEGER NOT NULL DEFAULT 0,
    "operationsScore" INTEGER NOT NULL DEFAULT 0,
    "outsourcingScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessAssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "serviceValue" BIGINT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "motivation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchSnapshot" (
    "id" TEXT NOT NULL,
    "projectApplicationId" TEXT NOT NULL,
    "cocokScore" INTEGER NOT NULL,
    "skillMatchScore" INTEGER NOT NULL,
    "careerAlignmentScore" INTEGER NOT NULL,
    "availabilityScore" INTEGER NOT NULL,
    "experienceScore" INTEGER NOT NULL,
    "preferenceScore" INTEGER NOT NULL,
    "explainableText" TEXT,

    CONSTRAINT "MatchSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "weightBps" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneAcceptanceCriterion" (
    "id" TEXT NOT NULL,
    "projectMilestoneId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MilestoneAcceptanceCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneSubmission" (
    "id" TEXT NOT NULL,
    "projectMilestoneId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "stagingUrl" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "instructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilestoneSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionEvidence" (
    "id" TEXT NOT NULL,
    "milestoneSubmissionId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,

    CONSTRAINT "SubmissionEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneReview" (
    "id" TEXT NOT NULL,
    "milestoneSubmissionId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilestoneReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructurePlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "rationale" TEXT,

    CONSTRAINT "InfrastructurePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructureHandover" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productionUrl" TEXT NOT NULL,
    "checklistData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InfrastructureHandover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingReceipt" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "FundingStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "platformReference" TEXT,
    "externalReference" TEXT,
    "amountDue" BIGINT NOT NULL,
    "amountReceived" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundingReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowTransaction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "EscrowTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "escrowTransactionId" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "platformReference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutInstruction" (
    "id" TEXT NOT NULL,
    "escrowTransactionId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PAYOUT_DUE',
    "amount" BIGINT NOT NULL,
    "platformReference" TEXT,
    "externalReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundInstruction" (
    "id" TEXT NOT NULL,
    "escrowTransactionId" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'REFUND_REQUESTED',
    "grossRefundable" BIGINT NOT NULL,
    "netRefund" BIGINT NOT NULL,
    "costBearer" TEXT NOT NULL,
    "platformReference" TEXT,
    "externalReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarrantyAgreement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "WarrantyStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "WarrantyAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenancePackage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "ticketQuota" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "MaintenancePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeEvidence" (
    "id" TEXT NOT NULL,
    "disputeId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "submitterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeDecision" (
    "id" TEXT NOT NULL,
    "disputeId" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisputeDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectConversation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "projectConversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "projectConversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "content" TEXT,
    "isSystemMessage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "chatMessageId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "chatMessageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReceipt" (
    "id" TEXT NOT NULL,
    "chatMessageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReport" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationReopenRequest" (
    "id" TEXT NOT NULL,
    "projectConversationId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationReopenRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "action" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TalentProfile_userId_key" ON "TalentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TalentSkill_talentProfileId_skillId_key" ON "TalentSkill"("talentProfileId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Career_name_key" ON "Career"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CareerSkillRequirement_careerId_skillId_key" ON "CareerSkillRequirement"("careerId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioEntry_projectId_key" ON "PortfolioEntry"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSkill_projectId_skillId_key" ON "ProjectSkill"("projectId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectApplication_projectId_talentProfileId_key" ON "ProjectApplication"("projectId", "talentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchSnapshot_projectApplicationId_key" ON "MatchSnapshot"("projectApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "MilestoneSubmission_projectMilestoneId_version_key" ON "MilestoneSubmission"("projectMilestoneId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "MilestoneReview_milestoneSubmissionId_key" ON "MilestoneReview"("milestoneSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructurePlan_projectId_key" ON "InfrastructurePlan"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureHandover_projectId_key" ON "InfrastructureHandover"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingReceipt_projectId_key" ON "FundingReceipt"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingReceipt_platformReference_key" ON "FundingReceipt"("platformReference");

-- CreateIndex
CREATE UNIQUE INDEX "FundingReceipt_externalReference_key" ON "FundingReceipt"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "EscrowTransaction_projectId_key" ON "EscrowTransaction"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutInstruction_platformReference_key" ON "PayoutInstruction"("platformReference");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutInstruction_externalReference_key" ON "PayoutInstruction"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "RefundInstruction_platformReference_key" ON "RefundInstruction"("platformReference");

-- CreateIndex
CREATE UNIQUE INDEX "RefundInstruction_externalReference_key" ON "RefundInstruction"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "WarrantyAgreement_projectId_key" ON "WarrantyAgreement"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenancePackage_projectId_key" ON "MaintenancePackage"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "DisputeDecision_disputeId_key" ON "DisputeDecision"("disputeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectConversation_projectId_key" ON "ProjectConversation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_projectConversationId_userId_key" ON "ConversationParticipant"("projectConversationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_projectConversationId_sequenceNumber_key" ON "ChatMessage"("projectConversationId", "sequenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_chatMessageId_userId_emoji_key" ON "MessageReaction"("chatMessageId", "userId", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReceipt_chatMessageId_userId_key" ON "MessageReceipt"("chatMessageId", "userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentProfile" ADD CONSTRAINT "TalentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentSkill" ADD CONSTRAINT "TalentSkill_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentSkill" ADD CONSTRAINT "TalentSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerSkillRequirement" ADD CONSTRAINT "CareerSkillRequirement_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerSkillRequirement" ADD CONSTRAINT "CareerSkillRequirement_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalentAssessmentResult" ADD CONSTRAINT "TalentAssessmentResult_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioEntry" ADD CONSTRAINT "PortfolioEntry_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioEntry" ADD CONSTRAINT "PortfolioEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessAssessmentResult" ADD CONSTRAINT "BusinessAssessmentResult_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSnapshot" ADD CONSTRAINT "MatchSnapshot_projectApplicationId_fkey" FOREIGN KEY ("projectApplicationId") REFERENCES "ProjectApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneAcceptanceCriterion" ADD CONSTRAINT "MilestoneAcceptanceCriterion_projectMilestoneId_fkey" FOREIGN KEY ("projectMilestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneSubmission" ADD CONSTRAINT "MilestoneSubmission_projectMilestoneId_fkey" FOREIGN KEY ("projectMilestoneId") REFERENCES "ProjectMilestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionEvidence" ADD CONSTRAINT "SubmissionEvidence_milestoneSubmissionId_fkey" FOREIGN KEY ("milestoneSubmissionId") REFERENCES "MilestoneSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneReview" ADD CONSTRAINT "MilestoneReview_milestoneSubmissionId_fkey" FOREIGN KEY ("milestoneSubmissionId") REFERENCES "MilestoneSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRequest" ADD CONSTRAINT "ChangeRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfrastructurePlan" ADD CONSTRAINT "InfrastructurePlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfrastructureHandover" ADD CONSTRAINT "InfrastructureHandover_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingReceipt" ADD CONSTRAINT "FundingReceipt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_escrowTransactionId_fkey" FOREIGN KEY ("escrowTransactionId") REFERENCES "EscrowTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutInstruction" ADD CONSTRAINT "PayoutInstruction_escrowTransactionId_fkey" FOREIGN KEY ("escrowTransactionId") REFERENCES "EscrowTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundInstruction" ADD CONSTRAINT "RefundInstruction_escrowTransactionId_fkey" FOREIGN KEY ("escrowTransactionId") REFERENCES "EscrowTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarrantyAgreement" ADD CONSTRAINT "WarrantyAgreement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePackage" ADD CONSTRAINT "MaintenancePackage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeEvidence" ADD CONSTRAINT "DisputeEvidence_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeDecision" ADD CONSTRAINT "DisputeDecision_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "Dispute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_projectConversationId_fkey" FOREIGN KEY ("projectConversationId") REFERENCES "ProjectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_projectConversationId_fkey" FOREIGN KEY ("projectConversationId") REFERENCES "ProjectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReceipt" ADD CONSTRAINT "MessageReceipt_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReport" ADD CONSTRAINT "MessageReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationReopenRequest" ADD CONSTRAINT "ConversationReopenRequest_projectConversationId_fkey" FOREIGN KEY ("projectConversationId") REFERENCES "ProjectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
