import React, { useState } from "react";
import "../Login/Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="text-center mb-4 auth-header">
          <i className="bi bi-person-plus-fill" style={{background: 'linear-gradient(45deg, #28a745, #85ef9e)', WebkitBackgroundClip: 'text'}}></i>
          <h2 className="auth-title mt-2">Registration</h2>
          <p className="text-muted small">Select your role and create an account</p>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" required
              value={data.name} onChange={onChangeHandler} placeholder="John Doe" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" required
              value={data.email} onChange={onChangeHandler} placeholder="email@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" required
              value={data.password} onChange={onChangeHandler} placeholder="••••••••" />
          </div>
          <div className="mb-4">
            <label className="form-label">Role</label>
            <select name="role" className="form-select" required
              value={data.role} onChange={onChangeHandler}>
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" style={{background: 'linear-gradient(45deg, #28a745, #218838)'}}>Sign Up</button>
            <Link to="/login" className="btn btn-outline-secondary">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
