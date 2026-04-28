import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function WatchlistPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  const loadWatchlist = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/watchlist",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setItems(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/watchlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadWatchlist();

    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  return (
    <div className="dashboard-layout">

      <div className="sidebar">
        <div className="logo">PricePilot</div>

        <div
          className="nav-item"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>

        <div className="nav-item active-nav">
          Watchlist
        </div>

        <div className="nav-item" onClick={logout}>
          Logout
        </div>
      </div>

      <div className="main-content">

        <div className="topbar">
          <h1>My Watchlist</h1>
          <div className="user-box">Saved Deals</div>
        </div>

        {items.length === 0 ? (
          <div className="search-box">
            <h3>No saved products yet.</h3>
            <p style={{ marginTop: "10px", color: "gray" }}>
              Search products and save them here.
            </p>
          </div>
        ) : (
          <div className="results-grid">
            {items.map((item) => (
              <div className="result-card" key={item._id}>
                <div className="badge">Saved</div>

                <h2>{item.productName}</h2>

                <p style={{ marginTop: "10px" }}>
                  {item.store}
                </p>

                <div className="price">
                  ${item.price}
                </div>

                <button
                  onClick={() => deleteItem(item._id)}
                  style={{
                    background: "#ef4444"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}