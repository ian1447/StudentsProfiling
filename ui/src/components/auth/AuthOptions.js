import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    history.push("/");
  };

  return (
    <nav className="auth-options">
      {userData.user ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <>
            {/* <button onClick={register}>Register</button> */}
            <a href="/">
              <button >Log in</button>
            </a>
        </>
      )}
    </nav>
  );
}
