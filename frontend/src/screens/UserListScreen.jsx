import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils/utils";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
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
				users: action.payload,
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

export default function UserListScreen() {
	const navigate = useNavigate();

	const [
		{
			loading,
			error,
			users,
			loadingDelete,
			successDelete,
			currentPage,
			itemsPerPage,
		},
		dispatch,
	] = useReducer(reducer, {
		loading: true,
		error: "",
		users: [],
		currentPage: 1,
		itemsPerPage: 10,
	});

	const { state } = useContext(Store);
	const { userInfo } = state;

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: "FETCH_REQUEST" });
				const { data } = await axios.get("/api/users", {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
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

	const deleteConfirmHandler = async (user) => {
		try {
			dispatch({ type: "DELETE_REQUEST" });
			await axios.delete(`/api/users/${user._id}`, {
				headers: { Authorization: `Bearer ${userInfo.token}` },
			});
			toast.success("user deleted successfully");
			dispatch({ type: "DELETE_SUCCESS" });
		} catch (error) {
			toast.error(getError(error));
			dispatch({
				type: "DELETE_FAIL",
			});
		}
	};

	const deleteHandler = (user) => {
		Swal.fire({
			title: "Atention",
			text: "Are you sure you want to delete this user?",
			icon: "warning",
			showDenyButton: true,
			denyButtonText: "Cancel",
			confirmButtonText: "Confirm",
		}).then((response) => {
			if (response.isConfirmed) {
				deleteConfirmHandler(user);
			} else {
				return;
			}
		});
	};

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (pageNumber) => {
		const totalPages = Math.ceil(users.length / itemsPerPage);
		const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
		dispatch({ type: "SET_CURRENT_PAGE", payload: validPageNumber });
	};

	return (
		<div>
			<Helmet>
				<title>Users</title>
			</Helmet>
			<h3>Users</h3>
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
								<th>EMAIL</th>
								<th>IS ADMIN</th>
								<th>ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{currentItems.map((user) => (
								<tr key={user._id}>
									<td>{user._id}</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.isAdmin ? "YES" : "NO"}</td>
									<td>
										<Button
											type="button"
											variant="light"
											onClick={() => navigate(`/admin/user/${user._id}`)}
										>
											Edit
										</Button>
										&nbsp;
										<Button
											type="button"
											variant="light"
											onClick={() => deleteHandler(user)}
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
							disabled={indexOfLastItem >= users.length}
						/>
						<Pagination.Last
							onClick={() =>
								handlePageChange(Math.ceil(users.length / itemsPerPage))
							}
						/>
					</Pagination>
				</>
			)}
		</div>
	);
}
