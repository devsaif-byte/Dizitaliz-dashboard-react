import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import { AuthProvider, useAuth } from "./routes/route";
import Authmiddleware from "./middlewares/Authmiddleware";
// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

const App = (props) => {
	const selectLayoutState = (state) => state.Layout;
	const LayoutProperties = createSelector(selectLayoutState, (layout) => ({
		layoutType: layout.layoutType,
	}));

	const { layoutType } = useSelector(LayoutProperties);

	function getLayout(layoutType) {
		let layoutCls = VerticalLayout;
		switch (layoutType) {
			case "horizontal":
				layoutCls = HorizontalLayout;
				break;
			default:
				layoutCls = VerticalLayout;
				break;
		}
		return layoutCls;
	}

	// const Layout = getLayout(layoutType);
	const Layout = useMemo(() => getLayout(layoutType), [layoutType]);

	return (
		<React.Fragment>
			<Routes>
				{publicRoutes.map((route, idx) => (
					<Route
						path={route.path}
						element={<NonAuthLayout>{route.component}</NonAuthLayout>}
						key={idx}
						exact={true}
					/>
				))}
				{authProtectedRoutes.map((route, idx) => {
					return (
						<Route
							path={route.path}
							element={
								<AuthProvider>
									<Authmiddleware>
										<Layout>{route.component}</Layout>
									</Authmiddleware>
								</AuthProvider>
							}
							key={idx}
							exact={true}
						/>
					);
				})}
			</Routes>
		</React.Fragment>
	);
};

App.propTypes = {
	layout: PropTypes.any,
};

const mapStateToProps = (state) => {
	return {
		layout: state.Layout,
	};
};

export default connect(mapStateToProps, null)(App);
