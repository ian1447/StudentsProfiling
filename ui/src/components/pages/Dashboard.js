import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { UserContext } from "../../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const { userData } = useContext(UserContext);

	useEffect(() => {
		if (userData) {
			console.log("User Data:", userData);
		} else {
			console.log("You need to login to this website to access.");
		}
	}, [userData]);

	useEffect(() => {
		const fetchStudents = async () => {
		  const token = localStorage.getItem("auth-token");
		  const headers = { Authorization: `Bearer ${token}` };
		  try {
			const res = await Axios.get("http://localhost:5001/api/students", {
			  headers,
			});
			  console.log('$$Students Res:', res.data);
			setStudents(res.data);
		  } catch (error) {
			console.error("Error fetching students:", error);
		  }
		};
		fetchStudents();
	  }, []);

	const data = {
		labels: ["Cough", "Fever", "Headache", "Stomache", "Diziness", "Ulcer", "Gastritis"],
		datasets: [
			{
				label: "Common Diseases",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
			},
		],
	};

	const data2 = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "Client Numbers",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
			},
		],
	};

	return (
		<div className="page">
			<>
				<h3>Welcome Back, <b>{userData?.role}</b></h3>
				<div className="container mt-4">
					<div className="row">
						<div className="col-md-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Enrolled Students</h5>
									{students.length}
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Students Paid</h5>
									5
								</div>
							</div>
						</div>
						<div className="col-md-12 mt-4">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">Latest Transaction...</h5>
									5
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		</div>
	);
}
