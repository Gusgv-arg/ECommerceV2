import Product from "../../models/productModel.js";

export const getProductById = async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: "Product Not Found" });
	}
}