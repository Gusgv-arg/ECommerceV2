import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const getCategories = expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
})