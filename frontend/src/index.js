import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

//ReactV18
const root = createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			redirect_uri={window.location.origin}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
		>
			<StoreProvider>
				<HelmetProvider>
					<PayPalScriptProvider deferLoading={true}>
						<App />
					</PayPalScriptProvider>
				</HelmetProvider>
			</StoreProvider>
		</Auth0Provider>
	</React.StrictMode>
);

reportWebVitals();
