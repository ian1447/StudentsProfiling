import React from "react";
import { Link } from "react-router-dom";
import {
	FaCalendarCheck,
	FaUser,
	FaChartBar,
	FaPager,
	FaIdCardAlt,
	FaFileArchive 
} from "react-icons/fa";
import * as Bootstrap from "react-bootstrap";
import "./header.style.css";
import Hero from "../assets/logo.png";

export default function Sidebar() {
	return (
		<div className="sidebar bg-light p-3">
			<div className="logo-container">
				<img alt="School Logo" src={Hero} width="80px" className="mb-3" />
				<div className="text-container">
					<h4>Sto. Niño School</h4>
				</div>
			</div>
			<ul>
				<li>
					<div>Main</div>
				</li>
				<li>
					<Link to="/">
						<FaChartBar className="icon" /> Dashboard
					</Link>
				</li>
				{/* <li>
					<Link to="/records">
						<FaFileArchive className="icon" /> Grades
					</Link>
				</li> */}
				<li>
					<Link to="/records">
						<FaIdCardAlt className="icon" /> Records
					</Link>
				</li>
				<li>
					<Link to="/appointments">
						<FaCalendarCheck className="icon" /> Payments
					</Link>
				</li>
				<li>
					<Link to="/news-events">
						<FaPager className="icon" /> Transaction History
					</Link>
				</li>
				<li>
					<div>Managements</div>
				</li>
				<li>
					<Link to="/students">
						<FaUser className="icon" /> Students
					</Link>
				</li>
				<li>
					<Link to="/sections">
						<FaUser className="icon" /> Section
					</Link>
				</li>
				<li>
					<Link to="/users">
						<FaUser className="icon" /> Users
					</Link>
				</li>
			</ul>
		</div>
	);
}
