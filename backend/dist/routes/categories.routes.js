"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
// GET /api/categories — list all categories
router.get("/", async (_req, res, next) => {
    try {
        const categories = await db_1.default.category.findMany({
            orderBy: { name: "asc" },
        });
        res.json(categories);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=categories.routes.js.map