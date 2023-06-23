import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import { getProducts } from "../controllers/productControllers/getProducts.js";
import { getCategories } from "../controllers/productControllers/getCategories.js";
import { createProduct } from "../controllers/productControllers/createProduct.js";
import { updateStock } from "../controllers/productControllers/updateStock.js";
import { modifyProduct } from "../controllers/productControllers/modifyProduct.js";
import { getProductsByAdmin } from "../controllers/productControllers/getProductsByAdmin.js";
import { filterAndSortProducts } from "../controllers/productControllers/filterAndSortProducts.js";
import { getProductById } from "../controllers/productControllers/getProductById.js";
import { getProductBySlug } from "../controllers/productControllers/getProductBySlug.js";
import { deleteProduct } from "../controllers/productControllers/deleteProduct.js";
import { createReview } from "../controllers/productControllers/createReview.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/categories", getCategories);
productRouter.post("/", isAuth, isAdmin, createProduct);
productRouter.put("/:id", isAuth, isAdmin, modifyProduct);
productRouter.put("/customer/:id", isAuth, updateStock);
productRouter.get("/admin", isAuth, isAdmin, getProductsByAdmin);
productRouter.get("/search", filterAndSortProducts);
productRouter.get("/slug/:slug", getProductBySlug);
productRouter.get("/:id", getProductById);
productRouter.delete("/:id", isAuth, isAdmin, deleteProduct);
productRouter.post("/:id/reviews", isAuth, createReview);

export default productRouter;
