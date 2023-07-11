import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

export const getProductsByAdmin = expressAsyncHandler(async (req, res) => {
	const products = await Product.find();
	res.send(products);
});
//Old version with backend pagination
/*import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

const PAGE_SIZE = 8;

export const getProductsByAdmin = expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
}) */
