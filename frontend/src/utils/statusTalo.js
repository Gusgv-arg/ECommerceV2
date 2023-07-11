import Axios from "axios";
import { toast } from "react-toastify";
import { getError } from "./utils";

export const statusTalo = async (taloToken, paymentId) => {
	try {
		const data = await Axios.get(
			`https://sandbox-api.talo.com.ar/payments/${paymentId}`,
			{
				headers: {
					Authorization: `Bearer ${taloToken}`,
				},
			}
		);
		const status = await data.data.data.payment_status;
		return status;
	} catch (error) {
		console.log("error desde statusTalo", error.message);
		//toast.error(getError(error));
	}
};
