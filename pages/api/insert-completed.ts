import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, note, projectFor, isCompleted, elementType } = req.body;

      const completedElement = await prisma.completedElement.create({
        data: {
          name: name,
          note: note,
          projectFor: projectFor,
          isCompleted: isCompleted,
          elementType: elementType,
        },
      });
      console.log(res.json);
      res.status(200).json(completedElement);
    } catch (error) {
      res.status(500).json({ error: "Errore durante la creazione del task" });
    }
  }
}
