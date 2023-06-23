import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

export const deliverOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.send({ message: "Order Delivered" });
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
})