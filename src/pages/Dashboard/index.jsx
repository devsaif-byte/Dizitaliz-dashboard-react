import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

import Subscriptions from "../../components/Common/Subscriptions";
import { SubscriptionProvider } from "../../contexts/SubscriptionContext";
import _ from "lodash";

const Dashboard = (props) => {
	const [storedUserID, setStoredUserID] = useState(null);
	//meta title
	document.title = "Dashboard | Digitaliz";
	useEffect(() => {
		setStoredUserID(localStorage.getItem("authUserID"));
	}, []);

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={props.t("Dashboards")}
						breadcrumbItem={props.t("Dashboard")}
					/>
					<SubscriptionProvider adminId={storedUserID}>
						<Subscriptions />
					</SubscriptionProvider>
				</Container>
			</div>
		</React.Fragment>
	);
};

Dashboard.propTypes = {
	t: PropTypes.any,
	chartsData: PropTypes.any,
	onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
