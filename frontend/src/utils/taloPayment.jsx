import Axios from "axios";

export const taloPayment = async (amount, currency) => {
	const response = await Axios.post(
		"https://sandbox-api.talo.com.ar/payments/",
		{
			price: {
				amount: amount,
				currency: currency,
			},
			user_id: "9f51b1b2-b0cb-446d-88f7-84a78ae0e715",
		}
	);   	 
    const paymentUrl=  response.data.data.payment_url;
    return paymentUrl
};
