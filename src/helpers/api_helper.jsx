// import axios from "axios";
// import accessToken from "./jwt-token-access/accessToken";

// //pass new generated access token here
// const token = accessToken;

// //apply base url for axios
// const API_URL = "http://157.245.110.29:3000";

// const axiosApi = axios.create({
//   baseURL: API_URL,
// });

// axiosApi.defaults.headers.common["Authorization"] = token;

// axiosApi.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

// export async function get(url, config = {}) {
//   return await axiosApi
//     .get(url, { ...config })
//     .then((response) => response.data);
// }

// export async function post(url, data, config = {}) {
//   return axiosApi
//     .post(url, { ...data }, { ...config })
//     .then((response) => response.data);
// }
import axios from "axios";

// Axios instance with JSON content type
const api = axios.create({
	baseURL: "http://157.245.110.29:3000", // Replace with your base URL
	// timeout: 5000,
	headers: {
		"Content-Type": "application/json", // Ensure JSON content type
	},
});

// Helper for GET request
export const get = async (url, params = {}) => {
	try {
		const response = await api.get(url, { params });
		return response.data;
	} catch (error) {
		console.error(`GET ${url} failed:`, error);
		throw error;
	}
};

// Helper for POST request
export const post = async (url, data = {}) => {
	try {
		const response = await api.post(url, data);
		return response.data;
	} catch (error) {
		console.error(`POST ${url} failed:`, error);
		throw error;
	}
};

// Helper for DELETE request
export const del = async (url, config = {}) => {
	try {
		const response = await api.delete(url, { ...config });
		return response.data;
	} catch (error) {
		console.error(`DELETE ${url} failed:`, error);
		throw error;
	}
};
