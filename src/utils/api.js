import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseUrl: apiURL
});

export default instance;