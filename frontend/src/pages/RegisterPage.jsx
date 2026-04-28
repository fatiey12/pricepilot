import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      navigate("/");

    } catch {
      setMessage("Registration failed");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <h1>PricePilot</h1>
        <p>
          Join thousands of users comparing prices
          and tracking the best online deals.
        </p>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <p className="auth-sub">
            Start comparing smarter
          </p>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button>
            Register
          </button>

          {message && (
            <p className="auth-error">{message}</p>
          )}

          <p className="auth-link">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>

    </div>
  );
}