import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";
import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";

export const dataForPanelAdmin = expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: "$totalPrice" },
            },
        },
    ]);
    const users = await User.aggregate([
        {
            $group: {
                _id: null,
                numUsers: { $sum: 1 },
            },
        },
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                orders: { $sum: 1 },
                sales: { $sum: "$totalPrice" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
})