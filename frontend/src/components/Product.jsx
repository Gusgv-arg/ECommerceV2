import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";

function Product(props) {
	const { product } = props;

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const {
		cart: { cartItems },
	} = state;

	const addToCartHandler = async (item) => {
		const existItem = cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.stock < quantity) {
			toast.error("Sorry, we have no more stock of this Product")
			return;
		}
		ctxDispatch({
			type: "CART_ADD_ITEM",
			payload: { ...item, quantity },
		});
		toast.success("Product added successfully!")
	};

	return (
		<Card>
			<Link to={`/product/${product.slug}`}>
				<img src={product.image} className="card-img-top" alt={product.name} />
			</Link>
			<Card.Body>
				<Link to={`/product/${product.slug}`} className="no-link">
					<Card.Title>{product.name}</Card.Title>
				</Link>
				<Rating rating={product.rating} numReviews={product.numReviews} />
				<Card.Text>${product.price}</Card.Text>
				{product.stock === 0 ? (
					<Button variant="light" disabled>
						Out of stock
					</Button>
				) : (
					<Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
				)}
			</Card.Body>
		</Card>
	);
}
export default Product;