-- CreateTable
CREATE TABLE "Memo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "DueDate" TEXT NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);
