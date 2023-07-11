import expressAsyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Axios from "axios";

dotenv.config();

export const taloToken = expressAsyncHandler(async (req, res) => {
	try {
		const token = await Axios.post(
			`https://sandbox-api.talo.com.ar/users/${process.env.TALO_USER_ID}/tokens`,
			{
				client_id: process.env.TALO_CLIENT_ID,
				client_secret: process.env.TALO_CLIENT_SECRET,
			}
		);
		const tokenTalo = token.data.data.token;
		res.status(200).send({token: tokenTalo});
	} catch (error) {
		console.log("error", error.message);
        return res.status(500).send({ message: "Could not get keys from Talo" })
	}
});
