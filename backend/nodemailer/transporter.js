import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: "gusgvillafane@gmail.com",
		pass: "bmpzvyqrsxlqipyg"
		//user: process.env.SMTP_EMAIL,
		//pass: process.env.SMTP_PASSWORD
	},
});

