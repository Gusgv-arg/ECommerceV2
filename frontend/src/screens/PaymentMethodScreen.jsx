import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
	const navigate = useNavigate();

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { shippingAddress, paymentMethod },
	} = state;

	const [paymentMethodName, setPaymentMethod] = useState(
		paymentMethod || "PayPal"
	);

	useEffect(() => {
		if (!shippingAddress.address) {
			navigate("/shipping");
		}
	}, [shippingAddress, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
		localStorage.setItem("paymentMethod", paymentMethodName);
		navigate("/placeorder");
	};

	return (
		<div>
			<CheckoutSteps step1 step2 step3></CheckoutSteps>
			<div className="container small-container">
				<Helmet>
					<title>Payment Method</title>
				</Helmet>
				<h3 className="my-3">Payment Method</h3>
				<Form onSubmit={submitHandler}>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="PayPal"
							label="PayPal"
							value="PayPal"
							checked={paymentMethodName === "PayPal"}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Form.Check
							type="radio"
							id="Mercado Pago"
							label="Mercado Pago"
							value="Mercado Pago"
							checked={paymentMethodName === "Mercado Pago"}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<Button type="submit">Continue</Button>
					</div>					
					<p className="my-5"><span className="text-bold">Important!</span> In this Sandbox version, Mercado Pago payment will not receive the result due to the lack of SSL certificate.</p>
				</Form>
			</div>
		</div>
	);
}
