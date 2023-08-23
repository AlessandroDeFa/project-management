import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await prisma.completedElement.delete({
        where: { id: id },
      });
      res.status(200).json({ message: "l'elemento è stato eliminato." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante l'eliminazione dell' elemento" });
    }
  }
}
