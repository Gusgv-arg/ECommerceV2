import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

export const getOrdersByAdmin = expressAsyncHandler(async (req, res) => {
	const orders = await Order.find().populate("user", "name");
	res.send(orders);
}); 

//Old version with pagination in backend
/* import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

const PAGE_SIZE = 6;

export const getOrdersByAdmin = expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const orders = await Order.find()
        .populate("user", "name")
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    const countOrders = await Order.countDocuments();

    res.send({
        orders,
        countOrders,
        page,
        pages: Math.ceil(countOrders / pageSize),
    });
}) */