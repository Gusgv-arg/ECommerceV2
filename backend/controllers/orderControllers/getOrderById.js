import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

export const getOrderById = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
})