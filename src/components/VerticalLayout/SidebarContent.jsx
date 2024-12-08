import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useState, useCallback } from "react";

import ActivationKeyModal from "../Common/ActivationKeyModal";

const SidebarContent = (props) => {
	const ref = useRef();
	const path = useLocation();

	const activateParentDropdown = useCallback((item) => {
		item.classList.add("active");
		const parent = item.parentElement;
		const parent2El = parent.childNodes[1];
		if (parent2El && parent2El.id !== "side-menu") {
			parent2El.classList.add("mm-show");
		}

		if (parent) {
			parent.classList.add("mm-active");
			const parent2 = parent.parentElement;

			if (parent2) {
				parent2.classList.add("mm-show"); // ul tag

				const parent3 = parent2.parentElement; // li tag

				if (parent3) {
					parent3.classList.add("mm-active"); // li
					parent3.childNodes[0].classList.add("mm-active"); //a
					const parent4 = parent3.parentElement; // ul
					if (parent4) {
						parent4.classList.add("mm-show"); // ul
						const parent5 = parent4.parentElement;
						if (parent5) {
							parent5.classList.add("mm-show"); // li
							parent5.childNodes[0].classList.add("mm-active"); // a tag
						}
					}
				}
			}
			scrollElement(item);
			return false;
		}
		scrollElement(item);
		return false;
	}, []);

	const removeActivation = (items) => {
		for (var i = 0; i < items.length; ++i) {
			var item = items[i];
			const parent = items[i].parentElement;

			if (item && item.classList.contains("active")) {
				item.classList.remove("active");
			}
			if (parent) {
				const parent2El =
					parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
						? parent.childNodes[1]
						: null;
				if (parent2El && parent2El.id !== "side-menu") {
					parent2El.classList.remove("mm-show");
				}

				parent.classList.remove("mm-active");
				const parent2 = parent.parentElement;

				if (parent2) {
					parent2.classList.remove("mm-show");

					const parent3 = parent2.parentElement;
					if (parent3) {
						parent3.classList.remove("mm-active"); // li
						parent3.childNodes[0].classList.remove("mm-active");

						const parent4 = parent3.parentElement; // ul
						if (parent4) {
							parent4.classList.remove("mm-show"); // ul
							const parent5 = parent4.parentElement;
							if (parent5) {
								parent5.classList.remove("mm-show"); // li
								parent5.childNodes[0].classList.remove("mm-active"); // a tag
							}
						}
					}
				}
			}
		}
	};

	const activeMenu = useCallback(() => {
		const pathName = path.pathname;
		let matchingMenuItem = null;
		const ul = document.getElementById("side-menu");
		const items = ul.getElementsByTagName("a");
		removeActivation(items);

		for (let i = 0; i < items.length; ++i) {
			if (pathName === items[i].pathname) {
				matchingMenuItem = items[i];
				break;
			}
		}
		if (matchingMenuItem) {
			activateParentDropdown(matchingMenuItem);
		}
	}, [path.pathname, activateParentDropdown]);

	useEffect(() => {
		ref.current.recalculate();
	}, []);

	useEffect(() => {
		new MetisMenu("#side-menu");
		activeMenu();
	}, []);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		activeMenu();
	}, [activeMenu]);

	function scrollElement(item) {
		if (item) {
			const currentPosition = item.offsetTop;
			if (currentPosition > window.innerHeight) {
				ref.current.getScrollElement().scrollTop = currentPosition - 300;
			}
		}
	}

	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handleActivateClick = () => {
		// Perform activation logic here
		console.log("Activation button clicked");
		closeModal(); // Close modal after activation
	};
	return (
		<React.Fragment>
			<SimpleBar className="h-100" ref={ref}>
				<div id="sidebar-menu">
					<ul className="metismenu list-unstyled" id="side-menu">
						<li className="menu-title">{props.t("Menu")} </li>
						<li>
							<Link to="/dashboard">
								{/* <Link to="/#" className="has-arrow"> */}
								<i className="bx bx-home-circle"></i>
								<span>{props.t("Dashboards")}</span>
							</Link>
						</li>

						<li className="menu-title">{props.t("Services")}</li>

						<li>
							<Link to="/envato-elements" className="">
								{/* <i className="bx bx-chat"></i> */}
								<svg
									xmlnsXlink="http://www.w3.org/1999/xlink"
									id="Layer_1"
									data-name="Layer 1"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									style={{
										width: 24,
										height: 24,
										marginLeft: 2,
										marginRight: 3,
									}}
									{...props}
								>
									<defs>
										<style>{"\n      .cls-1{fill:#80b341;}\n    "}</style>
									</defs>
									<circle className="cls-1" cx={9.5} cy={22.73} r={1.06} />
									<path
										className="cls-1"
										d="M19.23,15.58l-6,.65a.11.11,0,0,1-.08-.2L19,11.46A1.42,1.42,0,0,0,18,8.94l-6.38.93a.11.11,0,0,1-.08-.2l6.32-4.82a2.67,2.67,0,0,0,.21-4,2.63,2.63,0,0,0-3.74,0L4.1,11.26a1.78,1.78,0,0,0-.45,1.56,1.76,1.76,0,0,0,2,1.38l5.49-1.12a.11.11,0,0,1,.08.2l-6.09,3.9a2,2,0,0,0-.86,2.22A2,2,0,0,0,6.8,20.92l9.11-2.24a.11.11,0,0,1,.11.18L14.6,20.61a.54.54,0,0,0,.76.76L20,17.53a1.09,1.09,0,0,0-.79-1.94Z"
										transform="translate(-3.62 -0.1)"
									/>
								</svg>

								<span>{props.t("Envato Elements")}</span>
							</Link>
						</li>
						<li>
							<Link to="/freepik">
								{/* <i className="bx bx-file"></i> */}
								<svg
									style={{
										width: 20,
										height: 20,
										marginRight: 10,
									}}
									id="Layer_1"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									x="0px"
									y="0px"
									viewBox="0 0 20 20"
									xmlSpace="preserve"
									{...props}
								>
									<path
										style={{
											fill: "#0a68c1",
										}}
										d="M20,16.25A3.75,3.75,0,0,1,16.25,20H3.75A3.75,3.75,0,0,1,0,16.25V3.75A3.75,3.75,0,0,1,3.75,0h12.5A3.75,3.75,0,0,1,20,3.75Z"
										transform="translate(0)"
									/>
									<path
										style={{
											fill: "#ffffff",
										}}
										d="M8.44,15.86a.39.39,0,0,1-.39.39H4.14a.38.38,0,0,1-.39-.39V14.77a.38.38,0,0,1,.39-.39H8.05a.39.39,0,0,1,.39.39Zm7.42-9.3a.38.38,0,0,0,.39-.39v-2a.38.38,0,0,0-.39-.39H4.14a.38.38,0,0,0-.39.39v8.59a.39.39,0,0,0,.39.4H8.05a.4.4,0,0,0,.39-.4V11.64a.38.38,0,0,1,.39-.39h7a.38.38,0,0,0,.39-.39v-2a.38.38,0,0,0-.39-.39h-7a.39.39,0,0,1-.39-.39V7a.39.39,0,0,1,.39-.39Z"
										transform="translate(0)"
									/>
								</svg>
								<span>{props.t("Freepik")}</span>
							</Link>
						</li>
						{/* Activation */}
						<li className="menu-title">{props.t("Activation")}</li>

						<li>
							<Link
								to=""
								className=""
								onClick={(e) => {
									e.preventDefault();
									openModal();
								}}
							>
								<i className="bx bx-key"></i>
								<span>{props.t("Activation Key")}</span>
							</Link>
						</li>
						<li>
							<Link to="https://digitaliz.com.bd" target="_blank">
								<i className="bx bx-shopping-bag"></i>
								<span>{props.t("Shop")}</span>
							</Link>
						</li>

						{/* Support */}
						<li className="menu-title">{props.t("Support")}</li>
						{/* <div className="d-grid gap-2 mx-2"> */}
						<li className="bg-success mb-1">
							<Link to="https://wa.me/message/WE5I56PFADLDJ1" target="_blank">
								{/* <a role="button" className="btn btn-success text-light"> */}
								{/* <i className="bx bx-chat"></i> */}
								<i className="bx bxl-whatsapp bx-burst text-light rounded"></i>
								<span className="">{props.t("WhatsApp support")}</span>
								{/* </a> */}
							</Link>
						</li>

						<li className="bg-info">
							{/* <a href="#" role="button" className="btn btn-info text-light"> */}
							{/* <i className="bx bx-file"></i> */}
							<Link to="https://t.me/DigitalizBD" target="_blank">
								<i className="bx bxl-telegram bx-flashing text-light rounded"></i>
								<span className="">{props.t("Telegram support")}</span>
							</Link>
							{/* </a> */}
						</li>
						{/* </div> */}
					</ul>
				</div>
			</SimpleBar>
			<ActivationKeyModal
				show={isModalOpen}
				onCloseClick={closeModal}
				activateClick={handleActivateClick}
			/>
		</React.Fragment>
	);
};

SidebarContent.propTypes = {
	location: PropTypes.object,
	t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
