import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import { jwtDecode } from "jwt-decode";
// import "./login.styles.css";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

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
		  
		  if (loginRes.data.user.student_id) {
			setUserData({
				token: loginRes.data.token,
				user,
				role: loginRes.data.user.role,
				student_id: loginRes.data.user.student_id._id
			  });
		  } else {
			setUserData({
				token: loginRes.data.token,
				user,
				role: loginRes.data.user.role,
			  });
		  }

		  // Store the token and user data in local storage
		  localStorage.setItem("auth-token", loginRes.data.token);
		  localStorage.setItem("user", JSON.stringify(user));
	  
		  history.push("/");
		} catch (err) {
		  if (err.response && err.response.data.err) {
			setError(err.response.data.err);
		  }
		}
	  };
	  

	return (
		<div className="center-container">
			{/* <div className="card"> */}
				<h2>Log in</h2>
				{error && (
					<ErrorNotice message={error} clearError={() => setError(undefined)} />
				)}
				<form className="form" onSubmit={submit}>
					<label htmlFor="login-email">Email</label>
					<input
						id="login-email"
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label htmlFor="login-password">Password</label>
					<input
						id="login-password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<input type="submit" value="Log in" />
				</form>
			{/* </div> */}
		</div>
	);
}
