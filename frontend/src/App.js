import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Button from "react-bootstrap/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import Footer from "./components/Footer";
import About from "./screens/About";
import { useAuth0 } from "@auth0/auth0-react";
import MapScreen from "./screens/MapScreen";
import SupportScreen from "./components/SupportScreen";
import ChatBox from "./components/ChatBox";

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { fullBox, cart, userInfo } = state;

	const { logout, user, isAuthenticated } = useAuth0();

	const updateStockDb = async (item, modStock) => {
		await axios.put(
			`/api/products/customer/${item}`,
			{
				_id: item,
				stock: modStock,
			},
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
		return;
	};

	const signoutHandler = () => {
		ctxDispatch({ type: "USER_SIGNOUT" });
		localStorage.removeItem("userInfo");
		localStorage.removeItem("shippingAddress");
		localStorage.removeItem("paymentMethod");
		cart.cartItems &&
			cart.cartItems.map((item) => updateStockDb(item._id, item.quantity));
		localStorage.removeItem("cartItems");
		if (isAuthenticated) {
			logout();
		}
		window.location.href = "/signin";
	};

	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await axios.get(`/api/products/categories`);
				setCategories(data);
			} catch (err) {
				toast.error(getError(err));
			}
		};

		if (sidebarIsOpen) {
			fetchCategories();
		}

		const signupGoogle = async (user) => {
			try {
				const { data } = await axios.post("api/users/signup", {
					name: user.name,
					email: user.email,
					password: user.email,
				});
				ctxDispatch({ type: "USER_SIGNIN", payload: data });
				localStorage.setItem("userInfo", JSON.stringify(data));
			} catch (err) {
				toast.error(getError(err));
			}
		};

		const signinGoogle = async (user) => {
			try {
				const { data } = await axios.post("/api/users/signin", {
					email: user.email,
					password: user.email,
				});
				ctxDispatch({ type: "USER_SIGNIN", payload: data });
				localStorage.setItem("userInfo", JSON.stringify(data));
			} catch (err) {
				signupGoogle(user);
			}
		};
		if (isAuthenticated) {
			signinGoogle(user);
		}
	}, [sidebarIsOpen, isAuthenticated, user, ctxDispatch]);

	return (
		<BrowserRouter>
			<div
				className={
					sidebarIsOpen
						? fullBox
							? "site-container active-cont d-flex flex-column full-box"
							: "site-container active-cont d-flex flex-column"
						: fullBox
						? "site-container d-flex flex-column full-box"
						: "site-container d-flex flex-column"
				}
			>
				<ToastContainer position="bottom-center" limit={1} />

				<header>
					<Navbar bg="dark" variant="dark" expand="lg" fixed="top">
						<Container>
							<Button
								variant="dark"
								onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
							>
								<i className="fas fa-bars"></i>
							</Button>
							<LinkContainer to="/">
								<Navbar.Brand>E-Commerce V2.</Navbar.Brand>
							</LinkContainer>

							<Navbar.Toggle aria-controls="basic-navbar-nav" />

							<Navbar.Collapse
								id="basic-navbar-nav"
								className="d-flex justify-content-evenly"
							>
								<SearchBox></SearchBox>

								<Nav className="">
									<Link to="/cart" className="nav-link">
										<i className="fa fa-shopping-cart" />{" "}
										{cart.cartItems.length > 0 && (
											<Badge pill bg="danger">
												{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
											</Badge>
										)}
									</Link>
									{userInfo ? (
										<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>User Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>Order History</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<Link
												className="dropdown-item"
												to="#signout"
												onClick={signoutHandler}
											>
												Sign Out
											</Link>
										</NavDropdown>
									) : (
										<Link className="nav-link" to="/signin">
											Sign In
										</Link>
									)}
									{userInfo && userInfo.isAdmin && (
										<NavDropdown title="Admin" id="admin-nav-dropdown">
											<LinkContainer to="/admin/dashboard">
												<NavDropdown.Item>Dashboard</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/products">
												<NavDropdown.Item>Products</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/orders">
												<NavDropdown.Item>Orders</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/users">
												<NavDropdown.Item>Users</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/support">
												<NavDropdown.Item>Support</NavDropdown.Item>
											</LinkContainer>
										</NavDropdown>
									)}
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</header>
				<div
					className={
						sidebarIsOpen
							? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column my-5"
							: "side-navbar d-flex justify-content-between flex-wrap flex-column"
					}
				>
					<Nav className="flex-column text-white w-100 p-2">
						<Nav.Item>
							<strong>Categories</strong>
						</Nav.Item>
						{categories.map((category) => (
							<Nav.Item key={category}>
								<LinkContainer
									/* to={`/search?category=${category}`} React V17 */
									to={{ pathname: "/search", search: `category=${category}` }}
									onClick={() => setSidebarIsOpen(false)}
								>
									<Nav.Link>{category}</Nav.Link>
								</LinkContainer>
							</Nav.Item>
						))}
					</Nav>
				</div>
				<main>
					<Container className="my-5 nav-margin">
						<Routes>
							<Route path="/product/:slug" element={<ProductScreen />} />
							<Route path="/cart" element={<CartScreen />} />
							<Route path="/signin" element={<SigninScreen />} />
							<Route path="/signup" element={<SignupScreen />} />
							<Route path="/about" element={<About />} />
							<Route
								path="/forget-password"
								element={<ForgetPasswordScreen />}
							/>
							<Route
								path="/reset-password/:token"
								element={<ResetPasswordScreen />}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<ProfileScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/map"
								element={
									<ProtectedRoute>
										<MapScreen />
									</ProtectedRoute>
								}
							/>
							<Route path="/search" element={<SearchScreen />} />
							<Route
								path="/shipping"
								element={<ShippingAddressScreen />}
							></Route>
							<Route path="/payment" element={<PaymentMethodScreen />}></Route>
							<Route path="/placeorder" element={<PlaceOrderScreen />} />
							<Route
								path="/order/:id"
								element={
									<ProtectedRoute>
										<OrderScreen />
									</ProtectedRoute>
								}
							></Route>
							<Route
								path="/orderhistory"
								element={
									<ProtectedRoute>
										<OrderHistoryScreen />
									</ProtectedRoute>
								}
							></Route>
							{/* Admin Routes */}
							<Route
								path="/admin/dashboard"
								element={
									<AdminRoute>
										<DashboardScreen />
									</AdminRoute>
								}
							></Route>
							<Route
								path="/admin/support"
								element={
									<AdminRoute>
										<SupportScreen />
									</AdminRoute>
								}
							></Route>

							<Route
								path="/admin/products"
								element={
									<AdminRoute>
										<ProductListScreen />
									</AdminRoute>
								}
							></Route>
							<Route
								path="/admin/product/:id"
								element={
									<AdminRoute>
										<ProductEditScreen />
									</AdminRoute>
								}
							></Route>
							<Route
								path="/admin/orders"
								element={
									<AdminRoute>
										<OrderListScreen />
									</AdminRoute>
								}
							></Route>
							<Route
								path="/admin/users"
								element={
									<AdminRoute>
										<UserListScreen />
									</AdminRoute>
								}
							></Route>
							<Route
								path="/admin/user/:id"
								element={
									<AdminRoute>
										<UserEditScreen />
									</AdminRoute>
								}
							></Route>
							<Route path="/" element={<HomeScreen />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div>
						<div className="row center"></div>
						<div className="text-center">
							{userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
							<Footer />
						</div>
					</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}
export default App;
