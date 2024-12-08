import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Col,
	Container,
	Form,
	Row,
	Input,
	Label,
	FormFeedback,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import CarouselPage from "./CarouselPage";
import logo from "../../assets/images/digitaliz-logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../routes/route";

const Login2 = () => {
	const [passwordShow, setPasswordShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	//meta title
	document.title = "Login | Digitaliz";

	// Form validation
	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().required("Please Enter Your email"),
			password: Yup.string().required("Please Enter Your Password"),
		}),
		onSubmit: (values) => {
			console.log(values);

			// axios
			// 	.post(`https://sos.digitaliz.com.bd/login`, values, {
			// 		headers: { "Content-Type": "application/json" },
			// 	})
			// 	.then(function (response) {
			// 		console.log(response);

			// 		if (response.status === 200 && response.statusText === "OK") {
			// 			// Save the uuid in localStorage
			// 			localStorage.setItem("authUserID", response.data.user_id);

			// 			navigate("/dashboard");
			// 			toast.success("Login successfull");
			// 		}
			// 	})
			// 	.catch(function (error) {
			// 		console.log(error);
			// 		toast.error(error.message);
			// 	});
			fetch(`https://sos.digitaliz.com.bd/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			})
				.then((response) => {
					if (response.ok) {
						return response.json(); // Parse JSON response
					} else {
						throw new Error(`${response.status} ${response.statusText}`);
					}
				})
				.then((data) => {
					console.log(data);

					// Save the uuid in localStorage
					localStorage.setItem("authUserID", data.user_id);

					navigate("/dashboard");
					toast.success("Login successful");
				})
				.catch((error) => {
					console.error(error);
					toast.error("Login failed!" || error.message);
				});
		},
	});
	return (
		<React.Fragment>
			<div>
				<Container fluid className="p-0">
					<Row className="g-0">
						<CarouselPage />

						<Col xl={4}>
							<div className="auth-full-page-content p-md-5 p-4">
								<div className="w-100">
									<div className="d-flex flex-column h-100">
										<div className="mb-4 mb-md-5">
											<Link to="/dashboard" className="d-block card-logo">
												<img
													src={logo}
													alt=""
													height="70"
													className="logo-dark-element"
												/>
												<img
													src={logo}
													alt=""
													height="70"
													className="logo-light-element"
												/>
											</Link>
										</div>
										<div className="my-auto">
											<div>
												<h5 className="text-primary">Welcome Back !</h5>
												<p className="text-muted">
													Sign in to continue your account.
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
														<Label className="form-label">Email</Label>
														<Input
															name="email"
															className="form-control"
															placeholder="Enter email"
															type="text"
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
														<div className="float-end">
															<Link
																to="/auth-recoverpw-2"
																className="text-muted"
															>
																Forgot password?
															</Link>
														</div>
														<Label className="form-label">Password</Label>
														<div className="input-group auth-pass-inputgroup">
															<Input
																name="password"
																value={validation.values.password || ""}
																type={passwordShow ? "text" : "password"}
																placeholder="Enter Password"
																onChange={validation.handleChange}
																onBlur={validation.handleBlur}
																invalid={
																	validation.touched.password &&
																	validation.errors.password
																		? true
																		: false
																}
															/>
															<button
																onClick={() => setPasswordShow(!passwordShow)}
																className="btn btn-light "
																type="button"
																id="password-addon"
															>
																<i className="mdi mdi-eye-outline"></i>
															</button>
														</div>
														{validation.touched.password &&
														validation.errors.password ? (
															<FormFeedback type="invalid">
																{validation.errors.password}
															</FormFeedback>
														) : null}
													</div>

													<div className="form-check">
														<Input
															type="checkbox"
															className="form-check-input"
															id="auth-remember-check"
														/>
														<label
															className="form-check-label"
															htmlFor="auth-remember-check"
														>
															Remember me
														</label>
													</div>

													<div className="mt-3 d-grid">
														<button
															className="btn btn-primary btn-block "
															type="submit"
														>
															Log In
														</button>
													</div>
												</Form>

												<div className="mt-5 text-center">
													<p>
														Don&apos;t have an account ?{" "}
														<Link
															to="/register"
															className="fw-medium text-primary"
														>
															Signup now
														</Link>
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

export default Login2;
