// export default withRouter(EnvatoElements);
import React, { useEffect, useMemo } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";

// Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";
import { activePackageInterface, deActivePackageInterface } from "./freepik";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/route";

const EnvatoElements = () => {
	// Set document title
	document.title = "Envato Elements | Digitaliz";

	// Access subscriptions via context
	const { userSubscription, loading, genLink, setRemainingTime } =
		useSubscriptions();

	const { authUser } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		if (authUser?.role === "Admin" && location.pathname === "/envato-elements")
			navigate("/add-cookies");
	}, [location.pathname]);
	// Countdown timer for download link expiration
	useEffect(() => {
		if (genLink) {
			setRemainingTime(60); // Start a 60-second countdown
			const interval = setInterval(() => {
				setRemainingTime((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0; // Reset timer
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(interval); // Cleanup on unmount or genLink change
		}
	}, [genLink, setRemainingTime]);

	// Determine if the user has an active subscription
	const isActive = userSubscription?.service_end_date
		? new Date(userSubscription.service_end_date) > new Date()
		: false;

	// Filter the subscription for Envato
	// const envatoSubscription = useMemo(
	// 	() => userSubscription.filter((sub) => sub.service === "Envato Elements"),
	// 	[]
	// );
	const envatoSubscription = useMemo(
		() => userSubscription.find((sub) => sub.service === "Envato Elements"),
		[userSubscription]
	);

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumb title="Service" breadcrumbItem="Envato Elements" />

					{/* Display service status */}
					<Button
						type="button"
						color={isActive ? "success" : "danger"}
						disabled
					>
						Service Status: {isActive ? "Running" : "Inactive"}
					</Button>

					{/* Render based on subscription status */}
					{loading ? (
						<Spinner />
					) : envatoSubscription ? (
						activePackageInterface(
							genLink,
							userSubscription,
							envatoSubscription
						)
					) : (
						deActivePackageInterface()
					)}
				</Container>
			</div>
		</React.Fragment>
	);
};

export default EnvatoElements;
