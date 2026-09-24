"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBrands = getAllBrands;
exports.getBrandBySlug = getBrandBySlug;
exports.createBrand = createBrand;
exports.updateBrand = updateBrand;
exports.deleteBrand = deleteBrand;
const db_1 = __importDefault(require("../config/db"));
async function getAllBrands(_req, res, next) {
    try {
        const brands = await db_1.default.brand.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
        res.json(brands);
    }
    catch (err) {
        next(err);
    }
}
async function getBrandBySlug(req, res, next) {
    try {
        const brand = await db_1.default.brand.findUnique({
            where: { slug: req.params.slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: { category: true },
                },
            },
        });
        if (!brand)
            return res.status(404).json({ error: "Brand not found" });
        res.json(brand);
    }
    catch (err) {
        next(err);
    }
}
async function createBrand(req, res, next) {
    try {
        const brand = await db_1.default.brand.create({ data: req.body });
        res.status(201).json(brand);
    }
    catch (err) {
        next(err);
    }
}
async function updateBrand(req, res, next) {
    try {
        const brand = await db_1.default.brand.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(brand);
    }
    catch (err) {
        next(err);
    }
}
async function deleteBrand(req, res, next) {
    try {
        await db_1.default.brand.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=brands.controller.js.map