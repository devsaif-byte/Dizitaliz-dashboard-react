import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import {
	Col,
	Container,
	Form,
	FormFeedback,
	Input,
	Label,
	Row,
} from "reactstrap";
import axios from "axios";
import https from "https";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import CarouselPage from "./CarouselPage";
import logo from "../../assets/images/digitaliz-logo.png";

const Register2 = () => {
	//meta title
	document.title = "Register | Digitaliz - React Admin & Dashboard";
	const navigate = useNavigate();

	//form validation
	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		// initialValues: {
		//   email: '',
		//   name: '',
		//   password: '',
		// },
		initialValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			role: "User",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Please Enter Your Name"),
			email: Yup.string().required("Please Enter Your Email"),
			phone: Yup.string().required("Please Enter Your Phone Number"),
			password: Yup.string().required("Please Enter Your Password"),
		}),
		onSubmit: (values) => {
			axios
				.post(`https://sos.digitaliz.com.bd/register`, values, {
					headers: { "Content-Type": "application/json" },
				})
				.then(function (response) {
					if (response.status === 200 && response.statusText === "OK")
						// Save the uuid in localStorage
						// localStorage.setItem("authUserID", response.data.user_id);
						sessionStorage.setItem("authUserID", response.data.user_id);
					navigate("/dashboard");
				})
				.catch(function (error) {
					console.log(error);
				});
		},
	});

	return (
		<React.Fragment>
			<div>
				<Container fluid className="p-0">
					<Row className="g-0">
						<CarouselPage />

						<Col xl={3}>
							<div className="auth-full-page-content p-md-5 p-4">
								<div className="w-100">
									<div className="d-flex flex-column h-100">
										<div className="mb-4 mb-md-5">
											<Link to="/dashboard" className="d-block auth-logo">
												<img
													src={logo}
													alt=""
													height="70"
													className="auth-logo-dark"
												/>
												<img
													src={logo}
													alt=""
													height="70"
													className="auth-logo-light"
												/>
											</Link>
										</div>
										<div className="my-auto">
											<div>
												<h5 className="text-primary">Register account</h5>
												<p className="text-muted">
													Get your free Dizitaliz account now.
												</p>
											</div>

											<div className="mt-4">
												<Form
													className="form-horizontal"
													onSubmit={(e) => {
														e.preventDefault();
														validation.handleSubmit();
														return false;
													}}
												>
													<div className="mb-3">
														<Label className="form-label">Name</Label>
														<Input
															name="name"
															type="text"
															placeholder="Enter name"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															value={validation.values.name || ""}
															invalid={
																validation.touched.name &&
																validation.errors.name
																	? true
																	: false
															}
														/>
														{validation.touched.name &&
														validation.errors.name ? (
															<FormFeedback type="invalid">
																{validation.errors.name}
															</FormFeedback>
														) : null}
													</div>

													<div className="mb-3">
														<Label className="form-label">Email</Label>
														<Input
															id="email"
															name="email"
															className="form-control"
															placeholder="Enter email"
															type="email"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															value={validation.values.email || ""}
															invalid={
																validation.touched.email &&
																validation.errors.email
																	? true
																	: false
															}
														/>
														{validation.touched.email &&
														validation.errors.email ? (
															<FormFeedback type="invalid">
																{validation.errors.email}
															</FormFeedback>
														) : null}
													</div>

													<div className="mb-3">
														<Label className="form-label">Phone</Label>
														<Input
															name="phone"
															type="text"
															placeholder="Enter phone"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															value={validation.values.phone || ""}
															invalid={
																validation.touched.phone &&
																validation.errors.phone
																	? true
																	: false
															}
														/>
														{validation.touched.phone &&
														validation.errors.phone ? (
															<FormFeedback type="invalid">
																{validation.errors.phone}
															</FormFeedback>
														) : null}
													</div>
													<div className="mb-3">
														<Label className="form-label">Password</Label>
														<Input
															name="password"
															type="password"
															placeholder="Enter password"
															onChange={validation.handleChange}
															onBlur={validation.handleBlur}
															value={validation.values.password || ""}
															invalid={
																validation.touched.password &&
																validation.errors.password
																	? true
																	: false
															}
														/>
														{validation.touched.password &&
														validation.errors.password ? (
															<FormFeedback type="invalid">
																{validation.errors.password}
															</FormFeedback>
														) : null}
													</div>

													<div className="mt-4 d-grid">
														<button
															className="btn btn-primary waves-effect waves-light "
															type="submit"
														>
															Register
														</button>
													</div>
												</Form>

												<div className="mt-5 text-center">
													<p>
														Already have an account ?{" "}
														<Link
															to="/login"
															className="fw-medium text-primary"
														>
															{" "}
															Login
														</Link>{" "}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default Register2;
