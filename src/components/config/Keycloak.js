import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  //url: "http://localhost:8080",
  url: "https://keycloak-server-for-demo.azurewebsites.net/auth/",
  realm: "EventVenueDemo",
  clientId: "event-venue-ui-demo",
});

export default keycloak;
