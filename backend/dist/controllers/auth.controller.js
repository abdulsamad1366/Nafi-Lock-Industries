"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || "nafi-lock-dev-secret";
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const admin = await db_1.default.adminUser.findUnique({ where: { email } });
        if (!admin)
            return res.status(401).json({ error: "Invalid credentials" });
        const valid = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!valid)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, admin: { id: admin.id, email: admin.email, role: admin.role } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map