import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Sidebar2 from "./components/layout/Sidebar2";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { UserContext } from "./context/UserContext";
import Users from "./components/pages/user/Users";
import Students from "./components/pages/students/students";
import Sections from "./components/pages/section/Section";
import Subjects from "./components/pages/subjects/subjects";
import Records from "./components/pages/records/Records";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    role: undefined,
  });
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      try {
        const tokenRes = await Axios.post("http://localhost:5001/api/auth/tokenIsValid", null, { headers: { "x-auth-token": token } });

        if (tokenRes.data.user.student_id) {
          setUserData({
            token,
            user: tokenRes.data.user,
            role: tokenRes.data.user.role,
            student_id: tokenRes.data.user.student_id._id,
          });
        } else {
          setUserData({
            token,
            user: tokenRes.data.user,
            role: tokenRes.data.user.role,
          });
        }
      } catch (error) {
        console.error("Authentication check failed", error);
      } finally {
        setLoading(false); // Set loading to false once check is complete
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    console.log(userData);
  });

  if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div className="app-container">
          {userData.token} {/* Include Sidebar only if user is logged in */}
          <div className="main-content">
            <Header />
            <div className="container">
              <Switch>
                {userData.token ? (
                  <>
                    {userData.role === "admin" ? (
                      <>
                        <Sidebar />
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/users" component={Users} />
                        <Route path="/students" component={Students} />
                        <Route path="/sections" component={Sections} />
                        <Route path="/subjects" component={Subjects} />
                        <Route path="/records" component={Records} />
                      </>
                    ) : (
                      <>
                        <Sidebar2 />
                        <Route exact path="/" />
                        <Route path="/subjects" component={Subjects} />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                  </>
                )}
              </Switch>
            </div>
          </div>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}
