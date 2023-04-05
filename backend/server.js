import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
//import data from "./data.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from './routes/orderRoutes.js'
import uploadRouter from "./routes/uploadRoutes.js";
import path from 'path';

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to db");
	})
	.catch((err) => {
		console.log(err.message);
	});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use('/api/upload', uploadRouter);
app.use("/api/users", userRouter);
app.use('/api/orders', orderRouter);
app.get('/api/keys/paypal', (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
  });
  
//For deploy
app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, '/frontend/build/index.html')))

//Catches errors due to express-async-handler
app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
