import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Get Auth Users Posts
    try {
      const result = await prisma.post.findUnique({
        where: {
          id: req.query.detail?.toString(),
        },
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true,
            },
          },
        },
      });
      return res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured whilst getting a post" });
    }
  }
}
