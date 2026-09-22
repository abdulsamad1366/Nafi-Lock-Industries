import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure directories exist
const catalogsDir = path.join(process.cwd(), "uploads/catalogs");
const ledgersDir = path.join(process.cwd(), "uploads/ledgers");

if (!fs.existsSync(catalogsDir)) fs.mkdirSync(catalogsDir, { recursive: true });
if (!fs.existsSync(ledgersDir)) fs.mkdirSync(ledgersDir, { recursive: true });

const pdfFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extOk = path.extname(file.originalname).toLowerCase() === ".pdf";
  const mimeOk = file.mimetype === "application/pdf";
  if (extOk || mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF documents (.pdf) are allowed for catalogs and ledgers"));
  }
};

const catalogStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, catalogsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `catalog-${uniqueSuffix}.pdf`);
  },
});

export const uploadCatalogMiddleware = multer({
  storage: catalogStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
}).single("file");

const ledgerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, ledgersDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `ledger-${uniqueSuffix}.pdf`);
  },
});

export const uploadLedgerMiddleware = multer({
  storage: ledgerStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
}).single("file");
