import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck, FaUser, FaLocationArrow, FaChartBar,
  FaPager, FaPhoneAlt, FaAddressCard, FaIdCardAlt, FaEnvelope
} from "react-icons/fa";
import "./header.style.css";

export default function Sidebar2() {
  return (
    <div className="sidebar bg-light p-3">
      <h4>Sto. Niño School</h4>
      <ul>
        {/* <li>
          <Link to="/">
            <FaChartBar className="icon" /> Dashboard
          </Link>
        </li>
        */}
				<li>
					<Link to="/subjects">
						<FaUser className="icon" /> Subjects
					</Link>
				</li>
        <li>
          <Link to="/appointments">
            <FaCalendarCheck className="icon" /> Payments
          </Link>
        </li>
        <li>
          <Link to="/appointments">
            <FaCalendarCheck className="icon" /> Transaction History
          </Link>
        </li>
      </ul>
    </div>
  );
}
