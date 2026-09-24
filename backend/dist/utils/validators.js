"use strict";
/**
 * Basic validation helpers for API request bodies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isNonEmptyString = isNonEmptyString;
exports.validateInquiryBody = validateInquiryBody;
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function validateInquiryBody(body) {
    if (!isNonEmptyString(body.name))
        return "Name is required";
    if (!isNonEmptyString(body.email))
        return "Email is required";
    if (!isValidEmail(body.email))
        return "Invalid email format";
    if (!isNonEmptyString(body.phone))
        return "Phone is required";
    if (!isNonEmptyString(body.message))
        return "Message is required";
    return null;
}
//# sourceMappingURL=validators.js.map