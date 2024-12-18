import React, { useEffect, useState } from "react";
import {
	Card,
	CardBody,
	CardTitle,
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

import {
	addCookie,
	deleteCookie,
	fetchTokens,
	listCookies,
} from "../../helpers/Cookies/cookie-helper";
import { useAuth } from "../../routes/route";
import { toast } from "react-toastify";

const CookieItem = ({ id, cookie, service, used, onEdit, onDelete }) => {
	return (
		<Card
			className="mb-4 shadow-sm"
			style={{ borderRadius: "8px" }}
			outline={true}
		>
			<CardBody>
				<CardTitle tag="h5" className="text-primary mb-3">
					Cookie Details
				</CardTitle>
				<Row className="align-items-center">
					<Col md={6} className="mb-2">
						<strong>Id:</strong> {id}
					</Col>
					<Col md={6} className="mb-2">
						<strong>Cookie:</strong>
						<span
							style={{
								wordBreak: "break-word",
								display: "inline-block",
								marginLeft: "5px",
							}}
						>
							{cookie}
						</span>
					</Col>
					<Col md={6} className="mb-2">
						<strong>Service:</strong> {service}
					</Col>
					<Col md={6} className="mb-2">
						<strong>Used:</strong> {used}
					</Col>
				</Row>
				<div className="d-flex justify-content-end mt-3">
					<Button
						color="success"
						size="sm"
						className="me-2"
						onClick={onEdit}
						style={{ padding: "5px 15px", fontWeight: "bold" }}
					>
						Edit
					</Button>
					<Button
						color="danger"
						size="sm"
						onClick={onDelete}
						style={{ padding: "5px 15px", fontWeight: "bold" }}
					>
						Delete
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

const AddCookies = () => {
	const { authUserID, authUser } = useAuth();
	const adminId = authUser?.role === "Admin" ? authUser?.user_id : null;

	const [tokens, setTokens] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editId, setEditId] = useState(null);

	// Load tokens from the backend

	useEffect(() => {
		if (!adminId) return;
		fetchTokens(adminId, setTokens);
	}, []);

	const formik = useFormik({
		initialValues: {
			token: "",
			service: "Freepik",
		},
		validationSchema: Yup.object({
			token: Yup.string().required("Please paste a cookie here!"),
		}),

		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				if (isEditing && editId !== null) {
					// Remove the old token first
					const oldTokenId = tokens[editId].id;

					const deleteResponse = await deleteCookie(
						adminId,
						oldTokenId,
						isEditing
					);

					if (!deleteResponse.success) {
						console.error("Failed to delete the old token in the backend.");
						return;
					}

					// Add the updated token
					const response = await addCookie(
						adminId,
						values.service,
						values.token,
						isEditing
					);
					if (response.data) {
						// Refresh the token list
						const updatedTokens = await listCookies(adminId);

						setTokens(updatedTokens || []);
					}
				} else {
					// Add a new token
					const response = await addCookie(
						adminId,
						values.service,
						values.token,
						isEditing
					);
					if (response.data) {
						// Refresh the token list
						const updatedTokens = await listCookies(adminId);
						setTokens(updatedTokens || []);
					}
				}

				// Reset form and state
				setIsEditing(false);
				setEditId(null);
				resetForm();
				fetchTokens(adminId, setTokens);
			} catch (error) {
				console.error("Error submitting token:", error);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const handleEdit = (id) => {
		const tokenIndex = tokens.findIndex((token) => token.id === id);
		if (tokenIndex !== -1) {
			setEditId(tokenIndex);
			formik.setValues({
				token: tokens[tokenIndex]?.cookie || "",
				service: tokens[tokenIndex]?.service || "Freepik",
			});
			setIsEditing(true);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await deleteCookie(adminId, id);
			if (response.data) {
				setTokens(tokens.filter((token) => token.id !== id));
				toast.success("Deleted token successfully");
			}
			fetchTokens(adminId, setTokens);
		} catch (error) {
			console.error("Error deleting token:", error);
			toast.error("Failed to delete token.");
		}
	};

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title="Cookies" breadcrumbItem="Manage Cookies" />
				<Row>
					<Col>
						<Card>
							<CardBody>
								<h4 className="card-title">
									{isEditing ? "Edit Cookie" : "Add Cookie"}
								</h4>
								<form onSubmit={formik.handleSubmit}>
									<Row className="mb-3">
										<label htmlFor="token" className="col-md-2 col-form-label">
											Token
										</label>
										<Col md={10}>
											<Input
												type="text"
												id="token"
												name="token"
												className="form-control"
												value={formik.values.token}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
											{formik.touched.token && formik.errors.token && (
												<div className="text-danger">{formik.errors.token}</div>
											)}
										</Col>
									</Row>
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
								<h5 className="mt-4">Saved Tokens</h5>
								{tokens.length > 0 ? (
									tokens.map((el, index) => (
										<Alert color="warning" key={el.id} fade={false}>
											<CookieItem
												key={index}
												id={el.id}
												cookie={el.cookie}
												service={el.service}
												used={el.used}
												onEdit={() => handleEdit(el.id)}
												onDelete={() => handleDelete(el.id)}
											/>
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
	);
};

export default AddCookies;
