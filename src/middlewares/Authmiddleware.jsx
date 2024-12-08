import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const Authmiddleware = ({ children }) => {
	const location = useLocation();

	const isAuthenticated = Boolean(localStorage.getItem("authUserID"));

	if (!isAuthenticated) {
		console.warn("User is not authenticated. Redirecting to login.");
		return <Navigate to="/login" state={{ from: location }} />;
	}

	return children;
};

export default Authmiddleware;
