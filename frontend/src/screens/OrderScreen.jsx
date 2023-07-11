import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils/utils";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import mercado_pago from "../images/logo-mercado-pago.webp";
import { statusTalo } from "../utils/statusTalo";

function reducer(state, action) {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true, error: "" };
		case "FETCH_SUCCESS":
			return { ...state, loading: false, order: action.payload, error: "" };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "PAY_REQUEST":
			return { ...state, loadingPay: true };
		case "PAY_SUCCESS":
			return { ...state, loadingPay: false, successPay: true };
		case "PAY_FAIL":
			return { ...state, loadingPay: false };

		//crypto cases
		case "FETCH_REQUEST_CRYPTO":
			return { ...state, loadingPayCrypto: true, error: "" };
		case "FETCH_SUCCESS_CRYPTO":
			return {
				...state,
				loadingPayCrypto: false,
				order: action.payload,
				error: "",
			};
		case "FETCH_FAIL_CRYPTO":
			return { ...state, loadingPayCrypto: false, error: action.payload };
		case "PAY_REQUEST_CRYPTO":
			return { ...state, loadingPayCrypto: true };
		case "PAY_SUCCESS_CRYPTO":
			return { ...state, loadingPayCrypto: false, successPayCrypto: true };
		case "PAY_FAIL_CRYPTO":
			return { ...state, loadingPayCrypto: false };

		case "PAY_RESET":
			return { ...state, loadingPay: false, successPay: false };
		case "DELIVER_REQUEST":
			return { ...state, loadingDeliver: true };
		case "DELIVER_SUCCESS":
			return { ...state, loadingDeliver: false, successDeliver: true };
		case "DELIVER_FAIL":
			return { ...state, loadingDeliver: false };
		case "DELIVER_RESET":
			return {
				...state,
				loadingDeliver: false,
				successDeliver: false,
			};
		default:
			return state;
	}
}

export default function OrderScreen() {
	const { state } = useContext(Store);
	const { userInfo, cart } = state;

	const params = useParams();
	const { id: orderId } = params;
	const navigate = useNavigate();

	const [taloToken, setTaloToken] = useState("");

	const [
		{
			loading,
			error,
			order,
			successPay,
			successPayCrypto,
			loadingPay,
			loadingPayCrypto,
			loadingDeliver,
			successDeliver,
		},
		dispatch,
	] = useReducer(reducer, {
		loading: true,
		order: {},
		error: "",
		successPay: false,
		loadingPay: false,
		loadingPayCrypto: false,
		successPayCrypto: false,
	});

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	function createOrder(data, actions) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: order.totalPrice },
					},
				],
			})
			.then((orderID) => {
				return orderID;
			});
	}

	function onApprove(data, actions) {
		return actions.order.capture().then(async function (details) {
			try {
				dispatch({ type: "PAY_REQUEST" });
				const { data } = await axios.put(
					`/api/orders/${order._id}/pay`,
					details,
					{
						headers: { authorization: `Bearer ${userInfo.token}` },
					}
				);
				dispatch({ type: "PAY_SUCCESS", payload: data });
				toast.success("Order is paid");
			} catch (err) {
				dispatch({ type: "PAY_FAIL", payload: getError(err) });
				toast.error(getError(err));
			}
		});
	}

	function onError(err) {
		toast.error(getError(err));
	}

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: "FETCH_REQUEST" });
				const { data } = await axios.get(`/api/orders/${orderId}`, {
					headers: { authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: "FETCH_SUCCESS", payload: data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: getError(err) });
			}
		};

		if (!userInfo) {
			return navigate("/login");
		}
		if (
			!order._id ||
			successPay ||
			successDeliver ||
			(order._id && order._id !== orderId)
		) {
			fetchOrder();
			if (successPay) {
				dispatch({ type: "PAY_RESET" });
			}
			if (successDeliver) {
				dispatch({ type: "DELIVER_RESET" });
			}
		} else {
			if (order.paymentMethod === "Paypal") {
				const loadPaypalScript = async () => {
					const { data: clientId } = await axios.get("/api/keys/paypal", {
						headers: { authorization: `Bearer ${userInfo.token}` },
					});
					paypalDispatch({
						type: "resetOptions",
						value: {
							"client-id": clientId,
							currency: "USD",
						},
					});
					paypalDispatch({ type: "setLoadingStatus", value: "pending" });
				};
				loadPaypalScript();
			}
			if (order.paymentMethod === "Crypto") {
				const fetchTaloToken = async () => {
					const data = await axios.get("/api/keys/talo");
					const taloToken = await data.data.token;
					setTaloToken(taloToken);
				};
				fetchTaloToken();
			}
			if (
				order.paymentMethod === "Crypto" &&
				order.hasOwnProperty("paymentResult") &&
				successPayCrypto === false
			) {
				const paymentId = order.paymentResult.id;
				const statusCryptoPayment = async () => {
					const status = await statusTalo(taloToken, paymentId);
					if (status === "SUCCESS") {
						try {
							dispatch({ type: "PAY_REQUEST_CRYPTO" });
							const { data } = await axios.put(
								`/api/orders/${order._id}/pay`,
								order,
								{
									headers: { authorization: `Bearer ${userInfo.token}` },
								}
							);
							dispatch({ type: "PAY_SUCCESS_CRYPTO", payload: data });
							toast.success("Your Order was paid successfully");
							navigate("/");
						} catch (err) {
							dispatch({ type: "PAY_FAIL_CRYPTO", payload: getError(err) });
							toast.error(getError(err));
						}
					}
					if (status === "UNDERPAYED") {
						dispatch({ type: "PAY_SUCCESS_CRYPTO" });
						toast.error(`Your payment was ${status}. Please contact us.`);
					}
					if (status === "OVERPAID") {
						dispatch({ type: "PAY_SUCCESS_CRYPTO" });
						toast.info(`Your payment was ${status}. Please contact us.`);
					}
				};
				statusCryptoPayment();
				
			}
		}
	}, [
		order,
		userInfo,
		orderId,
		navigate,
		successPay,
		paypalDispatch,
		successDeliver,
		taloToken,
		successPayCrypto,
	]);

	async function deliverOrderConfirmHandler() {
		try {
			dispatch({ type: "DELIVER_REQUEST" });
			const { data } = await axios.put(
				`/api/orders/${order._id}/deliver`,
				{},
				{
					headers: { authorization: `Bearer ${userInfo.token}` },
				}
			);
			dispatch({ type: "DELIVER_SUCCESS", payload: data });
			toast.success("Order is delivered");
		} catch (err) {
			toast.error(getError(err));
			dispatch({ type: "DELIVER_FAIL" });
		}
	}

	const deliverOrderHandler = () => {
		Swal.fire({
			title: "Atention",
			text: "Are you sure you want to deliver this order?",
			icon: "warning",
			showDenyButton: true,
			denyButtonText: "Cancel",
			confirmButtonText: "Confirm",
		}).then((response) => {
			if (response.isConfirmed) {
				deliverOrderConfirmHandler();
			} else {
				return;
			}
		});
	};

	const redirectToExternalUrl = (paymentUrl) => {
		window.location.href = `${paymentUrl}`;
	};

	const handleCrypto = async () => {
		try {
			const response = await axios.post("/api/orders/pay_crypto", order, {
				headers: {
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			const paymentUrl = response.data.paymentResult.url_crypto_payment;
			redirectToExternalUrl(paymentUrl);
		} catch (error) {
			toast.error(getError(error));
		}
	};

	const handleMercadoPago = async () => {
		try {
			const { data } = await axios.post("/api/orders/pay_mercadopago", order, {
				headers: {
					authorization: `Bearer ${userInfo.token}`,
				},
			});
			const paymentUrl = data.result.body.init_point;
			window.open(paymentUrl, "_blank");
		} catch (error) {
			toast.error(getError(error));
		}
	};

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<div>
			<Helmet>
				<title>Order {orderId}</title>
			</Helmet>
			<h3 className="my-3">Order {orderId}</h3>
			<Row>
				<Col md={8}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Shipping</Card.Title>
							<Card.Text>
								<strong>Name:</strong> {order.shippingAddress.fullName} <br />
								<strong>Address: </strong> {order.shippingAddress.address},
								{order.shippingAddress.city}, {order.shippingAddress.postalCode}
								,{order.shippingAddress.country}
								&nbsp;
								{order.shippingAddress.location &&
									order.shippingAddress.location.lat && (
										<Link
											target="_new"
											to={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
										>
											Show On Map
										</Link>
									)}
							</Card.Text>
							{order.isDelivered ? (
								<MessageBox variant="success">
									Delivered at {order.deliveredAt}
								</MessageBox>
							) : (
								<MessageBox variant="danger">Not Delivered</MessageBox>
							)}
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Payment</Card.Title>
							<Card.Text>
								<strong>Method:</strong> {order.paymentMethod}
							</Card.Text>
							{order.isPaid ? (
								<MessageBox variant="success">
									Paid at {order.paidAt}
								</MessageBox>
							) : (
								<MessageBox variant="danger">Not Paid</MessageBox>
							)}
						</Card.Body>
					</Card>

					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Items</Card.Title>
							<ListGroup variant="flush">
								{order.orderItems.map((item) => (
									<ListGroup.Item key={item._id}>
										<Row className="align-items-center">
											<Col md={6}>
												<img
													src={item.image}
													alt={item.name}
													className="img-fluid rounded img-thumbnail"
												></img>{" "}
												<Link to={`/product/${item.slug}`}>{item.name}</Link>
											</Col>
											<Col md={3}>
												<span>{item.quantity}</span>
											</Col>
											<Col md={3}>${item.price}</Col>
										</Row>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title className="text-center">Order Summary</Card.Title>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col>Items</Col>
										<Col>${order.itemsPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Shipping</Col>
										<Col>${order.shippingPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Tax</Col>
										<Col>${order.taxPrice.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>
											<strong> Order Total</strong>
										</Col>
										<Col>
											<strong>${order.totalPrice.toFixed(2)}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								{!order.isPaid && (
									<ListGroup.Item>
										{cart.paymentMethod === "Mercado Pago" && (
											<div className="d-flex justify-content-around align-items-center">
												<div>Pay with </div>

												<Button
													className="btn-Mercado-Pago"
													onClick={handleMercadoPago}
												>
													<img src={mercado_pago} alt="image_mercado_pago" />
												</Button>
											</div>
										)}

										{cart.paymentMethod === "Crypto" && (
											<div className="d-flex justify-content-around align-items-center">
												<Button variant="success" onClick={handleCrypto}>
													Pay with Crypto powered by Talo
												</Button>
											</div>
										)}

										{cart.paymentMethod === "PayPal" && isPending ? (
											<LoadingBox />
										) : (
											cart.paymentMethod === "PayPal" && (
												<div>
													<PayPalButtons
														createOrder={createOrder}
														onApprove={onApprove}
														onError={onError}
													></PayPalButtons>
												</div>
											)
										)}
										{loadingPay && <LoadingBox></LoadingBox>}
									</ListGroup.Item>
								)}
								{userInfo.isAdmin && order.isPaid && !order.isDelivered && (
									<ListGroup.Item>
										{loadingDeliver && <LoadingBox></LoadingBox>}
										<div className="d-grid">
											<Button type="button" onClick={deliverOrderHandler}>
												Deliver Order
											</Button>
										</div>
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
