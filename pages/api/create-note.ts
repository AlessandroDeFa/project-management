import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, note, projectFor, isCompleted } = req.body;

      const newNote = await prisma.note.create({
        data: {
          name: name,
          note: note,
          projectFor: projectFor,
          isCompleted: isCompleted,
        },
      });
      res.status(200).json(newNote);
    } catch (error) {
      res.status(500).json({ error: "Errore durante la creazione del task" });
    }
  }
}
