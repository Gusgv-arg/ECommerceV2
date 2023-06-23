import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const createReview = expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        if (product.reviews.find((x) => x.name === req.user.name)) {
            return res
                .status(400)
                .send({ message: "Sorry. You already submitted a review" });
        }

        const review = {
            name: req.user.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((a, c) => c.rating + a, 0) /
            product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
            message: "Review Created",
            review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
            numReviews: product.numReviews,
            rating: product.rating,
        });
    } else {
        res.status(404).send({ message: "Product Not Found" });
    }
})