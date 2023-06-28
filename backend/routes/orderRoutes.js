import express from "express";
import { isAuth, isAdmin } from "../utils.js";
import { receiveWebhook } from "../controllers/paymentsControllers/mercadoPagoPaymentControllers.js";
import { getOrdersByAdmin } from "../controllers/orderControllers/getOrdersByAdmin.js";
import { createOrder } from "../controllers/orderControllers/createOrder.js";
import { dataForPanelAdmin } from "../controllers/orderControllers/dataForPanelAdmin.js";
import { getOrders } from "../controllers/orderControllers/getOrders.js";
import { getOrderById } from "../controllers/orderControllers/getOrderById.js";
import { payWithMercadoPago } from "../controllers/paymentsControllers/payWithMercadoPago.js";
import { payOrder } from "../controllers/orderControllers/payOrder.js";
import { deliverOrder } from "../controllers/orderControllers/deliverOrder.js";
import { deleteOrder } from "../controllers/orderControllers/deleteOrder.js";

const orderRouter = express.Router();

orderRouter.get("/", isAuth, isAdmin, getOrdersByAdmin);
orderRouter.post("/", isAuth, createOrder);
orderRouter.get("/summary", isAuth, isAdmin, dataForPanelAdmin);
orderRouter.get("/mine", isAuth, getOrders);
orderRouter.get("/:id", isAuth, getOrderById);
orderRouter.post("/pay_mercadopago", isAuth, payWithMercadoPago);
orderRouter.post("/webhook", receiveWebhook);
orderRouter.put("/:id/pay", isAuth, payOrder);
orderRouter.put("/:id/deliver", isAuth, deliverOrder);
orderRouter.delete("/:id", isAuth, isAdmin, deleteOrder);

export default orderRouter;
