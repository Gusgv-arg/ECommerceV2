import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

export const deleteOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.remove();
        res.send({ message: "Order Deleted" });
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
})