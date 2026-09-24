"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const user_auth_middleware_1 = require("../middleware/user-auth.middleware");
/**
 * POST /api/auth/signup
 * Register a Customer or Distributor
 */
async function signup(req, res, next) {
    try {
        const { name, email, password, phone, role = "CUSTOMER", 
        // Distributor profile fields
        companyName, gstNumber, businessAddress, city, state, } = req.body;
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
        const existing = await db_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Create user and distributor profile if applicable in a transaction
        const result = await db_1.default.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    passwordHash,
                    phone: phone || null,
                    role: role,
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
        if (role === "DISTRIBUTOR") {
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
        }
        const payload = {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, user_auth_middleware_1.USER_JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            token,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                phone: result.user.phone,
                role: result.user.role,
            },
            status: null,
        });
    }
    catch (err) {
        next(err);
    }
}
/**
 * POST /api/auth/login
 * User & Distributor Login
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await db_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                distributorProfile: true,
            },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Distributor login gating: must have status === APPROVED
        if (user.role === "DISTRIBUTOR") {
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
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, user_auth_middleware_1.USER_JWT_SECRET, { expiresIn: "7d" });
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
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=user-auth.controller.js.map