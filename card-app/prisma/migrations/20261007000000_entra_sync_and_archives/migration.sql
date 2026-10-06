-- Terminated accounts become archived accounts. Existing rows keep their status.
ALTER TYPE "UserStatus" RENAME VALUE 'TERMINATED' TO 'ARCHIVED';
ALTER TYPE "UserStatus" ADD VALUE 'PENDING' BEFORE 'ACTIVE';

ALTER TABLE "User" RENAME COLUMN "terminatedAt" TO "archivedAt";
ALTER TABLE "User"
  ADD COLUMN "archiveReason" TEXT,
  ADD COLUMN "entraId" TEXT,
  ADD COLUMN "entraSyncedAt" TIMESTAMP(3),
  ADD COLUMN "entraValues" JSONB,
  ADD COLUMN "startsAt" TIMESTAMP(3);
UPDATE "User" SET "archiveReason" = 'admin' WHERE "status" = 'ARCHIVED';
CREATE UNIQUE INDEX "User_entraId_key" ON "User"("entraId");

ALTER TABLE "Office" ADD COLUMN "entraNames" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "AccountArchive" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdById" TEXT,
    "contactCount" INTEGER NOT NULL,
    "eventCount" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "zip" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccountArchive_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AccountArchive_userId_createdAt_idx" ON "AccountArchive"("userId", "createdAt");
ALTER TABLE "AccountArchive" ADD CONSTRAINT "AccountArchive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SyncState" (
    "key" TEXT NOT NULL,
    "value" JSONB,
    "lockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SyncState_pkey" PRIMARY KEY ("key")
);
