import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

export default function About() {
	return (
		<Container className="">
			<Row className="align-items-center mt-5">
				<Col md={3}>
					<h4>About this project</h4>
				</Col>
				<Col>
					<p> Hi👋!</p>
					<p>
						I'm Gustavo Gómez Villafañe, full-stack web developer from
						Argentina.
					</p>
					<p>Thank you for entering E-Commerce V2. and testing this site 👍</p>
					<p>
						- Main Functionalities: login, mail notifications, reset password,
						product details, buying products, paypal payment, reviews, filters,
						orders, panel admin 😀
					</p>
					<p>
						- Main Technologies used: React, Bootstrap, CSS, NodeJS, MongoDB 🚀
					</p>
					<p>
						I will continue adding functionalities such as Google
						login, Mercado Pago, Cripto Payments, and more 💪
					</p>
					<p>
						I would like to hear from you and receive your feedaback
						<a href="mailto: gusgvillafane@gmail.com">
							<i className="far fa-envelope mx-3 text-body icons" />
						</a>
					</p>
				</Col>
			</Row>
		</Container>
	);
}
