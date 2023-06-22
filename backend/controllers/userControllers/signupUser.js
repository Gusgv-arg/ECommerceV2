import expressAsyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { generateToken } from "../../utils.js";
import { userCreateEmailTemplate } from "../../nodemailer/userCreateEmailTemplate.js";
import { transporter } from "../../nodemailer/transporter.js";

export const signupUser = expressAsyncHandler(async (req, res) => {
	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password),
	});
	const user = await newUser.save();

	const mailOptions = {
		from: "gusgvillafane@gmail.com",
		to: req.body.email,
		subject: "Account Confirmation ECOMMERCEV2",
		html: userCreateEmailTemplate(user),
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("email sent succesfuly ");
		}
	});

	res.send({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: generateToken(user),
	});
});
