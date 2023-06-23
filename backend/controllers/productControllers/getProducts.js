import Product from "../../models/productModel.js";

const PAGE_SIZE = 8;

export const getProducts = async (req, res) => {
	const { query } = req;
	const pageSize = query.pageSize || PAGE_SIZE;
	const page = query.page || 1;

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
}