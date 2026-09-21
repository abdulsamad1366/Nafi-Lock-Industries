import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import brandsRouter from "./routes/brands.routes";
import productsRouter from "./routes/products.routes";
import categoriesRouter from "./routes/categories.routes";
import inquiriesRouter from "./routes/inquiries.routes";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/brands", brandsRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/auth", authRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🔒 Nafi Lock Industries API running on port ${PORT}`);
});

export default app;
