import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const countTasks = await prisma.task.count();
    const countNotes = await prisma.note.count();
    const countProjects = await prisma.project.count();
    const countCompleted = await prisma.completedElement.count();
    const countMemo = await prisma.memo.count();

    const counts = {
      countTasks,
      countNotes,
      countProjects,
      countCompleted,
      countMemo,
    };

    res.status(200).json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la richiesta API" });
  }
}
