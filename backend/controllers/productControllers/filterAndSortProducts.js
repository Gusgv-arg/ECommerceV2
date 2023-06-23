import expressAsyncHandler from "express-async-handler";
import Product from "../../models/productModel.js";

const PAGE_SIZE = 8;

export const filterAndSortProducts = expressAsyncHandler(async (req, res) => {
	const { query } = req;
	const pageSize = query.pageSize || PAGE_SIZE;
	const page = query.page || 1;
	const category = query.category || "";
	const price = query.price || "";
	const rating = query.rating || "";
	const order = query.order || "";
	const searchQuery = query.query || "";

	const queryFilter =
		searchQuery && searchQuery !== "all"
			? {
					name: {
						$regex: searchQuery,
						$options: "i",
					},
			  }
			: {};
	const categoryFilter = category && category !== "all" ? { category } : {};
	const ratingFilter =
		rating && rating !== "all"
			? {
					rating: {
						$gte: Number(rating),
					},
			  }
			: {};
	const priceFilter =
		price && price !== "all"
			? {
					// 1-50
					price: {
						$gte: Number(price.split("-")[0]),
						$lte: Number(price.split("-")[1]),
					},
			  }
			: {};
	const sortOrder =
		order === "featured"
			? { featured: -1 }
			: order === "lowest"
			? { price: 1 }
			: order === "highest"
			? { price: -1 }
			: order === "toprated"
			? { rating: -1 }
			: order === "newest"
			? { createdAt: -1 }
			: { _id: -1 };

	const products = await Product.find({
		...queryFilter,
		...categoryFilter,
		...priceFilter,
		...ratingFilter,
	})
		.sort(sortOrder)
		.skip(pageSize * (page - 1))
		.limit(pageSize);

	const countProducts = await Product.countDocuments({
		...queryFilter,
		...categoryFilter,
		...priceFilter,
		...ratingFilter,
	});
	res.send({
		products,
		countProducts,
		page,
		pages: Math.ceil(countProducts / pageSize),
	});
});
