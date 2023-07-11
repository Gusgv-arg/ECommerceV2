import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Axios from "axios";
import Order from "../../models/orderModel.js";

dotenv.config();


export const payWithCrypto = expressAsyncHandler(async (req, res) => {
	const order = req.body;
	try {
		const dataFromTalo = await Axios.post(
			"https://sandbox-api.talo.com.ar/payments/",
			{
				price: {
					amount: order.totalPrice,
					currency: "USD",
				},
				user_id: process.env.TALO_USER_ID,
                webhook_url: "https://c316-190-193-105-226.sa.ngrok.io/api/orders/webhookTalo",
				redirect_url: `http://localhost:3000/order/${order._id}`
			}
		);
		//console.log("id payment", dataFromTalo.data.data.id)
		const cryptoPaymentUrl = dataFromTalo.data.data.payment_url
		//console.log("url", cryptoPaymentUrl)
		const cryptoIdPayment=dataFromTalo.data.data.id
		//console.log("order", order)
		const orderDb = await Order.findById(order._id).populate(
			"user",
			"email name"
		);
		if (orderDb){
			orderDb.paymentResult = {
				id: cryptoIdPayment,
				url_crypto_payment: cryptoPaymentUrl,
				status: "Pending",
				update_time: "",
				email_address: orderDb.user.email,
			};
			console.log("orderdb", orderDb)
			//console.log("criptopaymentid grabado en la orden", orderDb.paymentResult.id)
		}
		const updatedOrder = await orderDb.save();
		console.log("orderDb grabada", updatedOrder)
		//res.status(200).send(dataFromTalo.data);
		res.status(200).send(updatedOrder);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});
