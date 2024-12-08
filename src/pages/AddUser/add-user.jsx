import React, { useState } from "react";

import { Card, CardBody, Col, Row, CardTitle, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddUser = () => {
	//meta title
	document.title = "Edit User | Digitaliz";

	const [customchkPrimary, setcustomchkPrimary] = useState(true);
	const [customchkSuccess, setcustomchkSuccess] = useState(true);
	const [customchkInfo, setcustomchkInfo] = useState(true);
	const [customchkWarning, setcustomchkWarning] = useState(true);
	const [customchkDanger, setcustomchkDanger] = useState(true);
	const [customOutlinePrimary, setcustomOutlinePrimary] = useState(true);
	const [customOutlineSuccess, setcustomOutlineSuccess] = useState(true);
	const [customOutlineInfo, setcustomOutlineInfo] = useState(true);
	const [customOutlineWarning, setcustomOutlineWarning] = useState(true);
	const [customOutlineDanger, setcustomOutlineDanger] = useState(true);
	const [toggleSwitch, settoggleSwitch] = useState(true);
	const [toggleSwitchSize, settoggleSwitchSize] = useState(true);

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid={true}>
					<Breadcrumbs title="User" breadcrumbItem="Add User" />

					<Row>
						<Col>
							<Card>
								<CardBody>
									<CardTitle className="h4">Add Somebody</CardTitle>

									<Row className="mb-3">
										<label
											htmlFor="example-text-input"
											className="col-md-2 col-form-label"
										>
											Name
										</label>
										<div className="col-md-10">
											<input
												className="form-control"
												type="text"
												defaultValue="Artisanal kale"
											/>
										</div>
									</Row>

									<Row className="mb-3">
										<label
											htmlFor="example-email-input"
											className="col-md-2 col-form-label"
										>
											Email
										</label>
										<div className="col-md-10">
											<input
												className="form-control"
												type="email"
												defaultValue="email@example.com"
											/>
										</div>
									</Row>

									<Row className="mb-3">
										<label
											htmlFor="example-tel-input"
											className="col-md-2 col-form-label"
										>
											Phone
										</label>
										<div className="col-md-10">
											<input
												className="form-control"
												type="phone"
												defaultValue="1-(555)-555-5555"
											/>
										</div>
									</Row>

									<Row className="mb-3">
										<label
											htmlFor="password-input"
											className="col-md-2 col-form-label"
										>
											Password
										</label>
										<div className="col-md-10">
											<input
												className="form-control"
												type="password"
												defaultValue="password123"
											/>
										</div>
									</Row>
									<Row className="mb-3">
										<label htmlFor="roles" className="col-md-2 col-form-label">
											Role
										</label>
										<div className="col-md-10">
											<select id="roles" name="roles" type="select">
												<option>Admin</option>
												<option>User</option>
											</select>
										</div>
									</Row>

									<button className="btn btn-danger" type="submit">
										Add user
									</button>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default AddUser;
