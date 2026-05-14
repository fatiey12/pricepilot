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

  const featuredProducts = [
    {
      title: "iPhone 15 Pro",
      price: 999,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
      store: "MercadoLibre"
    },
    {
      title: "PlayStation 5",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
      store: "DummyJSON"
    },
    {
      title: "MacBook Air M3",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
      store: "MercadoLibre"
    },
    {
      title: "AirPods Pro",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",
      store: "DummyJSON"
    }
  ];

  const cellStyle = {
    padding: "14px",
    borderBottom: "1px solid #eee",
    textAlign: "left"
  };

  const bestDeal =
    results.length > 0
      ? results.reduce((min, item) =>
          item.price < min.price ? item : min
        )
      : null;

  useEffect(() => {

    const savedResults =
      localStorage.getItem("searchResults");

    const savedProduct =
      localStorage.getItem("searchedProduct");

    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    if (savedProduct) {
      setProduct(savedProduct);
    }

  }, []);

  useEffect(() => {

    const setupNotifications = async () => {

      try {

        const fcmToken =
          await generateToken();

        if (fcmToken) {

          await axios.post(
            "http://localhost:5000/api/save-token",
            { fcmToken },
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
        }

        listenForMessages(setMessage);

      } catch (error) {

        console.log(
          "Notification setup skipped"
        );
      }
    };

    setupNotifications();

  }, []);

  const searchProduct = async () => {

    if (!product.trim()) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/search?product=${product}`
      );

      const fetchedResults =
        res.data.results || [];

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

        setTimeout(() => {
          setMessage("");
        }, 2000);
      }

    } catch (error) {

      console.log(error);

      setResults([]);

      setMessage("Search failed.");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } finally {

      setLoading(false);
    }
  };

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
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage("Added to Watchlist.");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (error) {

      console.log(error);

      setMessage("Failed to add.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <div className="dashboard-layout">

      {/* Sidebar */}
      <div className="sidebar">

        <div className="logo">
          PricePilot
        </div>

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

      {/* Main Content */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">

          <div>

            <h1>Dashboard</h1>

            <p
              style={{
                color: "#777",
                marginTop: "10px"
              }}
            >
              Compare prices across trusted stores
            </p>

          </div>

          <div className="user-box">
            Fatima
          </div>

        </div>

        {/* Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-title">
              Results
            </div>

            <div className="stat-value">
              {results.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Watchlist
            </div>

            <div className="stat-value">
              8
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Stores
            </div>

            <div className="stat-value">
              {
                new Set(
                  results.map((item) => item.store)
                ).size
              }
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">
              Lowest Price
            </div>

            <div className="stat-value">
              {bestDeal
                ? `$${bestDeal.price}`
                : "$0"}
            </div>
          </div>

        </div>

        {/* Marketplace Section */}
        <div style={{ marginBottom: "35px" }}>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px"
            }}
          >

            <div>

              <h2>
                Trending Deals
              </h2>

              <p style={{ color: "#777" }}>
                Popular products across marketplaces
              </p>

            </div>

            <div
              style={{
                background: "#111827",
                color: "white",
                padding: "8px 14px",
                borderRadius: "20px",
                fontSize: "14px"
              }}
            >
              Live Marketplace Data
            </div>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px"
            }}
          >

            {featuredProducts.map((item, index) => (

              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.08)"
                }}
              >

                <div
                  style={{
                    position: "relative"
                  }}
                >

                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "#10b981",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    Trending
                  </div>

                </div>

                <div style={{ padding: "16px" }}>

                  <h3
                    style={{
                      marginBottom: "10px"
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      color:
                        item.store === "MercadoLibre"
                          ? "#eab308"
                          : "#2563eb",
                      fontWeight: "600",
                      marginBottom: "12px"
                    }}
                  >
                    {item.store}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >

                    <h2>${item.price}</h2>

                    <button
                      style={{
                        background: "#111827",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer"
                      }}
                    >
                      View Deal
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Search */}
        <div className="search-box">

          <h3>
            Find Best Deals
          </h3>

          <div className="search-row">

            <input
              placeholder="Search iPhone, Laptop, PS5..."
              value={product}
              onChange={(e) =>
                setProduct(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                searchProduct()
              }
            />

            <button onClick={searchProduct}>
              {
                loading
                  ? "Searching..."
                  : "Search"
              }
            </button>

          </div>

        </div>

        {/* Message */}
        {message && (
          <div className="success-msg">
            {message}
          </div>
        )}

        {/* Smart Recommendation */}
        {bestDeal && (

          <div
            style={{
              background:
                "linear-gradient(to right, #111827, #1f2937)",
              color: "white",
              padding: "20px",
              borderRadius: "16px",
              marginBottom: "25px",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.15)"
            }}
          >

            <h2
              style={{
                marginBottom: "10px"
              }}
            >
              Smart Recommendation
            </h2>

            <p
              style={{
                fontSize: "16px"
              }}
            >
              Best current deal found at{" "}
              <strong>
                {bestDeal.store}
              </strong>
            </p>

            <p
              style={{
                marginTop: "8px"
              }}
            >
              Lowest available price:
              <strong>
                {" "}$
                {bestDeal.price}
              </strong>
            </p>

            <p
              style={{
                marginTop: "8px",
                color: "#34d399"
              }}
            >
              Recommendation: Buy Now
            </p>

          </div>
        )}

        {/* Product Cards */}
        <div className="results-grid">

          {results.map((item, index) => (

            <div
              className="result-card"
              key={index}
              style={{
                border:
                  bestDeal?.price === item.price
                    ? "2px solid #10b981"
                    : "none"
              }}
            >

              {bestDeal?.price === item.price && (

                <div
                  className="badge"
                  style={{
                    background: "#10b981"
                  }}
                >
                  Best Deal
                </div>
              )}

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

              <p
                className="store"
                style={{
                  fontWeight: "600",
                  color:
                    item.store === "MercadoLibre"
                      ? "#eab308"
                      : "#2563eb"
                }}
              >
                {item.store}
              </p>

              <div className="price">
                ${item.price}
              </div>

              <div className="rating">
                ⭐ {item.rating || 4.0}
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
                  onClick={() =>
                    addToWatchlist(item)
                  }
                >
                  Watchlist
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/history/${item.id || index}`
                    )
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

        {/* Comparison Table */}
        {results.length > 0 && (

          <div
            style={{
              marginTop: "40px"
            }}
          >

            <h2
              style={{
                marginBottom: "15px"
              }}
            >
              Price Comparison Table
            </h2>

            <div
              style={{
                overflowX: "auto"
              }}
            >

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

                    <th style={cellStyle}>
                      Product
                    </th>

                    <th style={cellStyle}>
                      Store
                    </th>

                    <th style={cellStyle}>
                      Price
                    </th>

                    <th style={cellStyle}>
                      Rating
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {results.map((item, index) => (

                    <tr
                      key={index}
                      style={{
                        background:
                          bestDeal?.price === item.price
                            ? "#ecfdf5"
                            : "white"
                      }}
                    >

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
                        ⭐ {item.rating || 4.0}
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