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
import Pagination from "react-bootstrap/Pagination";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return {
				...state,
				products: action.payload,
				loading: false,
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "SET_CURRENT_PAGE":
			return { ...state, currentPage: action.payload };
		default:
			return state;
	}
};

export default function HomeScreen() {
	const [{ loading, error, products, currentPage, itemsPerPage }, dispatch] =
		useReducer(logger(reducer), {
			products: [],
			loading: true,
			error: "",
			currentPage: 1,
			itemsPerPage: 8,
		});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const result = await axios.get("/api/products");
				dispatch({ type: "FETCH_SUCCESS", payload: result.data });
			} catch (err) {
				dispatch({ type: "FETCH_FAIL", payload: err.message });
			}
		};
		fetchData();
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (pageNumber) => {
		const totalPages = Math.ceil(products.length / itemsPerPage);
		const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
		dispatch({ type: "SET_CURRENT_PAGE", payload: validPageNumber });
	};

	return (
		<div>
			<Helmet>
				<title>E-Commerce V2</title>
			</Helmet>
			<h4>Featured Products</h4>
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
							{currentItems.map((product) => (
								<Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
									<Product product={product}></Product>
								</Col>
							))}
						</Row>
						<Pagination className="justify-content-center mt-3">
							<Pagination.First
								onClick={() => handlePageChange(1)}
								disabled={currentPage === 1}
							/>
							<Pagination.Prev
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
							/>
							<Pagination.Item active>{currentPage}</Pagination.Item>
							<Pagination.Next
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={indexOfLastItem >= products.length}
							/>
							<Pagination.Last
								onClick={() =>
									handlePageChange(Math.ceil(products.length / itemsPerPage))
								}
							/>
						</Pagination>
					</>
				)}
			</div>
		</div>
	);
}
