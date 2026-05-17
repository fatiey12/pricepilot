import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { generateToken } from "../firebase";
import "../styles/Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // STEP 1: Login user first
      const res = await axios.post(
        "http://10.0.2.2:5000/api/auth/login",
        form
      );

      const jwtToken = res.data.token;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // STEP 2: Go to dashboard immediately
      navigate("/dashboard");

      // STEP 3: Save FCM token in background (don't block login)
      try {
        const fcmToken = await generateToken();

        if (fcmToken) {
          await axios.post(
            "http://10.0.2.2:5000/api/save-token",
            { fcmToken },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`
              }
            }
          );

          console.log("FCM token saved");
        }
      } catch (notifError) {
        console.log("Notification setup skipped:", notifError);
      }

    } catch (error) {
      console.log(error);
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <h1>PricePilot</h1>
        <p>
          Compare product prices across trusted stores,
          save your favorite deals, and shop smarter.
        </p>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={handleLogin}>

          <h2>Welcome Back</h2>

          <p className="auth-sub">
            Login to continue
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button>
            Login
          </button>

          {message && (
            <p className="auth-error">
              {message}
            </p>
          )}

          <p className="auth-link">
            No account? <Link to="/register">Register</Link>
          </p>

        </form>
      </div>

    </div>
  );
}