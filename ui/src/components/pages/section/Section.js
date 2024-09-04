import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import * as Bootstrap from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";


const Section = () => {
	const [yearsections, setYearsections] = useState([]);
	const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
	const [formData, setFormData] = useState({
		_id: "",
		year: "",
		section: "",
	});
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [yearsectionIdToDelete, setYearsectionIdToDelete] = useState(null); // State to track the user ID to delete
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal

	useEffect(() => {
		const fetchYearSection = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/yearsections", {
					headers,
				});
				setYearsections(res.data);
			} catch (error) {
				console.error("Error fetching year and sections:", error);
			}
		};
		fetchYearSection();
	}, []);

	const handleShowModal = (type, yearsection = {}) => {
		setModalType(type);
		setFormData({
			_id: yearsection._id || "",
			year: yearsection.year || "",
			section: yearsection.section || "",
		});
		setShowModal(true);
	};
	
	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			if (modalType === "Add") {
				const res = await Axios.post(
					"http://localhost:5001/api/yearsections",
					formData,
					{ headers }
				);
				setLoading(false);
				setYearsections([...yearsections, res.data]);
				toast.success("Year and Section added successfully");
			} else {
				const { password, ...updateData } = formData; // Exclude password from update data
				const res = await Axios.put(
					`http://localhost:5001/api/yearsections/${formData._id}`,
					updateData,
					{ headers }
				);
				setLoading(false);
				setYearsections(
					yearsections.map((student) => (student._id === formData._id ? res.data : student))
				);
				toast.success("Year and Section updated successfully");
			}
			handleCloseModal();
		} catch (error) {
			console.error("Error saving Year and Section:", error);
			toast.error("Error saving Year and Section: " + error.response.data.err);
		}
	};
	
	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleShowDeleteModal = (id) => {
		setYearsectionIdToDelete(id); // Set the user ID to delete
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			await Axios.delete(`http://localhost:5001/api/yearsections/${yearsectionIdToDelete}`, {
				headers,
			});
			setLoading(false);
			setYearsections(yearsections.filter((user) => user._id !== yearsectionIdToDelete));
			toast.success("Year and Section deleted successfully");
		} catch (error) {
			setLoading(false);
			console.error("Error deleting Year and Section:", error);
			toast.error("Error deleting Year and Section");
		} finally {
			handleCloseDeleteModal(); // Close the confirmation modal after deletion
		}
	};

    return (
		<div className="container mx-4 p-4">
			<h3>Section List</h3>
			<div className="action-button">
			<Bootstrap.Button variant="primary" onClick={() => handleShowModal("Add")}>
					<FaPlus
						size="1em"
						style={{ marginRight: "10px", verticalAlign: "middle" }}
					/>
					Add Year Section
				</Bootstrap.Button>
			</div>
			<Bootstrap.Table
				responsive
				className="table table-striped table-hover mt-3"
			>
				<thead>
					<tr>
						<th>#</th>
						<th>Year</th>
						<th>Section</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
				{yearsections.map((yearsection, index) => (
						<tr key={yearsection._id}>
							<td>{index + 1}</td>
							<td>{yearsection.year}</td>
							<td>{yearsection.section}</td>
							<td>
								<FaPen
									style={{
										cursor: "pointer",
										marginRight: "10px",
										color: "blue",
									}}
									onClick={() => handleShowModal("Edit", yearsection)}
								/>
								<FaTrash
									style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
									onClick={() => handleShowDeleteModal(yearsection._id)} // Open delete confirmation modal
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
							<Form.Label>Year</Form.Label>
							<Form.Control
								type="text"
								value={formData.year}
								onChange={(e) =>
									setFormData({ ...formData, year: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Section</Form.Label>
							<Form.Control
								type="text"
								value={formData.section}
								onChange={(e) =>
									setFormData({ ...formData, section: e.target.value })
								}
								required
							/>
						</Form.Group>
						<div className="action-button">
							<Button variant="primary" type="submit" className="mt-3">
								{loading ? (
									<Bootstrap.Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										style={{ marginRight: "10px" }}
									/>
								) : (
									""
								)}
								{modalType === "Add" ? "Add Year and Section" : "Update Year and Section"}
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
					<p>Are you sure you want to delete this Year and Section?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseDeleteModal}>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleConfirmDelete}>
						{loading ? (
							<Bootstrap.Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								style={{ marginRight: "10px" }}
							/>
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
}

export default Section