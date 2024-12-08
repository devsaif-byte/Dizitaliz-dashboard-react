import PropTypes from "prop-types";
import React from "react";
import { Input, Modal, ModalBody } from "reactstrap";

const ActivationKeyModal = ({ show, activateClick, onCloseClick }) => {
	return (
		<Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
			<div className="modal-content">
				<ModalBody className="px-4 py-5 text-center">
					<h2>Service Activation</h2>

					<p className="text-muted font-size-16 mb-4">
						Enter your license key, you've received via email.
					</p>
					<div className="my-3">
						<Input
							id="activation-code"
							name="code"
							placeholder="eg: zzzzzzzzzz"
							type="text"
						/>
					</div>

					<div className="hstack gap-2 justify-content-center mb-0">
						<button
							type="button"
							className="btn btn-danger"
							onClick={onCloseClick}
						>
							Close
						</button>
						<button
							type="button"
							className="btn btn-success"
							onClick={activateClick}
						>
							Activate
						</button>
					</div>
				</ModalBody>
			</div>
		</Modal>
	);
};

ActivationKeyModal.propTypes = {
	onCloseClick: PropTypes.func,
	activateClick: PropTypes.func,
	show: PropTypes.any,
};

export default ActivationKeyModal;
