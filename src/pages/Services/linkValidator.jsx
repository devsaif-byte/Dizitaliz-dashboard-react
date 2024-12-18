import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Label, Alert } from "reactstrap";
import { useAuth } from "../../routes/route";

const LinkValidator = ({ serviceName }) => {
	const [inputLink, setInputLink] = useState("");
	const [isValid, setIsValid] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [cache, setCache] = useState(new Map());
	const cacheRef = useRef(cache); // Use ref to avoid stale state in setInterval

	const { authUserID } = useAuth();

	// useEffect(() => {
	// 	// Cleanup expired links every 1 minute
	// 	const interval = setInterval(() => {
	// 		const now = Date.now();
	// 		const updatedCache = new Map(
	// 			[...cacheRef.current].filter(([, timestamp]) => now - timestamp < 60000)
	// 		);
	// 		setCache(updatedCache);
	// 		cacheRef.current = updatedCache;
	// 	}, 60000);

	// 	return () => clearInterval(interval);
	// }, []);

	const validateLink = (link) => {
		// Service-specific URL patterns
		const servicePatterns = {
			Freepik: /^https?:\/\/(www\.)?freepik\.com\/.+/,
			"Envato Elements": /^https?:\/\/(www\.)?elements\.envato\.com\/.+/,
		};

		if (!servicePatterns[serviceName[0].service]) {
			setErrorMessage("Unsupported service");
			return false;
		}

		if (!servicePatterns[serviceName[0].service].test(link)) {
			setErrorMessage(`Invalid link for ${serviceName[0].service}`);
			return false;
		}

		const now = Date.now();

		// Check if link is in cache
		if (cacheRef.current.has(link)) {
			const timestamp = cacheRef.current.get(link);
			if (now - timestamp < 60000) {
				setErrorMessage("This link has already been used recently.");
				return false;
			}
		}

		// Add link to cache with timestamp
		const updatedCache = new Map(cacheRef.current).set(link, now);
		setCache(updatedCache);
		cacheRef.current = updatedCache;

		return true;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// setIsValid(validateLink(inputLink));
		setIsValid(inputLink);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Label for="linkGen">Paste Link Here:</Label>
				<Input
					id="linkGen"
					type="text"
					value={inputLink}
					onChange={(e) => setInputLink(e.target.value)}
					placeholder={`Paste your ${serviceName.service} link here`}
				/>

				<Button
					className="mt-3"
					type="submit"
					color="success"
					onClick={async (e) => {
						e.preventDefault(); // Prevent form submission behavior
						const inputUrl = document.getElementById("linkGen").value.trim();

						if (!inputUrl) {
							alert("Please enter a valid URL.");
							return;
						}

						try {
							// Call the API to generate the download link
							const response = await axios.post(
								`https://sos.digitaliz.com.bd/api/freepik`,
								{ url: inputUrl, user_id: authUserID },
								{ headers: { "Content-Type": "application/json" } }
							);

							const downloadLink = response.data.result;
							console.log(response);

							if (downloadLink) {
								// Programmatically trigger download
								const a = document.createElement("a");
								a.href = downloadLink;
								a.download = ""; // Optional: Specify filename if needed
								a.target = "_blank";
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a); // Cleanup
							} else {
								alert("Failed to generate download link.");
							}
						} catch (error) {
							console.error("Error generating download link:", error);
							alert("An error occurred while generating the download link.");
						}
					}}
				>
					Generate Link
				</Button>
			</form>
			{isValid === false && errorMessage && (
				<Alert color="danger" className="mt-3">
					{errorMessage}
				</Alert>
			)}
			{isValid && (
				<Alert color="success" className="mt-3">
					Link is valid and ready to download!
				</Alert>
			)}
		</div>
	);
};

export default LinkValidator;
