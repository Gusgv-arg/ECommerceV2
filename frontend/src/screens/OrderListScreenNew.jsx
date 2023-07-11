import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils/utils";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return {
				...state,
				orders: action.payload,
				loading: false,
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "DELETE_REQUEST":
			return { ...state, loadingDelete: true, successDelete: false };
		case "DELETE_SUCCESS":
			return {
				...state,
				loadingDelete: false,
				successDelete: true,
			};
		case "DELETE_FAIL":
			return { ...state, loadingDelete: false };
		case "DELETE_RESET":
			return { ...state, loadingDelete: false, successDelete: false };
		case "SET_CURRENT_PAGE":
			return { ...state, currentPage: action.payload };
		default:
			return state;
	}
};

export default function OrderListScreenNew() {
	const navigate = useNavigate();
	const { state } = useContext(Store);
	const { userInfo } = state;

	const [
		{
			loading,
			error,
			orders,
			loadingDelete,
			successDelete,
			currentPage,
			itemsPerPage,
		},
		dispatch,
	] = useReducer(reducer, {
		loading: true,
		error: "",
		orders: [],
		currentPage: 1,
		itemsPerPage: 10,
	});

	useEffect(() => {
		console.log("entra al useEffect!!!");
		const fetchData = async () => {
			try {
				dispatch({ type: "FETCH_REQUEST" });
				const { data } = await axios.get("/api/orders", {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				console.log("data del fetch", data);
				dispatch({ type: "FETCH_SUCCESS", payload: data });
			} catch (err) {
				dispatch({
					type: "FETCH_FAIL",
					payload: getError(err),
				});
			}
		};
		if (successDelete) {
			dispatch({ type: "DELETE_RESET" });
		} else {
			fetchData();
		}
	}, [userInfo, successDelete]);

	const deleteConfirm = async (order) => {
		try {
			dispatch({ type: "DELETE_REQUEST" });
			await axios.delete(`/api/orders/${order._id}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` },
			});
			toast.success("Order deleted successfully");
			dispatch({ type: "DELETE_SUCCESS" });
		} catch (err) {
			toast.error(getError(error));
			dispatch({
				type: "DELETE_FAIL",
			});
		}
	};

	const deleteHandler = (order) => {
		Swal.fire({
			title: "Atention",
			text: "Are you sure you want to delete this order?",
			icon: "warning",
			showDenyButton: true,
			denyButtonText: "Cancel",
			confirmButtonText: "Confirm",
		}).then((response) => {
			if (response.isConfirmed) {
				deleteConfirm(order);
			} else {
				return;
			}
		});
	};

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
				<title>Orders</title>
			</Helmet>
			<h3>Orders</h3>
			{loadingDelete && <LoadingBox></LoadingBox>}
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
								<th>USER</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody group-divider>
							{currentItems.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.user ? order.user.name : "DELETED USER"}</td>
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
										&nbsp;
										<Button
											type="button"
											variant="light"
											onClick={() => deleteHandler(order)}
										>
											<i className="fas fa-trash"></i>
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
