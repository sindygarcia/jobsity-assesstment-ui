import axios from 'axios';
const APP_PORT = "8000"
const APP_URL = "http://localhost:";

export default () => {
    return axios.create({
        baseURL: APP_URL + APP_PORT,
        headers: {
            'Authorization': localStorage["authToken"]
        }
    })
};

