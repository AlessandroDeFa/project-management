import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, note, isCompleted } = req.body;

      const newProject = await prisma.project.create({
        data: {
          name: name,
          note: note,
          isCompleted: isCompleted,
        },
      });
      res.status(200).json(newProject);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante la creazione del progetto" });
    }
  }
}
