import expressAsyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";
import nodemailer from "nodemailer";
import { payOrderEmailTemplate } from "../../nodemailer/payOrderEmailTemplate.js";
import { transporter } from "../../nodemailer/transporter.js";

export const payOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "email name"
    );
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        const mailOptions = {
            from: "gusgvillafane@gmail.com",
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order E-CommerceV2 ${order._id}`,
            html: payOrderEmailTemplate(order),
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("email sent succesfuly ");
            }
        });

        res.send({ message: "Order Paid", order: updatedOrder });
    } else {
        res.status(404).send({ message: "Order Not Found" });
    }
})