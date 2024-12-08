import React, { useEffect, useMemo, useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Alert,
	CardBody,
	Button,
	Spinner,
} from "reactstrap";

import Breadcrumb from "../../components/Common/Breadcrumb";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import axios from "axios";
import LinkValidator from "./linkValidator";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/route";
import { useSelector } from "react-redux";

const FreePik = () => {
	document.title = "Freepik | Digitaliz";

	const { userSubscription, loading, genLink, setGenLink, setRemainingTime } =
		useSubscriptions();

	// Directly fetch cookies from Redux at the root level
	const cookies = useSelector((state) => state.cookies.tokens);

	// Memoize cookies for better performance
	const adminCookies = useMemo(() => {
		return cookies ? cookies.map((c) => c) : [];
	}, [cookies]);

	console.log(adminCookies);

	const { authUser } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	// Navigate to add-cookies if Admin role and visiting /freepik
	useEffect(() => {
		if (authUser?.role === "Admin" && location.pathname === "/freepik") {
			navigate("/add-cookies");
		}
	}, [authUser, location.pathname, navigate]);

	// Countdown for link expiry
	useEffect(() => {
		if (genLink) {
			setRemainingTime(60); // Start 60-second countdown
			const interval = setInterval(() => {
				setRemainingTime((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval); // Cleanup on unmount
		}
	}, [genLink, setRemainingTime]);

	// Check for active subscription
	const isActive = userSubscription?.service_end_date
		? new Date(userSubscription.service_end_date) > new Date()
		: false;

	// Memoize the Freepik subscription for efficiency
	const freepikSubscription = useMemo(() => {
		return userSubscription?.find((sub) => sub.service === "Freepik");
	}, [userSubscription]);

	console.log(freepikSubscription);

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid>
					<Breadcrumb title="Service" breadcrumbItem="Freepik" />

					<Button
						type="button"
						color={isActive ? "success" : "danger"}
						disabled
					>
						Service Status: {isActive ? "Running" : "Inactive"}
					</Button>

					{loading ? (
						<Spinner />
					) : freepikSubscription ? (
						activePackageInterface(
							genLink,
							userSubscription,
							freepikSubscription,
							adminCookies
						)
					) : (
						deActivePackageInterface()
					)}
				</Container>
			</div>
		</React.Fragment>
	);
};

export default FreePik;

export const activePackageInterface = (
	onSubmitDownload,
	serviceName,
	adminCookies
) => {
	const { adminId, userSubscription, genLink } = useSubscriptions();

	console.log("Admin_Id:", adminId, "UserSubs:", userSubscription);

	// Calculate time difference
	const calculateTimeDifference = (endDate) => {
		const currentDate = new Date();
		const endDateObj = new Date(endDate);

		const timeDiff = endDateObj - currentDate; // Difference in milliseconds
		if (timeDiff <= 0) return "Expired";

		const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
		const weeks = Math.floor(days / 7); // Convert days to weeks
		const remainingDays = days % 7; // Get remaining days after weeks

		return `${weeks > 0 ? `${weeks} week${weeks > 1 ? "s" : ""} ` : ""}${
			remainingDays > 0
				? `${remainingDays} day${remainingDays > 1 ? "s" : ""}`
				: ""
		} after`;
	};

	const formattedEndDate = calculateTimeDifference(
		serviceName[0]?.service_end_date
	);

	// Handle download link generation
	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerateLink = async (link) => {
		if (isGenerating) return; // Prevent multiple requests
		setIsGenerating(true);

		// Use the cookies directly from props
		const cookies = adminCookies;
		console.log(cookies);

		try {
			const response = await axios.post(
				`https://sos.digitaliz.com.bd/api/${serviceName.toLowerCase()}`,
				{ url: link, cookies: "" },
				{ headers: { "Content-Type": "application/json" } }
			);

			const downloadLink = response.data.result;

			if (downloadLink) {
				const a = document.createElement("a");
				a.href = downloadLink;
				a.target = "_blank";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			} else {
				alert("Failed to generate download link.");
			}
		} catch (error) {
			console.error("Error generating download link:", error);
			alert("Error occurred while generating the download link.");
		} finally {
			setIsGenerating(false);
		}
	};

	// 	console.log(service);

	// 	try {
	// 		const response = await axios.post(
	// 			`https://sos.digitaliz.com.bd/api/${serviceName.toLowerCase()}`, // Use service name dynamically
	// 			{ url: link },
	// 			{ headers: { "Content-Type": "application/json" } }
	// 		);

	// 		const downloadLink = response.data.result;

	// 		if (downloadLink) {
	// 			// Programmatically trigger download
	// 			const a = document.createElement("a");
	// 			a.href = downloadLink;
	// 			a.download = ""; // Optional: Specify filename if needed
	// 			a.target = "_blank";
	// 			document.body.appendChild(a);
	// 			a.click();
	// 			document.body.removeChild(a); // Cleanup
	// 		} else {
	// 			alert("Failed to generate download link.");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error generating download link:", error);
	// 		alert("An error occurred while generating the download link.");
	// 	}
	// };

	return (
		<Row>
			<Col lg="12">
				<div className="d-flex flex-column flex-md-row gap-3 d-flex my-3">
					<Card color="primary" className="text-white">
						<CardBody>
							<h1>{serviceName[0]?.remaining_daily_downloads}</h1>
							<h3>Remaining Daily Downloads</h3>
						</CardBody>
					</Card>
					<Card color="success" className="text-white">
						<CardBody>
							<h1>{formattedEndDate}</h1>
							<h3>Service End Date</h3>
						</CardBody>
					</Card>
					<Card color="warning" className="text-white">
						<CardBody>
							<h1>
								{serviceName[0]?.total_file_downloads}/
								{serviceName[0]?.total_download_limits}
							</h1>
							<h3>Total Download Limit</h3>
						</CardBody>
					</Card>
					<Card color="primary" className="text-white">
						<CardBody>
							<h1>{serviceName[0]?.total_file_downloads}</h1>
							<h3>Total Downloaded Files</h3>
						</CardBody>
					</Card>
				</div>
				<Card className="mt-3">
					<CardBody>
						<Alert color="warning">
							<h4 className="alert-heading">Attention!</h4>
							<p>
								Download links are valid for 1 minute. After that, the link will
								expire.
							</p>
						</Alert>

						{/* Link Validator Component */}
						<LinkValidator
							serviceName={serviceName} // Pass the current service name
							onValidate={(validatedLink) => handleGenerateLink(validatedLink)}
						/>

						{genLink && (
							<div className="mt-3">
								<p className="mt-2 text-warning">
									This link will expire in {remainingTime} seconds.
								</p>
							</div>
						)}
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export const deActivePackageInterface = () => {
	return (
		<Row>
			<Col lg="12">
				{/* {error && error ? <Alert color="danger">{error}</Alert> : null}
				{success ? <Alert color="success">{success}</Alert> : null} */}

				<Card className="mt-3">
					<CardBody>
						<div className="d-flex">
							<div>
								<h2 className="my-3">
									You've reached your download limit, or you don't have any
									active services!
								</h2>
								<p className="mb-5">
									To activate the service, apply your license in Activate
									button. To purchase the service click on Buy Now button or get
									instant delivery click on Buy with bKash button.
								</p>
								<div className="d-flex gap-3">
									<Button type="button" color="warning">
										Activate
									</Button>
									<Button type="button" color="primary">
										Buy with Bkash
									</Button>
									<Button type="button" color="danger">
										Buy now
									</Button>
									<Button type="button" color="secondary">
										Tutorial video
									</Button>
								</div>
								<p className="mt-5">
									Noted: bKash instant delivery method is available for
									Bangladeshi users only.
								</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};
