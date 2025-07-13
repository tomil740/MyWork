import React, {  useState } from "react";
import {  useNavigate } from "react-router-dom";
import "./style/authintication.css";
import useAuth from "../domain/usecase/useAuth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    // Proceed with login
    const a = await login(email, password);
    if (a) navigate("/");
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input ${emailError ? "input-error" : ""}`}
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-input ${passwordError ? "input-error" : ""}`}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        {error && <p className="error-message">Error: {error}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
