import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

import { generateToken, listenForMessages } from "../firebase";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [product, setProduct] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cellStyle = {
    padding: "14px",
    borderBottom: "1px solid #eee",
    textAlign: "left"
  };


  //
  useEffect(() => {
    const savedResults = localStorage.getItem("searchResults");
    const savedProduct = localStorage.getItem("searchedProduct");

    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    if (savedProduct) {
      setProduct(savedProduct);
    }
  }, []);
//notification thingy
  useEffect(() => {
  const setupNotifications = async () => {
    try {
      const fcmToken = await generateToken();

      if (fcmToken) {
        await axios.post(
          "http://localhost:5000/api/save-token",
          { fcmToken },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }

      listenForMessages(setMessage);

    } catch (error) {
      console.log("Notification setup skipped");
    }
  };

  setupNotifications();
}, []);

  //
  const searchProduct = async () => {
    if (!product.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/search?product=${product}`
      );

      const fetchedResults = res.data.results || [];

      setResults(fetchedResults);

      localStorage.setItem(
        "searchResults",
        JSON.stringify(fetchedResults)
      );

      localStorage.setItem(
        "searchedProduct",
        product
      );

      if (fetchedResults.length === 0) {
        setMessage("No products found.");
        setTimeout(() => setMessage(""), 2000);
      }

    } catch (error) {
      console.log(error);
      setResults([]);
      setMessage("Search failed.");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };
//
  const addToWatchlist = async (item) => {
    try {
      await axios.post(
        "http://localhost:5000/api/watchlist",
        {
          productName: item.title,
          store: item.store,
          price: item.price
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage("Added to Watchlist.");
      setTimeout(() => setMessage(""), 2000);

    } catch (error) {
      console.log(error);
      setMessage("Failed to add.");
      setTimeout(() => setMessage(""), 2000);
    }
  };
//
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
//

  return (
    <div className="dashboard-layout">

      <div className="sidebar">
        <div className="logo">PricePilot</div>

        <div className="nav-item active-nav">
          Dashboard
        </div>

        <div
          className="nav-item"
          onClick={() => navigate("/watchlist")}
        >
          Watchlist
        </div>

        <div
          className="nav-item"
          onClick={logout}
        >
          Logout
        </div>
      </div>

      <div className="main-content">

        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: "#777", marginTop: "10px" }}>
              Compare prices across trusted stores
            </p>
          </div>

          <div className="user-box">
            Fatima
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-title">Searches</div>
            <div className="stat-value">24</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Watchlist</div>
            <div className="stat-value">8</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Stores</div>
            <div className="stat-value">2+</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Best Savings</div>
            <div className="stat-value">$120</div>
          </div>

        </div>

        <div className="search-box">
          <h3>Find Best Deals</h3>

          <div className="search-row">
            <input
              placeholder="Search iPhone, Laptop, PS5..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && searchProduct()
              }
            />

            <button onClick={searchProduct}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {message && (
          <div className="success-msg">
            {message}
          </div>
        )}

        <div className="results-grid">

          {results.map((item, index) => (
            <div
              className="result-card"
              key={index}
            >
              <div className="badge">
                Best Deal
              </div>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="product-img"
                />
              )}

              <h3 className="product-title">
                {item.title}
              </h3>

              <p className="store">
                {item.store}
              </p>

              <div className="price">
                ${item.price}
              </div>

              <div className="rating">
                {item.rating || 4.0}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  flexWrap: "wrap"
                }}
              >
                <button
                  onClick={() => addToWatchlist(item)}
                >
                  Watchlist
                </button>

                <button
                  onClick={() =>
                    navigate(`/history/${item.id}`)
                  }
                  style={{
                    background: "#111827",
                    color: "white"
                  }}
                >
                  History
                </button>
              </div>
            </div>
          ))}

        </div>

        {results.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ marginBottom: "15px" }}>
              Price Comparison Table
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#111827",
                      color: "white"
                    }}
                  >
                    <th style={cellStyle}>Product</th>
                    <th style={cellStyle}>Store</th>
                    <th style={cellStyle}>Price</th>
                    <th style={cellStyle}>Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((item, index) => (
                    <tr key={index}>
                      <td style={cellStyle}>
                        {item.title}
                      </td>

                      <td style={cellStyle}>
                        {item.store}
                      </td>

                      <td style={cellStyle}>
                        ${item.price}
                      </td>

                      <td style={cellStyle}>
                        {item.rating || 4.0}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}