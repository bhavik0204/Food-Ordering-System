import React, { useState } from "react";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await login(data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.username);
        toast.success("Login successful!");
        window.location.reload(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="text-center mb-4 auth-header">
          <i className="bi bi-shop"></i>
          <h2 className="auth-title mt-2">Owner Login</h2>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" name="email" className="form-control" required
              value={data.email} onChange={onChangeHandler} placeholder="owner@restaurant.com" />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" required
              value={data.password} onChange={onChangeHandler} placeholder="••••••••" />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Login</button>
            <Link to="/register" className="btn btn-outline-secondary">Register New Owner</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
