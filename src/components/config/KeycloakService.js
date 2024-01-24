import keycloak from "./Keycloak";

const _kc = keycloak;

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc
    .init({
      onLoad: "login-required",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const updateToken = (successCallback) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getUserFirstName = () => _kc.tokenParsed?.given_name;

const getUserLasttName = () => _kc.tokenParsed?.family_name;

const getUserFullName = () => _kc.tokenParsed?.name;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const KeycloakService = {
	initKeycloak,
	doLogin,
	doLogout,
	isLoggedIn,
	getToken,
	updateToken,
	getUsername,
	getUserFirstName,
	getUserLasttName,
	getUserFullName,
	hasRole,
};

export default KeycloakService;
