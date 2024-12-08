import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { connect } from "react-redux";
import withRouter from "../../Common/withRouter";

// users
import user6 from "../../../assets/images/users/avatar-6.jpg";
import { useAuth } from "../../../routes/route";

const ProfileMenu = (props) => {
	const [menu, setMenu] = useState(false);
	const navigate = useNavigate();

	// Auth context
	const { authUser, logout } = useAuth();
	console.log(authUser?.role);

	// Set username from authUser
	const username = authUser?.email || "Admin";

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<React.Fragment>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="d-inline-block"
			>
				<DropdownToggle
					className="btn header-item"
					id="page-header-user-dropdown"
					tag="button"
				>
					<img
						className="rounded-circle header-profile-user"
						src={user6}
						alt="Header Avatar"
					/>

					<span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
					<i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end">
					{authUser?.role === "Admin" ? (
						<>
							<Link to="/add-cookies">
								<DropdownItem>
									<i className="bx bx-user font-size-16 align-middle me-1" />
									{props.t("Add Cookies")}
								</DropdownItem>
							</Link>
							<Link to="/list-users">
								<DropdownItem>
									<i className="bx bx-list-ul font-size-16 align-middle me-1" />
									{props.t("List of Users")}
								</DropdownItem>
							</Link>
						</>
					) : null}
					<div className="dropdown-divider" />
					<DropdownItem onClick={handleLogout} className="dropdown-item">
						<i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
						<span>{props.t("Logout")}</span>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	);
};

ProfileMenu.propTypes = {
	success: PropTypes.any,
	t: PropTypes.any,
};

const mapStatetoProps = (state) => {
	const { error, success } = state.Profile;
	return { error, success };
};

export default withRouter(
	connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
