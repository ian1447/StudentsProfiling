import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./styles.css";
import Hero from "../assets/logo.png";
import Background from "../assets/bg.png";

export default function Home() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [error, setError] = useState("");

	const toggleAuthMode = () => {
		setIsLogin(!isLogin);
	};

	const { setUserData } = useContext(UserContext);
	const history = useHistory();

	const submit = async (e) => {
		e.preventDefault();
		try {
			const loginUser = { email, password };
			const loginRes = await Axios.post(
				"http://localhost:5001/api/auth/login",
				loginUser
			);

			// Decode the token to get user data
			const decodedToken = jwtDecode(loginRes.data.token);

			// Extract user data from the decoded token
			const user = decodedToken.user;

			setUserData({
				token: loginRes.data.token,
				user,
				role: loginRes.data.user.role,
			});

			// Store the token and user data in local storage
			localStorage.setItem("auth-token", loginRes.data.token);
			localStorage.setItem("user", JSON.stringify(user));

			console.log(loginRes);
			console.log("User and token saved to local storage");

			history.push("/");
		} catch (err) {
			if (err.response && err.response.data.err) {
				setError(err.response.data.err);
			}
		}
	};

	return (
		<div>
			{/* Hero Section */}
			<section id="hero" className="hero-section">
				<div className="hero-content">
					<Container>
						<Row className="align-items-center">
							{/* Left side: Image or Logo */}
							<Col md={6}>
								<img src={Hero} alt="Logo" className="img-fluid" />
							</Col>

							{/* Right side: Login/Register component */}
							<Col md={6}>
								<div>
									<h2>Login</h2>
									{error && (
										<ErrorNotice
											message={error}
											clearError={() => setError(undefined)}
										/>
									)}
									<Form onSubmit={submit}>
										{/* Login form fields */}
										<Form.Group controlId="formBasicEmail">
											<Form.Label>Email address</Form.Label>
											<Form.Control
												type="email"
												placeholder="Enter email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</Form.Group>

										<Form.Group controlId="formBasicPassword">
											<Form.Label>Password</Form.Label>
											<Form.Control
												type="password"
												placeholder="Password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
										</Form.Group>

										<Button variant="primary" type="submit" className="mt-4 w-100">
											Login
										</Button>
									</Form>
								</div>

								<Button
									variant="link"
									href="/register"
									className="mt-3 d-block text-center"
									style={{ textDecoration: "none" }}
								>
									{isLogin
										? "No account yet? Register now."
										: "Already have an account? Login instead."}
								</Button>
							</Col>
						</Row>
					</Container>
				</div>
			</section>
		</div>
	);
}
