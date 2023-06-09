import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils/utils";
import { useAuth0 } from "@auth0/auth0-react";

export default function SigninScreen() {
	const navigate = useNavigate();
	const { search } = useLocation();

	const { loginWithRedirect } = useAuth0();

	const redirectInUrl = new URLSearchParams(search).get("redirect");
	const redirect = redirectInUrl ? redirectInUrl : "/";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const { data } = await Axios.post("/api/users/signin", {
				email,
				password,
			});
			ctxDispatch({ type: "USER_SIGNIN", payload: data });
			localStorage.setItem("userInfo", JSON.stringify(data));
			navigate(redirect || "/");
		} catch (err) {
			toast.error(getError(err));
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign In</title>
			</Helmet>
			<h3 className="my-4">Sign in</h3>
			<div className="mb-3">
				<Button type="submit" className="" onClick={() => loginWithRedirect()}>
					Sign In or Create Account with{" "}
					<i className="fab fa-google mx-1 text-dark icons" />
					oogle
				</Button>
			</div>
			<p className="mb-3 text-bold">----- Or with Email and Password -----</p>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Sign In</Button>
				</div>
				<div className="mb-3">
					New customer?{" "}
					<Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
				</div>
				<div className="mb-3">
					Forgot Password? <Link to={`/forget-password`}>Reset Password</Link>
				</div>
			</Form>
		</Container>
	);
}
