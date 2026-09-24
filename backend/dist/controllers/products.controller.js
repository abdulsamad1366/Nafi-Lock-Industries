"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductBySlug = getProductBySlug;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const db_1 = __importDefault(require("../config/db"));
const product_serializer_1 = require("../utils/product-serializer");
async function getAllProducts(req, res, next) {
    try {
        const { brand, category } = req.query;
        const where = { isActive: true };
        if (brand)
            where.brand = { slug: brand };
        if (category)
            where.category = { slug: category };
        const products = await db_1.default.product.findMany({
            where,
            include: { brand: true, category: true },
            orderBy: { name: "asc" },
        });
        const isApproved = await (0, product_serializer_1.isUserApprovedDistributor)(req.user);
        res.json((0, product_serializer_1.serializeProducts)(products, isApproved));
    }
    catch (err) {
        next(err);
    }
}
async function getProductBySlug(req, res, next) {
    try {
        const product = await db_1.default.product.findUnique({
            where: { slug: req.params.slug },
            include: { brand: true, category: true },
        });
        if (!product || !product.isActive)
            return res.status(404).json({ error: "Product not found" });
        const isApproved = await (0, product_serializer_1.isUserApprovedDistributor)(req.user);
        res.json((0, product_serializer_1.serializeProduct)(product, isApproved));
    }
    catch (err) {
        next(err);
    }
}
async function createProduct(req, res, next) {
    try {
        // Handle uploaded images from multer
        const images = req.files
            ? req.files.map((f) => `/uploads/${f.filename}`)
            : [];
        const product = await db_1.default.product.create({
            data: {
                ...req.body,
                numberOfKeys: parseInt(req.body.numberOfKeys, 10) || 0,
                dealerPrice: req.body.dealerPrice ? parseFloat(req.body.dealerPrice) : null,
                minOrderQty: req.body.minOrderQty ? parseInt(req.body.minOrderQty, 10) : null,
                images,
            },
        });
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
}
async function updateProduct(req, res, next) {
    try {
        const newImages = req.files
            ? req.files.map((f) => `/uploads/${f.filename}`)
            : undefined;
        const data = { ...req.body };
        if (req.body.numberOfKeys)
            data.numberOfKeys = parseInt(req.body.numberOfKeys, 10);
        if (req.body.dealerPrice !== undefined) {
            data.dealerPrice = req.body.dealerPrice ? parseFloat(req.body.dealerPrice) : null;
        }
        if (req.body.minOrderQty !== undefined) {
            data.minOrderQty = req.body.minOrderQty ? parseInt(req.body.minOrderQty, 10) : null;
        }
        if (newImages && newImages.length > 0)
            data.images = newImages;
        const product = await db_1.default.product.update({
            where: { id: req.params.id },
            data,
        });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
}
async function deleteProduct(req, res, next) {
    try {
        await db_1.default.product.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=products.controller.js.map