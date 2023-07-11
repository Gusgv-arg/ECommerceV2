import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils/utils";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, orders: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "SET_CURRENT_PAGE":
			return { ...state, currentPage: action.payload };
		default:
			return state;
	}
};

export default function OrderHistoryScreen() {
	const { state } = useContext(Store);
	const { userInfo } = state;
	const navigate = useNavigate();

	const [{ loading, error, orders, currentPage, itemsPerPage }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: "",
			orders: [],
			currentPage: 1,
			itemsPerPage: 10,
		});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: "FETCH_REQUEST" });
			try {
				const { data } = await axios.get(
					`/api/orders/mine`,

					{ headers: { Authorization: `Bearer ${userInfo.token}` } }
				);
				dispatch({ type: "FETCH_SUCCESS", payload: data });
			} catch (error) {
				dispatch({
					type: "FETCH_FAIL",
					payload: getError(error),
				});
			}
		};
		fetchData();
	}, [userInfo]);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (pageNumber) => {
		const totalPages = Math.ceil(orders.length / itemsPerPage);
		const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
		dispatch({ type: "SET_CURRENT_PAGE", payload: validPageNumber });
	};

	return (
		<div>
			<Helmet>
				<title>Order History</title>
			</Helmet>

			<h3>Order History</h3>
			{loading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<>
					<Table striped hover responsive className="table">
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{currentItems.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>{order.totalPrice.toFixed(2)}</td>
									<td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
									<td>
										{order.isDelivered
											? order.deliveredAt.substring(0, 10)
											: "No"}
									</td>
									<td>
										<Button
											type="button"
											variant="light"
											onClick={() => {
												navigate(`/order/${order._id}`);
											}}
										>
											Details
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>

					<Pagination className="justify-content-center">
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
							disabled={indexOfLastItem >= orders.length}
						/>
						<Pagination.Last
							onClick={() =>
								handlePageChange(Math.ceil(orders.length / itemsPerPage))
							}
						/>
					</Pagination>
				</>
			)}
		</div>
	);
}
