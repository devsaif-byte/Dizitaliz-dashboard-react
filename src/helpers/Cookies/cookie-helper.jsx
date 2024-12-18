import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://sos.digitaliz.com.bd"; // Centralized base URL

// Add cookie
async function addCookie(adminId, service, token, isEditing) {
	const payload = {
		admin_id: adminId,
		service: service, // "Freepik" or "Envato"
		cookies: btoa(await parseCookies(token)), // Encode the cookie to Base64
		// cookies: token, // Encode the cookie to Normal format
	};

	try {
		const response = await axios.post(`${BASE_URL}/api/add-cookie`, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.data.success) {
			if (isEditing) toast.success("Cookie updated!");
			else toast.success("Cookie added successfully!");
			return response.data;
		} else {
			console.error("Failed to add cookie:");
			toast.error("Failed to add cookie:");
			return null;
		}
	} catch (error) {
		console.error(
			"Error adding cookie:",
			error.response?.data || error.message
		);
		return null;
	}
}

// Delete cookie
async function deleteCookie(adminId, cookieId, isEditing) {
	const url = `${BASE_URL}/api/delete-cookie?admin_id=${adminId}&id=${cookieId}`;

	try {
		const response = await axios.get(url);

		if (response.data.success) {
			if (!isEditing) toast.success("Cookie deleted successfully!");
			return response.data;
		} else {
			console.error("Failed to delete cookie:", response.data.reason);
			return null;
		}
	} catch (error) {
		console.error(
			"Error deleting cookie:",
			error.response?.data || error.message
		);
		return null;
	}
}

// List cookies
async function listCookies(adminId, service = null) {
	let url = `${BASE_URL}/api/list-cookie?admin_id=${adminId}`;
	if (service) {
		url += `&service=${service}`;
	}

	try {
		const response = await axios.get(url);

		if (response.data) {
			return response.data;
		} else {
			console.error("Failed to list cookies:", response.data);
			return [];
		}
	} catch (error) {
		console.error(
			"Error listing cookies:",
			error.response?.data || error.message
		);
		return [];
	}
}

const fetchTokens = async (adminId, setTokens) => {
	try {
		const fetchedTokens = await listCookies(adminId);
		setTokens(fetchedTokens);
	} catch (error) {
		console.error("Error fetching tokens:", error);
	}
};

async function parseCookies(cookie) {
	try {
		// Parse the JSON string into an array of objects
		const parsedCookies = JSON.parse(cookie);

		// Initialize an empty string for the resulting cookie string
		let cookieString = "";

		// Iterate through the array
		parsedCookies.forEach(({ name, value }) => {
			if (name && value) {
				// Format each cookie as "name=value; " and append it to the string
				cookieString += `${name}=${value}; `;
			}
		});

		// Remove the trailing "; " if it exists
		if (cookieString.endsWith("; ")) {
			cookieString = cookieString.slice(0, -2);
		}

		return cookieString;
	} catch (error) {
		console.error("Failed to parse cookies:", error);
		throw error;
	}
}

export { fetchTokens, addCookie, deleteCookie, listCookies, parseCookies };
