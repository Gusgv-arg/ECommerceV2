import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { getError } from "../utils/utils";
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
				products: action.payload,
				loading: false,
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "CREATE_REQUEST":
			return { ...state, loadingCreate: true };
		case "CREATE_SUCCESS":
			return {
				...state,
				loadingCreate: false,
			};
		case "CREATE_FAIL":
			return { ...state, loadingCreate: false };
		case "DELETE_REQUEST":
			return { ...state, loadingDelete: true, successDelete: false };
		case "DELETE_SUCCESS":
			return {
				...state,
				loadingDelete: false,
				successDelete: true,
			};
		case "DELETE_FAIL":
			return { ...state, loadingDelete: false, successDelete: false };

		case "DELETE_RESET":
			return { ...state, loadingDelete: false, successDelete: false };
			case "SET_CURRENT_PAGE":
				return { ...state, currentPage: action.payload };
			default:
			return state;
	}
};

export default function ProductListScreen() {
	const [
		{
			loading,
			error,
			products,
			loadingCreate,
			loadingDelete,
			successDelete,
			currentPage,
			itemsPerPage,
		},
		dispatch,
	] = useReducer(reducer, {
		loading: true,
		error: "",
		products: [],
		currentPage: 1,
		itemsPerPage: 10,

	});

	const navigate = useNavigate();

	const { state } = useContext(Store);
	const { userInfo } = state;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get("/api/products/admin", {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});

				dispatch({ type: "FETCH_SUCCESS", payload: data });
			} catch (err) {}
		};
		if (successDelete) {
			dispatch({ type: "DELETE_RESET" });
		} else {
			fetchData();
		}
	}, [userInfo, successDelete]);

	const createHandler = async () => {
		try {
			dispatch({ type: "CREATE_REQUEST" });
			const { data } = await axios.post(
				"/api/products",
				{},
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);
			toast.success("Product created successfully");
			dispatch({ type: "CREATE_SUCCESS" });
			navigate(`/admin/product/${data.product._id}`);
		} catch (err) {
			toast.error(getError(error));
			dispatch({
				type: "CREATE_FAIL",
			});
		}
	};

	const deleteConfirmHandler = async (product) => {
		try {
			await axios.delete(`/api/products/${product._id}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` },
			});
			toast.success("product deleted successfully");
			dispatch({ type: "DELETE_SUCCESS" });
		} catch (err) {
			toast.error(getError(error));
			dispatch({
				type: "DELETE_FAIL",
			});
		}
	};

	const deleteHandler = (product) => {
		Swal.fire({
			title: "Atention",
			text: "Are you sure to delete this product?",
			icon: "warning",
			showDenyButton: true,
			denyButtonText: "Cancel",
			confirmButtonText: "Confirm",
		}).then((response) => {
			if (response.isConfirmed) {
				deleteConfirmHandler(product);
			} else {
				return;
			}
		});
	};

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
			<Row>
				<Col>
					<h3>Products</h3>
				</Col>
				<Col className="col text-end">
					<div>
						<Button type="button" onClick={createHandler}>
							Create Product
						</Button>
					</div>
				</Col>
			</Row>

			{loadingCreate && <LoadingBox></LoadingBox>}
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
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{currentItems.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<Button
											type="button"
											variant="light"
											onClick={() => navigate(`/admin/product/${product._id}`)}
										>
											Edit
										</Button>
										&nbsp;
										<Button
											type="button"
											variant="light"
											onClick={() => deleteHandler(product)}
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
	);
}
