import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const deleteProduct = expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.send({ message: "Product Deleted" });
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
})