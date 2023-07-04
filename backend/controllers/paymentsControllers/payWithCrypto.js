import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Axios from "axios";

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
				user_id: "518d2bbb-b930-4c21-8138-d9c6ab75fef3",
                webhook_url: "https://014b-190-193-105-226.sa.ngrok.io/api/orders/webhookTalo"
			}
		);
		res.status(200).send(dataFromTalo.data);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});
