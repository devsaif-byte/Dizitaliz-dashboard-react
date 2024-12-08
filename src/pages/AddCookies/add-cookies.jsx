import React, { useEffect, useState } from "react";
import {
	Card,
	CardBody,
	Col,
	Row,
	Container,
	Alert,
	Button,
	Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
	addToken,
	loadTokens,
	removeToken,
	updateToken,
} from "../../store/cookieToken/actions";

const AddCookies = () => {
	// Page title
	useEffect(() => {
		document.title = "Add Cookies | Digitaliz";
	}, []);

	const tokens = useSelector((state) => state.cookies.tokens); // Get tokens from Redux store
	const dispatch = useDispatch();
	const [editIndex, setEditIndex] = useState(null); // Track editing index
	const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active

	// Formik configuration
	const formik = useFormik({
		initialValues: {
			id: Date.now(),
			token: "",
		},
		validationSchema: Yup.object({
			token: Yup.string().required("Please paste a cookie here!"),
		}),

		onSubmit: (values, { setSubmitting, resetForm }) => {
			if (isEditing) {
				// Update an existing token
				dispatch(updateToken(tokens[editIndex].id, values.token));
				setIsEditing(false);
				setEditIndex(null);
			} else {
				// Add a new token
				dispatch(addToken({ id: values.id, str: values.token }));
			}
			resetForm();
			setSubmitting(false);
		},
	});
	useEffect(() => {
		const savedTokens = localStorage.getItem("tokens");
		if (savedTokens) {
			dispatch(loadTokens(JSON.parse(savedTokens))); // Dispatch an action to load tokens into the Redux store
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("tokens", JSON.stringify(tokens));
	}, [tokens]);

	// Edit a token

	const handleEdit = (id) => {
		const tokenIndex = tokens.findIndex((token) => token.id === id);
		console.log(tokenIndex);
		setEditIndex(tokenIndex);
		formik.setFieldValue("token", tokens[tokenIndex]?.str || "");
		setIsEditing(true);
	};

	// Delete a token
	const handleDelete = (id) => {
		dispatch(removeToken(id));
	};

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid={true}>
					<Breadcrumbs title="Cookies" breadcrumbItem="Manage Cookies" />

					<Row>
						<Col>
							<Card>
								<CardBody>
									<h4 className="card-title">
										{isEditing ? "Edit Cookie" : "Add Cookie"}
									</h4>
									<form onSubmit={formik.handleSubmit}>
										{/* Token Input */}
										<Row className="mb-3">
											<label
												htmlFor="token"
												className="col-md-2 col-form-label"
											>
												Token
											</label>
											<div className="col-md-10">
												<Input
													type="text"
													id="token"
													name="token"
													className="form-control"
													value={formik.values.token}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
												/>
												{formik.touched.token && formik.errors.token ? (
													<div className="text-danger">
														{formik.errors.token}
													</div>
												) : null}
											</div>
										</Row>

										{/* Submit Button */}
										<div className="text-end">
											<Button
												type="submit"
												color="primary"
												disabled={formik.isSubmitting}
											>
												{formik.isSubmitting
													? "Processing..."
													: isEditing
													? "Update"
													: "Add"}
											</Button>
										</div>
									</form>
									<hr />

									{/* Display Tokens */}
									<h5 className="mt-4">Saved Tokens</h5>
									{tokens.length > 0 ? (
										tokens.map((el, index) => (
											<Alert
												key={index}
												color="warning"
												className="d-flex justify-content-between align-items-center"
											>
												<span>{el.id}</span>
												<span>{el.str}</span>
												<div>
													<Button
														color="success"
														size="sm"
														onClick={() => handleEdit(el.id)}
														className="me-2"
													>
														Edit
													</Button>
													<Button
														color="danger"
														size="sm"
														onClick={() => handleDelete(el.id)}
													>
														Delete
													</Button>
												</div>
											</Alert>
										))
									) : (
										<p>No tokens available. Add a new one above.</p>
									)}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default AddCookies;
