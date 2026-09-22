import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { USER_JWT_SECRET, UserAuthPayload } from "../middleware/user-auth.middleware";

/**
 * POST /api/auth/signup
 * Register a Customer or Distributor
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = "CUSTOMER",
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

    if (role !== "CUSTOMER" && role !== "DISTRIBUTOR") {
      return res.status(400).json({ error: "Role must be CUSTOMER or DISTRIBUTOR" });
    }

    if (role === "DISTRIBUTOR") {
      if (!companyName || !businessAddress || !city || !state) {
        return res.status(400).json({
          error: "Company name, business address, city, and state are required for distributor registration",
        });
      }
    }

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and distributor profile if applicable in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          phone: phone || null,
          role: role as "CUSTOMER" | "DISTRIBUTOR",
        },
      });

      let distributorProfile = null;
      if (role === "DISTRIBUTOR") {
        distributorProfile = await tx.distributorProfile.create({
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
      }

      return { user, distributorProfile };
    });

    const payload: UserAuthPayload = {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role as "CUSTOMER" | "DISTRIBUTOR",
    };

    const token = jwt.sign(payload, USER_JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role,
      },
      status: result.distributorProfile?.status || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * User & Distributor Login
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

    const payload: UserAuthPayload = {
      id: user.id,
      email: user.email,
      role: user.role as "CUSTOMER" | "DISTRIBUTOR",
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
