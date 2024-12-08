import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../routes/route";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ adminId, children }) => {
	const [subscriptions, setSubscriptions] = useState({
		allSubscriptions: [],
		userSpecificSubscriptions: [],
	});
	const [loading, setLoading] = useState(true);
	const [genLink, setGenLink] = useState("");
	const [remainingTime, setRemainingTime] = useState(0);

	const authContext = useAuth();

	if (!authContext) {
		console.error(
			"AuthContext is not available. Ensure AuthProvider wraps this component."
		);
		return null;
	}

	const { authUser } = authContext;

	// Fetch subscriptions
	useEffect(() => {
		const fetchSubscriptions = async () => {
			if (!adminId || !authUser?.user_id) return;

			setLoading(true);

			try {
				// Fetch admin-level subscriptions
				const [allSubForAdminRes, userSubRes] = await Promise.all([
					axios.get(`https://sos.digitaliz.com.bd/api/all-subscriptions`, {
						params: { admin_id: adminId },
					}),
					axios.get(`https://sos.digitaliz.com.bd/api/get-subscription`, {
						params: { user_id: authUser.user_id },
					}),
				]);

				// Update state with fetched subscriptions
				setSubscriptions({
					allSubscriptions: allSubForAdminRes.data || [],
					userSpecificSubscriptions: userSubRes.data || [],
				});
			} catch (error) {
				console.error("Error fetching subscriptions:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSubscriptions();
	}, [adminId, authUser?.user_id]);

	return (
		<SubscriptionContext.Provider
			value={{
				adminId,
				subscriptions,
				setSubscriptions,
				userSubscription: subscriptions?.userSpecificSubscriptions,
				loading,
				genLink,
				setGenLink,
				remainingTime,
				setRemainingTime,
			}}
		>
			{children}
		</SubscriptionContext.Provider>
	);
};

export const useSubscriptions = () => useContext(SubscriptionContext);
