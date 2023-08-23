import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import { AllElements } from "@/app/utils/dataTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, elementType } = req.body;
    try {
      let elementToComplete: AllElements | null = null;
      switch (elementType) {
        case "Incarico":
          elementToComplete = await prisma.task.findUnique({
            where: { id: id },
          });
          break;
        case "Appunti":
          elementToComplete = await prisma.note.findUnique({
            where: { id: id },
          });
          break;
        case "Promemoria":
          elementToComplete = await prisma.memo.findUnique({
            where: { id: id },
          });
          break;
        case "Progetto":
          elementToComplete = await prisma.project.findUnique({
            where: { id: id },
          });
          break;
      }

      if (elementToComplete) {
        await prisma.completedElement.create({
          data: {
            name: elementToComplete.name,
            note: elementToComplete.note,
            isCompleted: true,
            projectFor: elementToComplete.projectFor,
            elementType: elementType,
          },
        });
      }

      switch (elementType) {
        case "Incarico":
          await prisma.task.delete({
            where: { id: id },
          });
          break;
        case "Appunti":
          await prisma.note.delete({
            where: { id: id },
          });
          break;
        case "Promemoria":
          await prisma.memo.delete({
            where: { id: id },
          });
          break;
        case "Progetto":
          await prisma.project.delete({
            where: { id: id },
          });
          break;
      }

      res
        .status(200)
        .json({ message: "l'elemento è stato spostato nei completati." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante la completazione dell' elemento" });
    }
  }
}
