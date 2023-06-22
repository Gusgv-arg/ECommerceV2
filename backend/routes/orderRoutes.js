import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth, isAdmin } from "../utils.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import nodemailer from "nodemailer";
import { transporter } from "../nodemailer/transporter.js";
import { payOrderEmailTemplate } from "../nodemailer/payOrderEmailTemplate.js";
import mercadopago from "mercadopago";
import dotenv from "dotenv";
import { receiveWebhook } from "../controllers/paymentsControllers/mercadoPagoPaymentControllers.js";

dotenv.config();

const orderRouter = express.Router();

const PAGE_SIZE = 6;

orderRouter.get(
	"/",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const orders = await Order.find()
			.populate("user", "name")
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		const countOrders = await Order.countDocuments();

		res.send({
			orders,
			countOrders,
			page,
			pages: Math.ceil(countOrders / pageSize),
		});
	})
);

orderRouter.post(
	"/",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const newOrder = new Order({
			orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
			shippingAddress: req.body.shippingAddress,
			paymentMethod: req.body.paymentMethod,
			itemsPrice: req.body.itemsPrice,
			shippingPrice: req.body.shippingPrice,
			taxPrice: req.body.taxPrice,
			totalPrice: req.body.totalPrice,
			user: req.user._id,
		});

		const order = await newOrder.save();
		res.status(201).send({ message: "New Order Created", order });
	})
);

orderRouter.get(
	"/summary",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const orders = await Order.aggregate([
			{
				$group: {
					_id: null,
					numOrders: { $sum: 1 },
					totalSales: { $sum: "$totalPrice" },
				},
			},
		]);
		const users = await User.aggregate([
			{
				$group: {
					_id: null,
					numUsers: { $sum: 1 },
				},
			},
		]);
		const dailyOrders = await Order.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					orders: { $sum: 1 },
					sales: { $sum: "$totalPrice" },
				},
			},
			{ $sort: { _id: 1 } },
		]);
		const productCategories = await Product.aggregate([
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
				},
			},
		]);
		res.send({ users, orders, dailyOrders, productCategories });
	})
);

orderRouter.get(
	"/mine",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const orders = await Order.find({ user: req.user._id });
		res.send(orders);
	})
);

orderRouter.get(
	"/:id",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);
		if (order) {
			res.send(order);
		} else {
			res.status(404).send({ message: "Order Not Found" });
		}
	})
);

orderRouter.post(
	"/pay_mercadopago",
	//isAuth,
	expressAsyncHandler(async (req, res) => {
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
);

orderRouter.post("/webhook", receiveWebhook);

orderRouter.put(
	"/:id/pay",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id).populate(
			"user",
			"email name"
		);
		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.email_address,
			};

			const updatedOrder = await order.save();

			const mailOptions = {
				from: "gusgvillafane@gmail.com",
				to: `${order.user.name} <${order.user.email}>`,
				subject: `New order E-CommerceV2 ${order._id}`,
				html: payOrderEmailTemplate(order),
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log("email sent succesfuly ");
				}
			});

			res.send({ message: "Order Paid", order: updatedOrder });
		} else {
			res.status(404).send({ message: "Order Not Found" });
		}
	})
);

orderRouter.put(
	"/:id/deliver",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);
		if (order) {
			order.isDelivered = true;
			order.deliveredAt = Date.now();
			await order.save();
			res.send({ message: "Order Delivered" });
		} else {
			res.status(404).send({ message: "Order Not Found" });
		}
	})
);

orderRouter.delete(
	"/:id",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const order = await Order.findById(req.params.id);
		if (order) {
			await order.remove();
			res.send({ message: "Order Deleted" });
		} else {
			res.status(404).send({ message: "Order Not Found" });
		}
	})
);

export default orderRouter;
