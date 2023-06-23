import Product from "../../models/productModel.js";

export const getProductBySlug = async (req, res) => {
	//const product = await Product.findOne({ slug: { $eq: req.params.slug } }); Also works!!
	const product = await Product.findOne({ slug: req.params.slug });
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: "Product Not Found" });
	}
}