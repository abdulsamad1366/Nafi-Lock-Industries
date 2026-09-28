import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { USER_JWT_SECRET, UserAuthPayload } from "../middleware/user-auth.middleware";

/**
 * POST /api/auth/signup
 * Register a Distributor Application
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      email,
      password,
      phone,
      // Distributor profile fields
      companyName,
      gstNumber,
      businessAddress,
      city,
      state,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (!companyName || !businessAddress || !city || !state) {
      return res.status(400).json({
        error: "Company name, business address, city, and state are required for distributor registration",
      });
    }

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create distributor user and distributor profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          phone: phone || null,
          role: "DISTRIBUTOR",
        },
      });

      const distributorProfile = await tx.distributorProfile.create({
        data: {
          userId: user.id,
          companyName,
          gstNumber: gstNumber || null,
          businessAddress,
          city,
          state,
          status: "PENDING",
        },
      });

      return { user, distributorProfile };
    });

    return res.status(201).json({
      token: null,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role,
      },
      status: result.distributorProfile?.status || "PENDING",
      message: "Application submitted — you'll be able to log in once it's reviewed.",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Distributor Login (Approved Only)
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        distributorProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role !== "DISTRIBUTOR") {
      return res.status(403).json({ error: "Access restricted to authorized distributors only." });
    }

    const status = user.distributorProfile?.status;
    if (status !== "APPROVED") {
      if (status === "PENDING") {
        return res.status(403).json({
          error: "Your distributor application is pending review.",
          status: "PENDING",
        });
      }
      if (status === "REJECTED") {
        return res.status(403).json({
          error: "Your distributor application was not approved.",
          status: "REJECTED",
        });
      }
      return res.status(403).json({
        error: "Your distributor application is not approved.",
        status: status || null,
      });
    }

    const payload: UserAuthPayload = {
      id: user.id,
      email: user.email,
      role: "DISTRIBUTOR",
    };

    const token = jwt.sign(payload, USER_JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      status: user.distributorProfile?.status || null,
    });
  } catch (err) {
    next(err);
  }
}
