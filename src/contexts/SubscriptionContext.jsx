// import React, {
// 	createContext,
// 	useContext,
// 	useState,
// 	useEffect,
// 	useMemo,
// } from "react";
// import axios from "axios";
// import { useAuth } from "../routes/route";

// const SubscriptionContext = createContext();

// export const SubscriptionProvider = ({ adminId, children }) => {
// 	const [subscriptions, setSubscriptions] = useState({
// 		allSubscriptions: [],
// 		userSpecificSubscriptions: [],
// 	});
// 	const [loading, setLoading] = useState(true);
// 	const [genLink, setGenLink] = useState("");
// 	const [remainingTime, setRemainingTime] = useState(0);

// 	const authContext = useAuth();
// 	const { authUser } = authContext || {};

// 	// Fetch subscriptions only when `authUser` is available
// 	useEffect(() => {
// 		const fetchSubscriptions = async () => {
// 			if (!authUser?.user_id || !adminId) {
// 				setLoading(false);
// 				return;
// 			}

// 			setLoading(true);

// 			try {
// 				const [allSubForAdminRes, userSubRes] = await Promise.all([
// 					axios.get(`https://sos.digitaliz.com.bd/api/all-subscriptions`, {
// 						params: { admin_id: adminId },
// 					}),
// 					axios.get(`https://sos.digitaliz.com.bd/api/get-subscription`, {
// 						params: { user_id: authUser.user_id },
// 					}),
// 				]);

// 				setSubscriptions({
// 					allSubscriptions: allSubForAdminRes.data || [],
// 					userSpecificSubscriptions: userSubRes.data || [],
// 				});
// 			} catch (error) {
// 				console.error("Error fetching subscriptions:", error);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		if (authUser) fetchSubscriptions();
// 		else return;
// 	}, [adminId, authUser]);

// 	// Memoize the context value
// 	const providerValue = useMemo(
// 		() => ({
// 			adminId,
// 			subscriptions,
// 			setSubscriptions,
// 			userSubscription: subscriptions?.userSpecificSubscriptions || [],
// 			loading,
// 			genLink,
// 			setGenLink,
// 			remainingTime,
// 			setRemainingTime,
// 		}),
// 		[adminId, subscriptions, loading, genLink, remainingTime]
// 	);

// 	return (
// 		<SubscriptionContext.Provider value={providerValue}>
// 			{children}
// 		</SubscriptionContext.Provider>
// 	);
// };

// export const useSubscriptions = () => useContext(SubscriptionContext);
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
} from "react";
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
	const { authUser } = authContext || {};

	// Fetch subscriptions only when `authUser` is available
	useEffect(() => {
		const fetchSubscriptions = async () => {
			if (!authUser?.user_id || !adminId) {
				setLoading(false); // Set loading to false if user_id or adminId is not available
				return;
			}

			setLoading(true);

			try {
				const [allSubForAdminRes, userSubRes] = await Promise.all([
					axios.get(`https://sos.digitaliz.com.bd/api/all-subscriptions`, {
						params: { admin_id: adminId },
					}),
					axios.get(`https://sos.digitaliz.com.bd/api/get-subscription`, {
						params: { user_id: authUser.user_id },
					}),
				]);

				setSubscriptions({
					allSubscriptions: allSubForAdminRes.data || [],
					userSpecificSubscriptions: userSubRes.data || [],
				});
			} catch (error) {
				console.error("Error fetching subscriptions:", error);
			} finally {
				setLoading(false); // Ensure loading is set to false after fetching
			}
		};

		fetchSubscriptions();
	}, [adminId, authUser]); // Dependencies include adminId and authUser

	// Memoize the context value
	const providerValue = useMemo(
		() => ({
			adminId,
			subscriptions,
			setSubscriptions,
			userSubscription: subscriptions?.userSpecificSubscriptions || [],
			loading,
			genLink,
			setGenLink,
			remainingTime,
			setRemainingTime,
		}),
		[adminId, subscriptions, loading, genLink, remainingTime]
	);

	return (
		<SubscriptionContext.Provider value={providerValue}>
			{children}
		</SubscriptionContext.Provider>
	);
};

export const useSubscriptions = () => useContext(SubscriptionContext || {});
