import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import HttpClient from './utils/functions/HttpClient'
import KeycloakService from "./components/config/KeycloakService";
import LoadingSpinnerProvider from './utils/components/LoadingSpinnerProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () =>
	root.render(
		<LoadingSpinnerProvider>
			<App />
		</LoadingSpinnerProvider>
	);;

KeycloakService.initKeycloak(renderApp);
HttpClient.configure();
