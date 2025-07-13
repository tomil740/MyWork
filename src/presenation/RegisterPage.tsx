import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./style/authintication.css";
import useAuth from "../domain/usecase/useAuth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setFormError("Name is required.");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormError("Invalid email address.");
      return false;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return false;
    }
    setFormError(""); // Clear previous errors
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await register(email, password, name); // Updated to include distributor pick
    if (!error) navigate(-1); // Navigate back or to the homepage
  };

  return (
    <div className="register-container">
      <h1>Register</h1>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
        {formError && <p className="error-message">{formError}</p>}
        {error && <p className="error-message">Error: {error}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="navigate-message">
        Already have an account?{" "}
        <Link to="/Login" className="navigate-link">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
