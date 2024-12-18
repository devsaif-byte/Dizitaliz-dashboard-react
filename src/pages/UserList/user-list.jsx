import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
import Spinners from "../../components/Common/Spinner";
import {
	Card,
	CardBody,
	Col,
	Container,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	Label,
	Input,
	Form,
	FormFeedback,
	Button,
	Badge,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import DeleteModal from "/src/components/Common/DeleteModal";
import { toast } from "react-toastify";
import { useAuth } from "../../routes/route";
import axios from "axios";

// Fetch users from the API
// Fetch users from the API
export const fetchUsers = async (auth_id) => {
	if (!auth_id) return [];
	try {
		const response = await axios.get(
			`https://sos.digitaliz.com.bd/api/list-users?admin_id=${auth_id || ""}`
		);
		return response.data; // Return user data
	} catch (err) {
		console.error("Failed to fetch users:", err);
		throw err; // Throw error for the calling component to handle
	}
};

const UserList = () => {
	// Set document title
	document.title = "User List | Digitaliz";

	const navigate = useNavigate();
	const { authUserID } = useAuth();

	// State variables
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [currentUser, setCurrentUser] = useState(null); // For handling user editing/deletion

	// Initial fetch of users
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await fetchUsers(authUserID); // Call the refactored function
				setUsers(data); // Update users state
			} catch (err) {
				setError("Failed to fetch users");
				toast.error(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (authUserID) fetchData(); // Ensure the function is only called if authUserID is defined
	}, [authUserID]);

	// Validation schema for the user form
	const {
		values,
		setValues,
		handleBlur,
		handleSubmit,
		handleChange,
		touched,
		errors,
		resetForm,
	} = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: currentUser?.name || "",
			email: currentUser?.email || "",
			phone: currentUser?.phone || "",
			password: currentUser?.password || "",
			role: currentUser?.role || "User",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Please Enter Your Name"),
			email: Yup.string()
				.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email")
				.required("Please Enter Your Email"),
			phone: Yup.string().required("Please Enter Your Phone"),
			password: Yup.string().required("Please Enter Your Password"),
			role: Yup.string().required("Please Enter Your Role"),
		}),

		onSubmit: async (formValues) => {
			try {
				setLoading(true);
				if (isEdit) {
					const res = await axios.post(
						`https://sos.digitaliz.com.bd/api/update-user`,
						{
							...formValues,
							admin_id: authUserID,
							user_id: currentUser?.user_id,
						}
					);
					toast.success("User updated successfully!");
				}
				resetForm();
				toggleModal();
				fetchUsers(authUserID);
			} catch (error) {
				toast.error("Failed to save user.");
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
	});
	// re-initialize validation when current user changes
	useEffect(() => {
		setValues({
			name: currentUser?.name || "",
			email: currentUser?.email || "",
			phone: currentUser?.phone || "",
			password: currentUser?.password || "",
			role: currentUser?.role || "User",
		});
	}, [currentUser]);

	// Define table columns
	const columns = useMemo(
		() => [
			{
				header: "Name",
				accessorKey: "name",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cell) => (
					<h5 className="font-size-14 mb-1 text-dark">{cell.getValue()}</h5>
				),
			},
			{
				header: "Email",
				accessorKey: "email",
				enableColumnFilter: false,
				enableSorting: true,
			},
			{
				header: "Phone",
				accessorKey: "phone",
				enableColumnFilter: false,
				enableSorting: true,
			},
			{
				header: "Password",
				accessorKey: "password",
				enableColumnFilter: false,
				enableSorting: true,
			},
			{
				header: "Role",
				accessorKey: "role",
				enableColumnFilter: false,
				enableSorting: true,
			},
			{
				header: "Action",
				cell: (cellProps) => {
					const user = cellProps.row.original;
					return (
						<div className="d-flex gap-3">
							<Link
								to="#"
								className="text-success"
								onClick={(e) => {
									e.preventDefault();
									toggleModal();
									setIsEdit(true);
									setCurrentUser(user);
								}}
							>
								<i className="mdi mdi-pencil font-size-18" />
							</Link>
							<Link
								to="#"
								className="text-danger"
								onClick={(e) => {
									e.preventDefault();
									setCurrentUser(user);
									setDeleteModal(true);
								}}
							>
								<i className="mdi mdi-delete font-size-18" />
							</Link>
						</div>
					);
				},
			},
		],
		[]
	);

	// Toggle modal
	const toggleModal = () => {
		setModal(!modal);
		if (!modal) {
			setIsEdit(false);
			setCurrentUser(null);
		}
	};

	// Handle user deletion
	const handleDeleteUser = async () => {
		if (currentUser?.user_id) {
			// Logic to delete the user from API can go here
			setLoading(true);
			try {
				const response = await axios.post(
					`https://sos.digitaliz.com.bd/api/delete-user`,
					{
						admin_id: authUserID,
						user_id: currentUser?.user_id,
					}
				);

				toast.success("User deleted successfully!");
				toggleModal();
				fetchUsers(authUserID);
			} catch (err) {
				toast.error("Failed to delete the user.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		setDeleteModal(false);
		setCurrentUser(null);
	};

	return (
		<React.Fragment>
			<DeleteModal
				show={deleteModal}
				onDeleteClick={(e) => {
					e.preventDefault();
					handleDeleteUser(); // Trigger user deletion
				}}
				onCloseClick={() => {
					setDeleteModal(false); // Close the delete modal
					setCurrentUser(null); // Clear the current user
				}}
			/>
			<div className="page-content">
				<Container fluid>
					<Breadcrumbs title="Users" breadcrumbItem="User List" />
					{loading ? (
						<Spinners setLoading={setLoading} />
					) : (
						<Row>
							<Col lg="12">
								<Card>
									<CardBody>
										<TableContainer
											columns={columns}
											data={users}
											isGlobalFilter={true}
											isPagination={true}
											SearchPlaceholder="Search..."
											isCustomPageSize={true}
											// isAddButton={true}
											handleUserClick={() => toggleModal()}
											// handleUserClick={handleUserClick}
											// buttonClass="btn btn-success btn-rounded waves-effect waves-light addusers-modal mb-2"
											// buttonName="New User"
											tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
											theadClass="table-light"
											paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
											pagination="pagination"
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					)}
					<Modal isOpen={modal} toggle={toggleModal}>
						<ModalHeader toggle={toggleModal}>
							{isEdit ? "Edit User" : "Add User"}
						</ModalHeader>
						<ModalBody>
							<Form
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit();
								}}
							>
								<Row>
									<Col xs={12}>
										<div className="mb-3">
											<Label>Name</Label>
											<Input
												name="name"
												type="text"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.name}
												invalid={touched.name && errors.name}
											/>
											{touched.name && errors.name && (
												<FormFeedback>{errors.name}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Email</Label>
											<Input
												name="email"
												type="email"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.email}
												invalid={touched.email && errors.email}
											/>
											{touched.email && errors.email && (
												<FormFeedback>{errors.email}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Phone</Label>
											<Input
												name="phone"
												type="text"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.phone}
												invalid={touched.phone && errors.phone}
											/>
											{touched.phone && errors.phone && (
												<FormFeedback>{errors.phone}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Password</Label>
											<Input
												name="password"
												type="password"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.password}
												invalid={touched.password && errors.password}
											/>
											{touched.password && errors.password && (
												<FormFeedback>{errors.password}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Role</Label>
											<Input
												type="select"
												name="role"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.role}
												// invalid={touched.role && errors.role}
												invalid={touched.role && !!errors.role}
											>
												<option value="Admin">Admin</option>
												<option value="User">User</option>
											</Input>
											{touched.role && errors.role && (
												<FormFeedback>{errors.role}</FormFeedback>
											)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col>
										<div className="text-end">
											<Button type="submit" color="success">
												{isEdit ? "Update" : "Add"}
											</Button>
										</div>
									</Col>
								</Row>
							</Form>
						</ModalBody>
					</Modal>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default UserList;
