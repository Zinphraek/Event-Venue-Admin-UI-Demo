import axios from "axios";
import KeycloakService from "../../components/config/KeycloakService";
import { ROOT_API_URL } from "../constants/ServerEndpoints";

const _axios = axios.create();

const configure = () => {
  _axios.interceptors.request.use((config) => {
    if (KeycloakService.isLoggedIn()) {
      const cb = () => {
        config.baseURL = ROOT_API_URL;
        config.headers.Authorization = `Bearer ${KeycloakService.getToken()}`;
        config.headers["Content-Type"] = "multipart/form-data";
        return Promise.resolve(config);
      };
      return KeycloakService.updateToken(cb);
    }
  });
};

const getAxiosClient = () => _axios;

const HttpClient = {
  configure,
  getAxiosClient,
};

export default HttpClient;
