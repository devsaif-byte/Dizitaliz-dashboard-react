import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

// // Profile
import UserProfile from "../pages/Authentication/user-profile";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import EnvatoElements from "../pages/Services/envato-elements";
import Freepik from "../pages/Services/freepik";

import AddUser from "../pages/AddUser/add-user";
import UserList from "../pages/UserList/user-list";
import Register2 from "../pages/Authentication/Register2";
import Login2 from "../pages/Authentication/Login2";
import AddCookies from "../pages/AddCookies/add-cookies";

const authProtectedRoutes = [
	{ path: "/dashboard", component: <Dashboard /> },
	{ path: "/envato-elements", component: <EnvatoElements /> },
	{ path: "/freepik", component: <Freepik /> },
	//users
	{ path: "/list-users", component: <UserList /> },
	//profile
	{ path: "/add-cookies", component: <AddCookies /> },
	// this route should be at the end of all other routes
	// eslint-disable-next-line react/display-name
	{ path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
	{ path: "/logout", component: <Logout /> },
	{ path: "/login", component: <Login2 /> },
	{ path: "/register", component: <Register2 /> },
];

export { authProtectedRoutes, publicRoutes };
