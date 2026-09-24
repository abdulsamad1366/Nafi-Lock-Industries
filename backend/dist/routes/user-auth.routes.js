"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_auth_controller_1 = require("../controllers/user-auth.controller");
const router = (0, express_1.Router)();
// Public User Authentication
router.post("/signup", user_auth_controller_1.signup);
router.post("/login", user_auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=user-auth.routes.js.map