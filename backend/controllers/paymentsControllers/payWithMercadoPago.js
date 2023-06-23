import expressAsyncHandler from "express-async-handler";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

export const payWithMercadoPago = expressAsyncHandler(async (req, res) => {
    mercadopago.configure({ access_token: process.env.ACCESS_TOKEN });
    const order = req.body;
    try {
        const result = await mercadopago.preferences.create({
            items: [
                {
                    title: "E-CommerceV2",
                    unit_price: order.totalPrice,
                    currency_id: "ARS",
                    quantity: 1,
                },
            ],
            external_reference: order._id,
            notification_url:
                "https://d27c-190-193-105-226.sa.ngrok.io/api/orders/webhook",
            back_urls: {
                success: `http://localhost:3000/order/${order._id}`,
                // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
                // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
            },
        });

        res.status(200).send({ result });
    } catch (error) {
        return res.status(500).send({ message: "Something goes wrong" });
    }
})