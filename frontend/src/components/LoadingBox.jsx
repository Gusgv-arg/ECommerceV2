import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function LoadingBox() {
	return (
		<Container>
			<Spinner animation="border" role="status" variant="primary">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</Container>
	);
}
