import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      await prisma.completedElement.deleteMany();
      res
        .status(200)
        .json({ message: "Tutti gli elementi sono stati eliminati." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Errore durante l'eliminazione degli elementi" });
    }
  }
}
