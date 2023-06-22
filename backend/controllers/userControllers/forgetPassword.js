import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../../models/userModel.js";
import { resetPasswordEmailTemplate } from "../../nodemailer/resetPasswordEmailtemplate.js";
import { baseUrl } from "../../utils.js";
import { transporter } from "../../nodemailer/transporter.js";

export const forgetPassword = expressAsyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (user) {
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});
		user.resetToken = token;
		await user.save();

		//reset link
		console.log(`${baseUrl()}/reset-password/${token}`);

		const mailOptions = {
			from: "ECOMMERCEV2 <gusgvillafane@gmail.com>",
			to: `${user.name} <${user.email}>`,
			subject: "Reset Password - ECOMMERCEV2",
			html: resetPasswordEmailTemplate(baseUrl, token),
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Reset password email sent succesfuly ");
			}
		});

		res.send({ message: "We sent reset password link to your email." });
	} else {
		res.status(404).send({ message: "User not found" });
	}
});
