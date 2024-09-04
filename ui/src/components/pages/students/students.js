import React, { useEffect, useState, useContext } from "react";
import * as Bootstrap from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal, Form } from "react-bootstrap";
import Axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [yearsections, SetYearsections] = useState([]);
  const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
  const [formData, setFormData] = useState({
    _id: "",
    id_number: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    year_section: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null); // State to track the user ID to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await Axios.get("http://localhost:5001/api/students", {
          headers,
        });
        setStudents(res.data);
		
        const res2 = await Axios.get("http://localhost:5001/api/yearsections", {
          headers,
        });
        SetYearsections(res2.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowDeleteModal = (id) => {
    setStudentIdToDelete(id); // Set the user ID to delete
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowModal = (type, student = {}) => {
    setModalType(type);
    setFormData({
      _id: student._id || "",
      id_number: student.id_number || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      middle_name: student.middle_name || "",
      email: student.email || "",
      year_section: student.year_section || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth-token");
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);
    try {
      if (modalType === "Add") {
        const res = await Axios.post("http://localhost:5001/api/students", formData, { headers });
        setLoading(false);
        setStudents([...students, res.data]);

        toast.success("Student added successfully");
      } else {
        const { password, ...updateData } = formData; // Exclude password from update data
        const res = await Axios.put(`http://localhost:5001/api/students/${formData._id}`, updateData, { headers });
        setLoading(false);
        setStudents(students.map((student) => (student._id === formData._id ? res.data : student)));

        // console.log("$$asdfafd", res);
        toast.success("Student updated successfully");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving Student:", error);
      toast.error("Error saving Student: " + error.response.data.err);
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("auth-token");
    const headers = { Authorization: `Bearer ${token}` };

    setLoading(true);

    try {
      await Axios.delete(`http://localhost:5001/api/students/${studentIdToDelete}`, {
        headers,
      });
      setLoading(false);
      setStudents(students.filter((user) => user._id !== studentIdToDelete));
      toast.success("Student deleted successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error deleting Student:", error);
      toast.error("Error deleting Student");
    } finally {
      handleCloseDeleteModal(); // Close the confirmation modal after deletion
    }
  };

  return (
    <div className="container mx-4 p-4">
      <h3>Enrolled Students</h3>
      <div className="action-button">
        <Bootstrap.Button variant="primary" onClick={() => handleShowModal("Add")}>
          <FaPlus size="1em" style={{ marginRight: "10px", verticalAlign: "middle" }} />
          Add Student
        </Bootstrap.Button>
      </div>
      <Bootstrap.Table responsive className="table table-striped table-hover mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>ID Number</th>
            <th>Year and Section</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.id_number}</td>
              <td>{student.year_section.year + " - " + student.year_section.section}</td>
              <td>{student.first_name + " " + student.middle_name + " " + student.last_name}</td>
              <td>
                <FaPen
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: "blue",
                  }}
                  onClick={() => handleShowModal("Edit", student)}
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
                  onClick={() => handleShowDeleteModal(student._id)} // Open delete confirmation modal
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Bootstrap.Table>

      {/* User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType} Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Year and Section</Form.Label>
              <Form.Select value={formData.year_section._id} onChange={(e) => setFormData({ ...formData, year_section: e.target.value })} required>
                <option value="">Select Year Section</option>
                {yearsections.map((yearsection, index) => (
                  <option key={index} value={yearsection._id}>
                    {yearsection.year + " - " + yearsection.section}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>ID Number</Form.Label>
              <Form.Control
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </Form.Group> */}
            <div className="action-button">
              <Button variant="primary" type="submit" className="mt-3">
                {loading ? (
                  <Bootstrap.Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
                ) : (
                  ""
                )}
                {modalType === "Add" ? "Add Student" : "Update Student"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Student?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {loading ? (
              <Bootstrap.Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: "10px" }} />
            ) : (
              ""
            )}
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Students;
