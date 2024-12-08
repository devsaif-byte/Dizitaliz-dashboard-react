import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
	return (
		<React.Fragment>
			<footer className="footer">
				<Container fluid={true}>
					<Row>
						<Col md={6}>
							© {new Date().getFullYear()} All rights reserved by
							<a
								href="https://digitaliz.com.bd/"
								target="_blank"
								rel="noreferrer"
							>
								{" "}
								Digitaliz.
							</a>
							{/* </div> */}
						</Col>
						<Col md={6}>
							<div className="text-sm-end d-none d-sm-block">
								Developed By{" "}
								<a
									href="https://fusionflame.net"
									target="_blank"
									rel="noreferrer"
								>
									Fusion Flame
								</a>
							</div>
						</Col>
					</Row>
				</Container>
			</footer>
		</React.Fragment>
	);
};

export default Footer;
