"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inquiries_controller_1 = require("../controllers/inquiries.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public — submit an inquiry
router.post("/", inquiries_controller_1.createInquiry);
// Admin-protected — view and manage inquiries
router.get("/", auth_middleware_1.authMiddleware, inquiries_controller_1.getAllInquiries);
router.patch("/:id/status", auth_middleware_1.authMiddleware, inquiries_controller_1.updateInquiryStatus);
exports.default = router;
//# sourceMappingURL=inquiries.routes.js.map