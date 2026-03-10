import React, { useContext, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../service/authService";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, setRole, loadCartData } = useContext(StoreContext);
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
        const { token, role, username } = response.data;
        setToken(token);
        setRole(role);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", username);
        await loadCartData(token);

        if (role === "ADMIN") {
          window.location.href = `http://localhost:5174?token=${token}&role=${role}`; // Admin panel URL
        } else if (role === "RESTAURANT_OWNER") {
          window.location.href = `http://localhost:5175?token=${token}&role=${role}`; // Restaurant portal URL
        } else {
          navigate("/");
        }
      } else {
        toast.error("Unable to login. Please try again.");
      }
    } catch (error) {
      console.log("Unable to login", error);
      toast.error("Unable to login. Please try again");
    }
  };
  return (
    <div className="login-container">
      <div className="auth-card shadow-lg">
        <div className="text-center mb-4 auth-header">
          <i className="bi bi-person-circle"></i>
          <h2 className="auth-title mt-2">Sign In</h2>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
          </div>
          <div className="mb-4">
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
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">Sign In</button>
            <Link to="/register" className="btn btn-outline-secondary">Create New Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
