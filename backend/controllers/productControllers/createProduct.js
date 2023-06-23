import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const createProduct = expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
        name: "sample name " + Date.now(),
        slug: "sample-name-" + Date.now(),
        image: "/images/p1.jpg",
        price: 0,
        category: "sample category",
        brand: "sample brand",
        stock: 0,
        rating: 0,
        numReviews: 0,
        description: "sample description",
    });
    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
})