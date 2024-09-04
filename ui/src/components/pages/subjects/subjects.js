import React, { useEffect, useState, useContext } from "react";
import * as Bootstrap from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes , FaPlus, FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form } from "react-bootstrap";
import Axios from "axios";
import { UserContext } from "../../../context/UserContext.js";

const Subjects = () => {
  const { userData } = useContext(UserContext);
  const [yearsections, setYearsections] = useState([]);
  const [enrolledsubjects, setEnrolledsubjectss] = useState([]);
  const [formData, setFormData] = useState({
    year_section: "",
    student_id: userData.student_id,
    enrolled: "Y",
    is_passed: "N"
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedYearSection, setSelectedYearSection] = useState();
  const [selectedYearSectionForDisplay, setSelectedYearSectionForDisplay] = useState();

  const Subjects = [
    { label: "Math", value: "Math" },
    { label: "English", value: "English" },
    { label: "Science", value: "Science" },
    { label: "Filipino", value: "Filipino" },
    { label: "Hekasi", value: "Hekasi" },
    { label: "Mapeh", value: "Mapeh" },
  ];

  useEffect(() => {
    const fetchYearSection = async () => {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await Axios.get("http://localhost:5001/api/yearsections", {
          headers,
        });
        setYearsections(res.data);
        
        console.log("$$res",res);
        const res2 = await Axios.get("http://localhost:5001/api/enrolledsubjects", {
          headers,
        });
        setEnrolledsubjectss(res2.data);
        setSelectedYearSection(res2.data[0]?.year_section._id);
        setSelectedYearSectionForDisplay(res2.data[0]?.year_section.year + " - " + res2.data[0]?.year_section.section)
      } catch (error) {
        console.error("Error fetching year and sections:", error);
      }
    };
    fetchYearSection();
  }, []);

  const handleRowClick = (year) => {
    setFormData({ ...formData, year_section: year._id });
	  setSelectedYearSection(year._id);
    setSelectedYearSectionForDisplay(year.year + " - " + year.section)
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmEnroll = async () => {
    const token = localStorage.getItem("auth-token");
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);

    try {
      const res = await Axios.post("http://localhost:5001/api/enrolledsubjects", formData, { headers });
      setLoading(false);
      setEnrolledsubjectss(enrolledsubjects, res.data);
      toast.success("Enrolled successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error Enrolling:", error);
      toast.error("Error Enrolling");
    } finally {
      handleCloseModal(); // Close the confirmation modal after deletion
    }
  };

  const checker  = () => {
	return enrolledsubjects.some((subject) => subject.student_id._id === userData.student_id && subject.year_section._id === selectedYearSection && subject.is_enrolled === "Y")
  }

  return (
    <div className="container mx-4 p-4">
      <h3>Class Subjects</h3>
      <div className="action-button" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5>Selected Year Section: {selectedYearSectionForDisplay}</h5>
        {!checker() ? (
          <Bootstrap.Button variant="primary" onClick={() => handleShowModal("Add")}>
            <FaPlus size="1em" style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Enroll
          </Bootstrap.Button>
        ) : (
          <Bootstrap.Button variant="primary" onClick={() => handleShowModal("Add")} disabled>
            <FaPlus size="1em" style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Enroll
          </Bootstrap.Button>
        )}
      </div>
      <div className="row">
        {/* First Table Section */}
        <div className="col-md-3">
          <Bootstrap.Table responsive className="table table-striped table-hover mt-3">
            <thead>
              <tr>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {yearsections.map((yearsection, index) => (
                <tr onClick={() => handleRowClick(yearsection)}>
                  <td>{yearsection.year + " - " + yearsection.section }</td>
                </tr>
              ))}
            </tbody>
          </Bootstrap.Table>
        </div>

        {/* Second Table Section */}
        <div className="col-md-9">
          <Bootstrap.Table responsive className="table table-striped table-hover mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject Name</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {Subjects.map((subject, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{subject.label}</td>
                  <td>
					{checker() ?
                    <FaCheckCircle style={{ cursor: "pointer", color: "blue", paddingLeft: 2 }} /> 
					:
					<FaTimes style={{ cursor: "pointer", color: "red", paddingLeft: 2 }} /> 
					}
                  </td>
                </tr>
              ))}
              {/* Add more rows here */}
            </tbody>
          </Bootstrap.Table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to enroll?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmEnroll}>
            {loading ? (
              <Bootstrap.Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
            ) : (
              ""
            )}
            Enroll
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Subjects;
