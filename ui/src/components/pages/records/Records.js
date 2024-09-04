import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../../../context/UserContext";
import Nav from "react-bootstrap/Nav";
import { toast, ToastContainer } from "react-toastify";
import * as Bootstrap from "react-bootstrap";
import "./records.styles.css";

const Records = () => {
  const { userData } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [enrolledsubjects, setEnrolledsubjectss] = useState([]);
  const [activeTab, setActiveTab] = useState("Junior High");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    student_id: "",
    student_id_number: "",
    student_name: "",
    student_year_section: "",
  });
  const [studgrades, setStudGrades] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await Axios.get("http://localhost:5001/api/students", {
          headers,
        });
        setStudents(res.data);
        setSelectedData({
          ...selectedData,
          student_id: res.data[0]._id,
          student_id_number: res.data[0].id_number,
          student_name: res.data[0].first_name + " " + res.data[0].middle_name + " " + res.data[0].last_name,
        });
        const res2 = await Axios.get("http://localhost:5001/api/enrolledsubjects", {
          headers,
        });
        setEnrolledsubjectss(res2.data);
        const res3 = await Axios.get("http://localhost:5001/api/grades", {
          headers,
        });
        setGrades(res3.data);
        const subjectsList = ["Filipino", "English", "Math", "MAPEH", "Science", "HEKASI"];

        const convertedData = res3.data.reduce((acc, item) => {
          const gradesWithId = [item.first, item.second, item.third, item.fourth].map(Number);
          gradesWithId.push(item._id);

          acc[item.subject] = gradesWithId;
          return acc;
        }, {});

        const completeGrades = subjectsList.reduce(
          (acc, subject) => {
            acc[subject] = convertedData[subject] || [0, 0, 0, 0, "0"]; // Ensure every subject has an array
            return acc;
          },
          { id_number: res3.data[0].student_id.id_number }
        );

        setStudGrades(completeGrades);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const handleEditClick = () => {
    if (isEditing) {
      saveGrades();
    }
    setIsEditing(!isEditing);
  };

  const saveGrades = async () => {
    Object.keys(studgrades).forEach((subject) => {
      if (Array.isArray(studgrades[subject])) {
        const grades = studgrades[subject].slice(0, -1);
        const subjectId = studgrades[subject].slice(-1)[0];
        saveGradeForSubject(subject, grades, subjectId,enrolledsubjects[checker()]?.year_section._id, selectedData.student_id);
      }
    });
  };

  const saveGradeForSubject = async (subject, grades, gradesid,year_section, student_id) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const hasNonZero = grades.some(grade => grade !== 0);
      const formData = {
        year_section,
        student_id,
        subject,
        grades,
        gradesid,
      };
      console.log("$$formdata", formData);

      if (gradesid === "0" && hasNonZero) {
        const res = await Axios.post(
          "http://localhost:5001/api/grades",
          formData,
          { headers }
        );
      } else if (gradesid !== "0") { 
        const res = await Axios.put(
					`http://localhost:5001/api/grades/${formData.gradesid}`,
					formData,
					{ headers }
				);
      }

      // setYearsections((prevYearsections) => [...prevYearsections, res.data]);
      toast.success("Year and Section added successfully");
    } catch (error) {
      console.error(`Error saving grades for ${subject}:`, error);
      toast.error(`Failed to save grades for ${subject}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (subject, termIndex, event) => {
    const newValue = event.target.value;

    if (/^\d{0,2}$/.test(newValue)) {
      setStudGrades((prevStudGrades) => {
        const updatedGrades = [...prevStudGrades[subject]];
        updatedGrades[termIndex] = newValue;
        return {
          ...prevStudGrades,
          [subject]: updatedGrades,
        };
      });
    }
  };

  const handleRowClick = (student) => {
    setSelectedData({
      ...selectedData,
      student_id: student._id,
      student_id_number: student.id_number,
      student_name: student.first_name + " " + student.middle_name + " " + student.last_name,
    });
  };

  const checker = () => {
    return enrolledsubjects.findIndex((subject) => subject.student_id._id === selectedData.student_id && subject.is_enrolled === "Y");
  };

  return (
    <div className="container mx-6 p-4">
      <Bootstrap.Row>
        <Bootstrap.Col md={4}>
          <Bootstrap.Table responsive className="table table-striped table-hover mt-3">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Year and Section</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} onClick={() => handleRowClick(student)}>
                  <td>{student.id_number}</td>
                  <td>{student.first_name + " " + student.middle_name + " " + student.last_name}</td>
                  <td>{student.year_section.year + " - " + student.year_section.section}</td>
                </tr>
              ))}
            </tbody>
          </Bootstrap.Table>
        </Bootstrap.Col>

        <Bootstrap.Col md={8}>
          {/* <Nav fill variant="tabs" defaultActiveKey="/home" onSelect={handleTabSelect}>
            <Nav.Item>
              <Nav.Link eventKey="Junior High">Junior High</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Senior High">Senior High</Nav.Link>
            </Nav.Item>
          </Nav> */}

          <div className="mt-2">
            <Bootstrap.Card>
              <Bootstrap.Card.Body>
                {/* <Bootstrap.ButtonToolbar aria-label="Toolbar with button groups" className="button-toolbar">
                  <Bootstrap.ButtonGroup className="me-2 d-flex align-items-center" aria-label="First group">
                    <span className="me-2 fw-bold">Grade:</span>
                    <Bootstrap.Form.Select aria-label="Default select example">
                      <option>Select Year</option>
                      {activeTab === "Senior High" ? (
                        <>
                          <option value="11">Grade 11</option>
                          <option value="12">Grade 12</option>
                        </>
                      ) : (
                        <>
                          <option value="7">Grade 7</option>
                          <option value="8">Grade 8</option>
                          <option value="9">Grade 9</option>
                          <option value="10">Grade 10</option>
                        </>
                      )}
                    </Bootstrap.Form.Select>
                  </Bootstrap.ButtonGroup>
                  <Bootstrap.ButtonGroup className="me-2 d-flex align-items-center" aria-label="First group">
                    <span className="me-2 fw-bold">Section:</span>
                    <Bootstrap.Form.Select aria-label="Default select example">
                      <option>Select Section</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Bootstrap.Form.Select>
                  </Bootstrap.ButtonGroup>
                </Bootstrap.ButtonToolbar> */}

                <h5>
                  Enrolled Grade and Section:{" "}
                  {enrolledsubjects[checker()]?.year_section.year + " - " + enrolledsubjects[checker()]?.year_section.section}
                </h5>
              </Bootstrap.Card.Body>
            </Bootstrap.Card>

            <Bootstrap.Card className="mt-2 h-100">
              <Bootstrap.Card.Body>
                <Bootstrap.Container>
                  <Bootstrap.Row>
                    <Bootstrap.Col>
                      <Bootstrap.Card className="d-flex flex-column h-100">
                        <Bootstrap.Card.Header className="card-header-toolbar">
                          <Bootstrap.Button variant="secondary" className="card-header-button" size="sm" onClick={handleEditClick}>
                            {isEditing ? "Save" : "Edit"}
                          </Bootstrap.Button>
                        </Bootstrap.Card.Header>
                        <Bootstrap.Card.Body className="student-info flex-grow-1">
                          <h5>{selectedData.student_name}</h5>
                          ID : {selectedData.student_id_number} <br />
                          <Bootstrap.Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th></th>
                                <th>1st</th>
                                <th>2nd</th>
                                <th>3rd</th>
                                <th>4th</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(studgrades).map(
                                (subject, idx) =>
                                  Array.isArray(studgrades[subject]) ? (
                                    <tr key={idx}>
                                      <td>{subject.toUpperCase()}</td>
                                      {studgrades[subject].slice(0, -1).map((studgrade, termIndex) => (
                                        <td key={termIndex}>
                                          {isEditing && termIndex >= 0 ? (
                                            <Bootstrap.Form.Control
                                              type="text"
                                              value={studgrade}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                // Check if the value is a number and has a maximum of 2 digits
                                                if (/^\d{0,2}$/.test(value)) {
                                                  handleGradeChange(subject, termIndex, e);
                                                }
                                              }}
                                            />
                                          ) : (
                                            studgrade
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ) : null // Ignore non-array keys like id_number
                              )}
                            </tbody>
                          </Bootstrap.Table>
                        </Bootstrap.Card.Body>
                      </Bootstrap.Card>
                    </Bootstrap.Col>
                    <Bootstrap.Col>
                      <Bootstrap.Card className="d-flex flex-column h-100">
                        <Bootstrap.Card.Body className="flex-grow-1">
                          Miscellaneous Fee: <br />
                          <Bootstrap.Container className="mt-4">
                            <Bootstrap.Row>
                              <Bootstrap.Col>Monthly Exam</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row>
                              <Bootstrap.Col>Computer Lab Fee</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row>
                              <Bootstrap.Col>Science Lab Fee</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row>
                              <Bootstrap.Col>Books</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row>
                              <Bootstrap.Col>Pass Book</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row>
                              <Bootstrap.Col>Student ID</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                            <Bootstrap.Row className="mt-2">
                              <Bootstrap.Col>TOTAL</Bootstrap.Col>
                              <Bootstrap.Col>₱ 20.00</Bootstrap.Col>
                            </Bootstrap.Row>
                          </Bootstrap.Container>
                        </Bootstrap.Card.Body>
                      </Bootstrap.Card>
                    </Bootstrap.Col>
                  </Bootstrap.Row>
                </Bootstrap.Container>
              </Bootstrap.Card.Body>
            </Bootstrap.Card>
          </div>
        </Bootstrap.Col>
      </Bootstrap.Row>
    </div>
  );
};

export default Records;
