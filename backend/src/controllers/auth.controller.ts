import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "nafi-lock-dev-secret";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email, role: admin.role } });
  } catch (err) {
    next(err);
  }
}
