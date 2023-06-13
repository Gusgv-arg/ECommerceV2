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
		userInfo,
	} = state;

	const updateStockDb = async (item, modStock) => {
		await axios.put(
			`/api/products/customer/${item._id}`,
			{
				_id: item._id,
				stock: modStock,
			},
			{
				headers: { Authorization: `Bearer ${userInfo.token}` },
			}
		);
	};

	const addToCartHandler = async (item) => {
		const existItem = cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${item._id}`);
		if (data.stock < quantity) {
			toast.error("Sorry, we have no more stock of this Product");
			return;
		}
		ctxDispatch({
			type: "CART_ADD_ITEM",
			payload: { ...item, quantity },
		});
		toast.success("Product added successfully!");
		updateStockDb(item, -1);
	};

	return (
		<Card className="h-100">
			<Link to={`/product/${product.slug}`}>
				<img
					src={product.image}
					className="card-img-top img-fluid d-block"
					alt={product.name}
				/>
			</Link>
			<Card.Body className="d-flex flex-column">
				<Link to={`/product/${product.slug}`} className="no-link">
					<Card.Title>{product.name}</Card.Title>
				</Link>
				<Rating rating={product.rating} numReviews={product.numReviews} />
				<Card.Text>${product.price}</Card.Text>
				<div className="mt-auto d-flex flex-column align-items-center">
					{product.stock === 0 ? (
						<Button variant="light" disabled>
							Out of stock
						</Button>
					) : (
						<Button onClick={() => addToCartHandler(product)}>
							Add to cart
						</Button>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}
export default Product;
