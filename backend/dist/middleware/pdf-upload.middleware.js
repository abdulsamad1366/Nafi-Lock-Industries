"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLedgerMiddleware = exports.uploadCatalogMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure directories exist
const catalogsDir = path_1.default.join(process.cwd(), "uploads/catalogs");
const ledgersDir = path_1.default.join(process.cwd(), "uploads/ledgers");
if (!fs_1.default.existsSync(catalogsDir))
    fs_1.default.mkdirSync(catalogsDir, { recursive: true });
if (!fs_1.default.existsSync(ledgersDir))
    fs_1.default.mkdirSync(ledgersDir, { recursive: true });
const pdfFileFilter = (_req, file, cb) => {
    const extOk = path_1.default.extname(file.originalname).toLowerCase() === ".pdf";
    const mimeOk = file.mimetype === "application/pdf";
    if (extOk || mimeOk) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF documents (.pdf) are allowed for catalogs and ledgers"));
    }
};
const catalogStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, catalogsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `catalog-${uniqueSuffix}.pdf`);
    },
});
exports.uploadCatalogMiddleware = (0, multer_1.default)({
    storage: catalogStorage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
}).single("file");
const ledgerStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, ledgersDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `ledger-${uniqueSuffix}.pdf`);
    },
});
exports.uploadLedgerMiddleware = (0, multer_1.default)({
    storage: ledgerStorage,
    fileFilter: pdfFileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
}).single("file");
//# sourceMappingURL=pdf-upload.middleware.js.map