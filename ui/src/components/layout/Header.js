import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AuthOptions from "../auth/AuthOptions";
import { UserContext } from "../../context/UserContext";
import "./header.style.css";
import Hero from "../assets/logo.png";

export default function Header() {
	const { userData } = useContext(UserContext);

	useEffect(() => {
		console.log("User Data:", userData);
	});

	return (
		<Container fluid>
			<Row>
				{/* Main Content Column */}
				<Col
					xs={12}
					md={userData.token ? 9 : 12}
					lg={userData.token ? 10 : 12}
					className="p-3"
				>
					{/* Main content */}
					<header
						id="header"
						className={`d-flex justify-content-between align-items-center ${
							userData.token ? "header-with-sidebar" : "full-width-header"
						}`}
					>
						<Link to="/" className="text-decoration-none">
							<h6 className="title">
                {userData.token ? (
                ""
								) : (
									<>
										<img
											alt="School Logo"
											src={Hero}
											width="50px"
											style={{ padding: 4 }}
										/>
									</>
								)}
							</h6>
						</Link>

						<AuthOptions />
					</header>
				</Col>
			</Row>
		</Container>
	);
}
