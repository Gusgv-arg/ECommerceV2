import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ENDPOINT =
	window.location.host.indexOf("localhost") >= 0
		? "http://127.0.0.1:4000"
		: window.location.host;

export default function ChatBox(props) {
	const { userInfo } = props;
	const [socket, setSocket] = useState(null);
	const uiMessagesRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [messageBody, setMessageBody] = useState("");
	const [messages, setMessages] = useState([
		{ name: "Admin", body: "Hello there, please ask your question." },
	]);

	useEffect(() => {
		if (uiMessagesRef.current) {
			uiMessagesRef.current.scrollBy({
				top: uiMessagesRef.current.clientHeight,
				left: 0,
				behavior: "smooth",
			});
		}
		if (socket) {
			socket.emit("onLogin", {
				_id: userInfo._id,
				name: userInfo.name,
				isAdmin: userInfo.isAdmin,
			});
			socket.on("message", (data) => {
				setMessages([...messages, { body: data.body, name: data.name }]);
			});
		}
	}, [messages, isOpen, socket, userInfo]);

	const supportHandler = () => {
		setIsOpen(true);
		console.log(ENDPOINT);
		const sk = socketIOClient(ENDPOINT);
		setSocket(sk);
	};
	const submitHandler = (e) => {
		e.preventDefault();
		if (!messageBody.trim()) {
			alert("Error. Please type message.");
		} else {
			setMessages([...messages, { body: messageBody, name: userInfo.name }]);
			setMessageBody("");
			setTimeout(() => {
				socket.emit("onMessage", {
					body: messageBody,
					name: userInfo.name,
					isAdmin: userInfo.isAdmin,
					_id: userInfo._id,
				});
			}, 1000);
		}
	};
	const closeHandler = () => {
		setIsOpen(false);
	};
	return (
		<div className="chatbox">
			{!isOpen ? (
				<Button type="button" onClick={supportHandler} variant="info">
					<i className="far fa-comment-dots" />
				</Button>
			) : (
				<div className="card card-body bg-light">
					<Row className="">
						<Col>
							<strong>- Support -</strong>
						</Col>						
					</Row>
					<Row>
						<ul ref={uiMessagesRef}>
							{messages.map((msg, index) => (
								<li key={index}>
									<strong>{`${msg.name}: `}</strong> {msg.body}
								</li>
							))}
						</ul>
					</Row>

					<form onSubmit={submitHandler}>
						<Row>
							<Col sm={8}>
								<input
									value={messageBody}
									onChange={(e) => setMessageBody(e.target.value)}
									type="text"
									placeholder="Type your message..."
								/>
							</Col>
							<Col sm={2}>
								<Button type="submit" variant="secondary">
									Send
								</Button>
							</Col>
							<Col sm={2}>
								<Button type="button" onClick={closeHandler} variant="light">
									<i className="far fa-times-circle" />
								</Button>
							</Col>
						</Row>
					</form>
				</div>
			)}
		</div>
	);
}
