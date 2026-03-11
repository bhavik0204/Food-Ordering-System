import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    address: "",
    phoneNumber: "",
    ownerId: "",
    isActive: true,
  });

  // const url = "http://localhost:8083";
  const url = `${process.env.REACT_APP_API_URL}`;

  const fetchRestaurants = async () => {
    const freshToken = localStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/api/admin/restaurants`, {
        headers: { Authorization: `Bearer ${freshToken}` },
      });
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Error fetching restaurants");
    }
  };

  const fetchUsers = async () => {
    const freshToken = localStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/api/admin/users`, {
        headers: { Authorization: `Bearer ${freshToken}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewRestaurant({
      name: "",
      description: "",
      address: "",
      phoneNumber: "",
      ownerId: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (res) => {
    setIsEditing(true);
    setEditingId(res.id);
    setNewRestaurant({
      name: res.name,
      description: res.description,
      address: res.address,
      phoneNumber: res.phoneNumber,
      ownerId: res.ownerId,
      isActive: res.isActive,
    });
    setImage(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this restaurant? This cannot be undone.",
      )
    )
      return;

    const freshToken = localStorage.getItem("token");
    try {
      await axios.delete(`${url}/api/admin/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${freshToken}` },
      });
      toast.success("Restaurant deleted successfully");
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Error deleting restaurant");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const freshToken = localStorage.getItem("token");

    const formData = new FormData();
    formData.append(
      "restaurant",
      new Blob([JSON.stringify(newRestaurant)], { type: "application/json" }),
    );
    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEditing) {
        await axios.put(`${url}/api/admin/restaurants/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${freshToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Restaurant updated successfully");
      } else {
        await axios.post(`${url}/api/admin/restaurants`, formData, {
          headers: {
            Authorization: `Bearer ${freshToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Restaurant created successfully");
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error(
        "Error saving restaurant: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Restaurants</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-2"></i> Add Restaurant
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm bg-white">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Owner ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>
                  <img
                    src={res.imageUrl || "https://via.placeholder.com/50"}
                    alt={res.name}
                    className="rounded"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{res.name}</td>
                <td>{res.ownerId}</td>
                <td>
                  <span
                    className={`badge ${res.isActive ? "bg-success" : "bg-danger"}`}
                  >
                    {res.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEditModal(res)}
                  >
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(res.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No restaurants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit Restaurant" : "Add New Restaurant"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Restaurant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newRestaurant.name}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newRestaurant.address}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newRestaurant.description}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newRestaurant.phoneNumber}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Owner</label>
                    <select
                      className="form-select"
                      required
                      value={newRestaurant.ownerId || ""}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          ownerId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select an owner</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={newRestaurant.isActive}
                      onChange={(e) =>
                        setNewRestaurant({
                          ...newRestaurant,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active Status
                    </label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Restaurant Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    {isEditing && !image && newRestaurant.imageUrl && (
                      <small className="text-muted text-truncate d-block mt-1">
                        Leave empty to keep current image
                      </small>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;
