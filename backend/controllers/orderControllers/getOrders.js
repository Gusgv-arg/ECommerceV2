import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

export const getOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
})