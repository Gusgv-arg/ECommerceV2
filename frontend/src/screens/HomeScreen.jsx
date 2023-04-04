import React from "react";
import { useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return {
				...state,
				products: action.payload.products,
				page: action.payload.page,
				pages: action.payload.pages,
				loading: false,
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export default function HomeScree() {
	const [{ loading, error, products, pages }, dispatch] = useReducer(
		logger(reducer),
		{
			products: [],
			loading: true,
			error: "",
		}
	);

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const page = sp.get("page") || 1;

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get(`/api/products?page=${page}`);
				dispatch({ type: "FETCH_SUCCESS", payload: result.data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: err.message });
			}
		};
		fetchData();
	}, [page]);

	return (
		<div>
			<Helmet>
				<title>E-Commerce V2</title>
			</Helmet>
			<h3>Featured Products</h3>
			<div className="products">
				{loading ? (
					<div>
						<LoadingBox></LoadingBox>{" "}
					</div>
				) : error ? (
					<MessageBox variant="danger">{error}</MessageBox>
				) : (
					<>
						<Row>
							{products.map((product) => (
								<Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
									<Product product={product}></Product>
								</Col>
							))}
						</Row>
						<div>
						{[...Array(pages).keys()].map((x) => (
							<Link
								/* className={x + 1 === Number(page) ? "btn text-bold" : "btn"} */
								key={x + 1}
								to={`/?page=${x + 1}`}
							>
								<Button className={x + 1 === Number(page) ? "btn text-bold mx-1 " : "btn mx-1"}>{x+1}</Button>
							</Link>
						))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
