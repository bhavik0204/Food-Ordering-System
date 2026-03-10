import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../service/authService";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
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
        toast.success("Registration completed. Please login.");
        navigate("/login");
      } else {
        toast.error("Unable to register. Please try again");
      }
    } catch (error) {
      toast.error("Unable to register. Please try again");
    }
  };

  return (
    <div className="register-container">
      <div className="auth-card shadow-lg">
        <div className="text-center mb-4 auth-header">
          <i className="bi bi-person-plus-fill"></i>
          <h2 className="auth-title mt-2">Sign Up</h2>
          <p className="text-muted small">Join our foodie community</p>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">I am a...</label>
            <select
              className="form-select"
              name="role"
              onChange={onChangeHandler}
              value={data.role}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Create Account</button>
            <Link to="/login" className="btn btn-outline-secondary">Already have an account? Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
