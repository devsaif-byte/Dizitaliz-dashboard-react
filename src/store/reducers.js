import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
<<<<<<< HEAD

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
=======
//contacts
import contacts from "./contacts/reducer";
import tokenReducer from "./cookieToken/reducer";
const rootReducer = combineReducers({
	// public
	Layout,
	Login,
	Account,
	ForgetPassword,
	Profile,
	contacts,
	cookies: tokenReducer,
>>>>>>> master
});

export default rootReducer;
