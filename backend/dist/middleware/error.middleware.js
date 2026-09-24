"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({
        error: !process.env.DATABASE_URL
            ? "DATABASE_URL is not configured on the server environment"
            : process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message,
    });
}
//# sourceMappingURL=error.middleware.js.map