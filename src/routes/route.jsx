import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import Spinners from "../components/Common/Spinner";

// Create Auth Context
const AuthContext = createContext();

// Custom hook for consuming the context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [authUserID, setAuthUserID] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch user data based on sessionStorage
	useEffect(() => {
		const storedUserID = sessionStorage.getItem("authUserID");
		if (storedUserID) {
			axios
				.get(
					`https://sos.digitaliz.com.bd/api/get-user?user_id=${storedUserID}`
				)
				.then((res) => {
					setAuthUser(res.data);
					setAuthUserID(storedUserID);
				})
				.catch((err) => console.error("Failed to fetch user:", err))
				.finally(() => setLoading(false));
		} else {
			setLoading(false); // No user is logged in
		}
	}, []);

	// Login function
	const login = async (userID) => {
		try {
			const res = await axios.get(
				`https://sos.digitaliz.com.bd/api/get-user?user_id=${userID}`
			);
			setAuthUser(res.data);
			setAuthUserID(userID);
			sessionStorage.setItem("authUserID", userID);
		} catch (err) {
			console.error("Login failed:", err);
			logout();
		}
	};

	// Logout function
	const logout = () => {
		setAuthUser(null);
		setAuthUserID(null);
		sessionStorage.removeItem("authUserID");
	};

	if (loading) return <Spinners setLoading={setLoading} />; // Loader while fetching user data

	return (
		<AuthContext.Provider
			value={{ authUserID, authUser, login, logout, loading }}
		>
			{authUserID ? (
				<SubscriptionProvider adminId={authUserID}>
					{children}
				</SubscriptionProvider>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
};
