import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const modifyProduct = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.price = req.body.price;
        product.image = req.body.image;
        product.images = req.body.images;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.stock = req.body.stock;
        product.description = req.body.description;
        await product.save();
        res.send({ message: "Product Updated" });
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
})