import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div className="d-flex justify-content-around bg-secondary p-3 text-light">
			<div className="">
				<h6>Developed by: Gustavo Gomez Villafañe</h6>
				<a href="http://linkedin.com/in/gustavo-gomez-villafañe-6164526" target="_blank" rel="noreferrer">
					<i className="fab fa-linkedin mx-3 text-light icons" />
				</a>
                <a href="https://wa.me/5491161405589" target="_blank" rel="noreferrer">
                    	<i className="fab fa-whatsapp mx-3 text-light icons" />
                </a>
                <a href="mailto: gusgvillafane@gmail.com">
                    <i className="far fa-envelope mx-3 text-light icons"/>
                </a>
                <a href="https://discord.com/accessibility/#0958" target="_blank" rel="noreferrer">
                    <i className="fab fa-discord mx-3 text-light icons"/>
                </a>
			</div>
			<div name="" className="d-flex flex-column">
				<Link to="/" name="" className="text-decoration-none text-light icons">
					Home
				</Link>				
				<Link to="/about" name="" className="text-decoration-none text-light icons">
					About
				</Link>
			</div>
			<div name="">
				<h6>¡Follow us on our social networks!</h6>
				<i className="fab fa-facebook mx-3"/>
				<i className="fab fa-instagram mx-3"/>
				<i className="fab fa-twitter mx-3"/>				
			</div>
		</div>
	);
};

export default Footer;
