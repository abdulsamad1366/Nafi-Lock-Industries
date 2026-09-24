"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_JWT_SECRET = void 0;
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.USER_JWT_SECRET = process.env.USER_JWT_SECRET || "nafi-user-session-secret-key-2026";
/**
 * requireAuth middleware:
 * Validates user JWT from Authorization: Bearer <token>.
 * Attaches req.user = { id, email, role }.
 * Returns 401 if missing or invalid.
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized — sign in required" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, exports.USER_JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized — invalid or expired session" });
    }
}
//# sourceMappingURL=user-auth.middleware.js.map