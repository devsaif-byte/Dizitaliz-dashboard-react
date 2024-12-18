import React, { useState, useMemo, useEffect } from "react";
import {
	Badge,
	Button,
	Card,
	CardBody,
	Col,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Form,
	FormFeedback,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from "reactstrap";
import classnames from "classnames";

import TableContainer from "./TableContainer";
import * as Yup from "yup";
import "/src/assets/scss/datatables.scss";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";
import Spinners from "./Spinner";
import { useSubscriptions } from "../../contexts/SubscriptionContext";
import { useAuth } from "../../routes/route";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchUsers } from "../../pages/UserList/user-list";

const Subscriptions = () => {
	// State variables
	const [activeTab, setActiveTab] = useState("1");

	const [modal, setModal] = useState(false); // Modal visibility
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
	const handleServiceSelection = (service) => {
		handleChange({ target: { name: "service", value: service } });
	};
	const { authUser, authUserID } = useAuth();
	const navigate = useNavigate();
	const { subscriptions, setSubscriptions } = useSubscriptions();

	let subs = [];
	if (authUser?.role === "Admin") {
		// Filter out invalid subscriptions
		subs = subscriptions.allSubscriptions;
	} else if (authUser?.role === "User") {
		subs = subscriptions.userSpecificSubscriptions;
	}

	const formattedSubscriptions = useMemo(() => {
		if (!subs || subs?.length === 0) return []; // Return empty array if no subs

		return subs?.map((sub) => {
			// Parse and format the end date
			const endDate = new Date(sub.service_end_date);
			const currentDate = new Date();
			const isActive = endDate >= currentDate;

			// Format the end date in a readable format (e.g., "MMM DD, YYYY")
			const formattedEndDate = endDate.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "2-digit",
			});

			// Determine status
			const status = isActive ? "Active" : "Expired";

			// Return formatted subscription
			return {
				id: sub.subscription_id,
				serviceName: `${sub.service} - ${sub.total_download_limits} downloads`,
				dailyDownload: sub.remaining_daily_downloads,
				serviceScope: sub.total_download_limits > 100 ? "Premium" : "Standard",
				endDate: formattedEndDate,
				status,
			};
		});
	}, [subs]);

	const arr = formattedSubscriptions.flat().map((el) => el);

	// const toggleTab = (tab) => {
	// 	if (activeTab !== tab) {
	// 		setActiveTab(tab);
	// 	}
	// };

	// Columns configuration for the table
	const columns = useMemo(
		() => [
			{
				header: "ID",
				accessorKey: "id",
				enableColumnFilter: false,
			},
			{
				header: "Service Name",
				accessorKey: "serviceName",
				enableColumnFilter: false,
			},
			{
				header: "Daily Downloads",
				accessorKey: "dailyDownload",
				enableColumnFilter: false,
			},
			{
				header: "Service Scope",
				accessorKey: "serviceScope",
				enableColumnFilter: false,
				cell: ({ row }) => {
					// Use the calculated status from the row's original data
					const status = row.original.serviceScope;

					switch (status) {
						case "Premium":
							return <Badge className="bg-warning font-size-10">Premium</Badge>;
						case "Standard":
							return <Badge className="bg-info font-size-10">Standard</Badge>;
						default:
							return null;
					}
				},
			},
			{
				header: "End Date",
				accessorKey: "endDate",
				enableColumnFilter: false,
			},
			{
				header: "Status",
				accessorKey: "status",
				enableColumnFilter: false,

				cell: ({ row }) => {
					// Use the calculated status from the row's original data
					const status = row.original.status;

					switch (status) {
						case "Active":
							return <Badge className="bg-success font-size-10">Active</Badge>;
						case "Expired":
							return <Badge className="bg-danger font-size-10">Expired</Badge>;
						default:
							return null;
					}
				},
			},
		],
		[]
	);

	// Formik setup
	const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
		useFormik({
			initialValues: {
				email: "",
				service: "",
				remaining_daily_downloads: "",
				service_end_date: "",
				total_download_limits: "",
			},
			validationSchema: Yup.object({
				email: Yup.string().required("Email is required"),
				service: Yup.string().required("Service name is required"),
				remaining_daily_downloads: Yup.number()
					.required("Daily download limit is required")
					.min(0, "Cannot be negative"),
				service_end_date: Yup.date().required("Service end date is required"),
				total_download_limits: Yup.number()
					.required("Total download limit is required")
					.min(0, "Cannot be negative"),
				// .max(100, "Cannot be more than 100"),
			}),
			onSubmit: async (formValues) => {
				setLoading(true);

				try {
					const getUsers = await fetchUsers(authUserID);
					const targetUser = getUsers.find((user) =>
						user.email.includes(formValues.email)
					);

					// Format the service_end_date
					const formattedDate = new Date(formValues.service_end_date)
						.toISOString()
						.slice(0, 10);

					if (targetUser) {
						const response = await axios.post(
							`https://sos.digitaliz.com.bd/api/create-subscription`,

							{
								admin_id: authUserID,
								user_id: targetUser.user_id,
								...formValues,
								service_end_date: formattedDate,
								total_file_downloads: 0,
							},
							{
								headers: {
									"Content-Type": "application/json",
								},
							}
						);
						// setSubscriptions(response.data);

						if (!response)
							toast.error(
								"Somethings wrong! Maybe this user does not exist on database."
							);
						if (response.data.success === false) {
							toast.warning(
								"There might be a subscription exist for this user!"
							);
						}
						if (response.status === 200 && response.data.success !== false) {
							toast.success("Subscription created successfully!");
						}

						await fetchUsers(authUserID);

						resetForm();
						toggleModal(); // Close modal after success
					}
				} catch (error) {
					toast.error("Failed to create subscription.");
					console.error(error);
				} finally {
					setLoading(false);
				}
			},
		});

	// Toggle modal visibility
	const toggleModal = () => {
		setModal(!modal);
	};

	return (
		<React.Fragment>
			<div className="">
				<Container fluid>
					<Row>
						<Col lg="12">
							<Card>
								<CardBody>
									<h4 className="card-title mb-3">Subscriptions</h4>
									<TabContent activeTab={activeTab} className="p-3">
										<TabPane tabId="1" id="all-order">
											{loading ? (
												<Spinners setLoading={setLoading} />
											) : (
												<>
													<TableContainer
														columns={columns}
														data={arr}
														isAddButton={
															authUser?.role === "Admin" ? true : false
														}
														handleUserClick={() => toggleModal()}
														buttonName="Create Subscription"
														isCustomPageSize={true}
														isPagination={true}
														isGlobalFilter={true}
														SearchPlaceholder="Search.."
														paginationWrapper="dataTables_paginate paging_simple_numbers"
														pagination="pagination"
														buttonClass="btn btn-success btn-rounded waves-effect waves-light addusers-modal mb-2"
														tableClass="table-hover table-nowrap datatable dt-responsive nowrap dataTable no-footer dtr-inline"
													/>
												</>
											)}
										</TabPane>
									</TabContent>
								</CardBody>
							</Card>
						</Col>
					</Row>

					{/* Modal for form */}
					<Modal isOpen={modal} toggle={toggleModal}>
						<ModalHeader>Create New Subscription</ModalHeader>
						<ModalBody>
							<Form
								onSubmit={(e) => {
									e.preventDefault();

									handleSubmit();
								}}
							>
								<Row>
									<Col xs="12">
										<div className="mb-3">
											<Label>Email</Label>
											<Input
												type="email"
												name="email"
												value={values.email}
												onChange={handleChange}
												onBlur={handleBlur}
												invalid={touched.email && !!errors.email}
											/>
											{touched.email && errors.email && (
												<FormFeedback>{errors.email}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Service Name</Label>
											<Input
												type="select"
												name="service"
												value={values.service}
												onChange={handleChange}
												onBlur={handleBlur}
												invalid={touched.service && !!errors.service}
											>
												<option value="Envato Elements">Envato Elements</option>
												<option value="Freepik"> Freepik</option>
											</Input>

											{touched.service && errors.service && (
												<FormFeedback>{errors.service}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Remaining Daily Downloads</Label>
											<Input
												type="number"
												name="remaining_daily_downloads"
												value={values.remaining_daily_downloads}
												onChange={handleChange}
												onBlur={handleBlur}
												invalid={
													touched.remaining_daily_downloads &&
													!!errors.remaining_daily_downloads
												}
											/>
											{touched.remaining_daily_downloads &&
												errors.remaining_daily_downloads && (
													<FormFeedback>
														{errors.remaining_daily_downloads}
													</FormFeedback>
												)}
										</div>
										<div className="mb-3">
											<Label>Service End Date</Label>
											<Input
												type="date"
												name="service_end_date"
												value={values.service_end_date}
												onChange={handleChange}
												onBlur={handleBlur}
												invalid={
													touched.service_end_date && !!errors.service_end_date
												}
											/>
											{touched.service_end_date && errors.service_end_date && (
												<FormFeedback>{errors.service_end_date}</FormFeedback>
											)}
										</div>
										<div className="mb-3">
											<Label>Total Download Limit</Label>
											<Input
												type="number"
												name="total_download_limits"
												value={values.total_download_limits}
												onChange={handleChange}
												onBlur={handleBlur}
												invalid={
													touched.total_download_limits &&
													!!errors.total_download_limits
												}
											/>
											{touched.total_download_limits &&
												errors.total_download_limits && (
													<FormFeedback>
														{errors.total_download_limits}
													</FormFeedback>
												)}
										</div>
									</Col>
								</Row>
								<Row>
									<Col className="text-end">
										<Button type="submit" color="success" disabled={loading}>
											{loading ? "Saving..." : "Create"}
										</Button>
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

export default Subscriptions;

async function updateSubscriptionCount(token) {
	try {
		const response = await fetch("/update-subscription", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token }),
		});

		if (response.ok) {
			alert("Subscription updated successfully!");
		} else {
			alert("Failed to update subscription.");
		}
	} catch (error) {
		console.error("Error updating subscription:", error);
	}
}
