import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// GET /api/categories — list all categories
router.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
