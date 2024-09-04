import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("Junior High School");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState("");

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        idNumber,
        firstName,
        middleName,
        lastName,
        schoolLevel,
        email,
        password,
        passwordCheck,
      };
      await Axios.post("http://localhost:5001/api/auth/signup", newUser);
      const loginRes = await Axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (err) {
      err.response && err.response.data.err && setError(err.response.data.err);
    }
  };

  return (
    <div className="page">
      <h2>Register</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-id-number">ID Number</label>
        <input
          id="register-id-number"
          type="text"
          onChange={(e) => setIdNumber(e.target.value)}
        />

        <label htmlFor="register-first-name">First Name</label>
        <input
          id="register-first-name"
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="register-middle-name">Middle Name</label>
        <input
          id="register-middle-name"
          type="text"
          onChange={(e) => setMiddleName(e.target.value)}
        />

        <label htmlFor="register-last-name">Last Name</label>
        <input
          id="register-last-name"
          type="text"
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="register-school-level">School Level</label>
        <select
          id="register-school-level"
          onChange={(e) => setSchoolLevel(e.target.value)}
        >
          <option value="Junior High School">Junior High School</option>
          <option value="Senior High School">Senior High School</option>
        </select>

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
