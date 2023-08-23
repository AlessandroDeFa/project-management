import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;
  try {
    const searchTasks = await prisma.task.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { note: { startsWith: query } }],
      },
    });
    const searchNotes = await prisma.note.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { note: { startsWith: query } }],
      },
    });
    const searchCompleted = await prisma.completedElement.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { note: { startsWith: query } }],
      },
    });
    const searchMemos = await prisma.memo.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { note: { startsWith: query } }],
      },
    });
    const searchProject = await prisma.project.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { note: { startsWith: query } }],
      },
    });

    const searchResults = [
      ...searchTasks,
      ...searchNotes,
      ...searchCompleted,
      ...searchMemos,
      ...searchProject,
    ];

    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json(error);
  }
}
