"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_auth_middleware_1 = require("./user-auth.middleware");
/**
 * optionalAuth middleware:
 * Decodes user JWT if present and valid; attaches req.user.
 * Never blocks the request if absent or invalid, allowing anonymous public browsing.
 */
function optionalAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, user_auth_middleware_1.USER_JWT_SECRET);
        req.user = decoded;
    }
    catch {
        // Silently proceed for invalid or expired tokens in optional auth mode
    }
    next();
}
//# sourceMappingURL=optional-auth.middleware.js.map