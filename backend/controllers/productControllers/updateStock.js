import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const updateStock = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const modStock = req.body.stock;

    const product = await Product.findById(productId);
    if (product) {
        product.stock = product.stock + modStock;
        await product.save();
        res.send({ message: "Product Stock Updated" });
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
})