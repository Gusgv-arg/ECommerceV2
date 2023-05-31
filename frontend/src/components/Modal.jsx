import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function MyModal(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<div className="mb-3">
				<label>
					<input
						className="me-1"
						type="checkbox"
						onClick={handleShow}
						required
					></input>
					{props.input}
				</label>
			</div>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				centered
			>
				<Modal.Header>
					<div className="text-center w-100">
						<Modal.Title>{props.title}</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>{props.text}</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button variant="primary" onClick={handleClose}>
						Accept
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default MyModal;
