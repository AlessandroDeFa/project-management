-- CreateTable
CREATE TABLE "CompletedElement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "projectFor" TEXT,
    "isCompleted" BOOLEAN NOT NULL,
    "elementType" TEXT NOT NULL,

    CONSTRAINT "CompletedElement_pkey" PRIMARY KEY ("id")
);
