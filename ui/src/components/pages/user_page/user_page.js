import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Bootstrap from "react-bootstrap";
import "./users.styles.css";

const UserList = () => {
	const { userData } = useContext(UserContext);
	const [users, setUsers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
	const [modalType, setModalType] = useState("Add"); // 'Add' or 'Edit'
	const [formData, setFormData] = useState({
		_id: "",
		firstname: "",
		lastname: "",
		email: "",
		username: "",
		password: "", // Include the password field for adding new users
	});
	const [loading, setLoading] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState(null); // State to track the user ID to delete

	useEffect(() => {
		const fetchUsers = async () => {
			const token = localStorage.getItem("auth-token");
			const headers = { Authorization: `Bearer ${token}` };
			try {
				const res = await Axios.get("http://localhost:5001/api/users", {
					headers,
				});
				console.log("Fetched users:", res.data); // Log the fetched data
				setUsers(res.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	const handleShowModal = (type, user = {}) => {
		setModalType(type);
		setFormData({
			_id: user._id || "",
			firstname: user.firstname || "",
			lastname: user.lastname || "",
			email: user.email || "",
			username: user.username || "",
			password: "", // Clear the password field when showing the modal
		});
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleShowDeleteModal = (id) => {
		setUserIdToDelete(id); // Set the user ID to delete
		setShowDeleteModal(true);
	};

	const handleCloseDeleteModal = () => {
		setShowDeleteModal(false);
	};

	const handleConfirmDelete = async () => {
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			await Axios.delete(`http://localhost:5001/api/users/${userIdToDelete}`, {
				headers,
			});
			setLoading(false);
			setUsers(users.filter((user) => user._id !== userIdToDelete));
			toast.success("User deleted successfully");
		} catch (error) {
			setLoading(false);
			console.error("Error deleting user:", error);
			toast.error("Error deleting user");
		} finally {
			handleCloseDeleteModal(); // Close the confirmation modal after deletion
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("auth-token");
		const headers = { Authorization: `Bearer ${token}` };

		setLoading(true);

		try {
			if (modalType === "Add") {
				const res = await Axios.post(
					"http://localhost:5001/api/users",
					formData,
					{ headers }
				);
				setLoading(false);
				setUsers([...users, res.data]);
				toast.success("User added successfully");
			} else {
				const { password, ...updateData } = formData; // Exclude password from update data
				const res = await Axios.put(
					`http://localhost:5001/api/users/${formData._id}`,
					updateData,
					{ headers }
				);
				setLoading(false);
				setUsers(
					users.map((user) => (user._id === formData._id ? res.data : user))
				);
				toast.success("User updated successfully");
			}
			handleCloseModal();
		} catch (error) {
			console.error("Error saving user:", error);
			toast.error("Error saving user");
		}
	};

	return (
		<div className="container mt-4 mx-4 p-4">
			<h3>User List</h3>
			<div className="action-button">
        <Button variant="primary" onClick={() => handleShowModal("Add")}>
        <FaPlus
						size="1em"
						style={{ marginRight: "10px", verticalAlign: "middle" }}
					/>
					Add User
				</Button>
			</div>
			<Bootstrap.Table
				responsive
				className="table table-striped table-hover mt-3"
			>
				<thead>
					<tr>
						<th>#</th>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Email</th>
						<th>Username</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<tr key={user._id}>
							<td>{index + 1}</td>
							<td>{user.firstname}</td>
							<td>{user.lastname}</td>
							<td>{user.email}</td>
							<td>{user.username}</td>
							<td>
								<FaPen
									style={{
										cursor: "pointer",
										marginRight: "10px",
										color: "blue",
									}}
									onClick={() => handleShowModal("Edit", user)}
								/>
								<FaTrash
									style={{ cursor: "pointer", color: "red", paddingLeft: 2 }}
									onClick={() => handleShowDeleteModal(user._id)} // Open delete confirmation modal
								/>
							</td>
						</tr>
					))}
				</tbody>
			</Bootstrap.Table>

			{/* User Modal */}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>{modalType} User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>Firstname</Form.Label>
							<Form.Control
								type="text"
								value={formData.firstname}
								onChange={(e) =>
									setFormData({ ...formData, firstname: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Lastname</Form.Label>
							<Form.Control
								type="text"
								value={formData.lastname}
								onChange={(e) =>
									setFormData({ ...formData, lastname: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								value={formData.username}
								onChange={(e) =>
									setFormData({ ...formData, username: e.target.value })
								}
								required
							/>
						</Form.Group>
						{modalType === "Add" && (
							<Form.Group>
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									required
								/>
							</Form.Group>
						)}
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
								{modalType === "Add" ? "Add User" : "Update User"}
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
					<p>Are you sure you want to delete this user?</p>
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
};

export default UserList;
