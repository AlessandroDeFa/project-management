import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, note, isCompleted, dueDate } = req.body;

      const newMemo = await prisma.memo.create({
        data: {
          name: name,
          note: note,
          dueDate: dueDate,
          isCompleted: isCompleted,
        },
      });
      res.status(200).json(newMemo);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante la creazione del promemoria" });
    }
  }
}
