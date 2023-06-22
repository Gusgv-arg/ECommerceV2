import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils.js";

export const signinUser = expressAsyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (user && !bcrypt.compareSync(user.email, user.password)) {
		if (bcrypt.compareSync(req.body.password, user.password)) {
			res.send({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				token: generateToken(user),
			});
			return;
		} else {
			res.status(401).send({ message: "Invalid password" });
		}
	}
	if (
		user &&
		bcrypt.compareSync(user.email, user.password) &&
		req.body.password === user.email
	) {
		res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user),
		});
		return;
	} else {
		if (user) {
			res.status(401).send({
				message:
					"You are already registered with Google. Please Login with Google",
			});
		} else {
			res.status(401).send({
				message:
					"You are not registered. Please create an account or Login with Google",
			});
		}
	}
});
