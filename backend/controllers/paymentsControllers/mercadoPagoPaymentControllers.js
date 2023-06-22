import mercadopago from "mercadopago";
import Order from "../../models/orderModel.js";
import nodemailer from "nodemailer";
import { transporter } from "../../nodemailer/transporter.js";
import { payOrderEmailTemplate } from "../../nodemailer/payOrderEmailTemplate.js";

export const receiveWebhook = async (req, res) => {
	try {
		const payment = req.query;

		if (payment.type === "payment") {
			const data = await mercadopago.payment.findById(payment["data.id"]);

			const orderId = data.body.external_reference;
			
			const order = await Order.findById(orderId).populate(
				"user",
				"email name"
			);
			
			if (order) {
				order.isPaid = true;
				order.paidAt = Date.now();
				order.paymentResult = {
					id: data.body.id,
					status: data.status,
					update_time: data.body.date_approved,
					email_address: data.body.payer.email,
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
			}
		}
		res.send({ message: "Order Paid", order: updatedOrder });
	} catch (error) {
		return res.status(500).json({ message: "Your payment was rejected" });
	}
};
