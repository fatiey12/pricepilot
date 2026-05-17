import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  generateToken,
  listenForMessages
} from "../firebase";

import "../styles/Dashboard.css";

export default function DashboardPage() {

  const navigate = useNavigate();

  const [product, setProduct] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // FEATURED PRODUCTS
  // ============================================

  const featuredProducts = [

    {
      title: "iPhone 15 Pro",
      price: 999,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop"
    },

    {
      title: "PlayStation 5",
      price: 499,
      image:
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop"
    },

    {
      title: "Sony Headphones",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  // ============================================
  // BEST DEAL
  // ============================================

  const bestDeal =
    results.length > 0
      ? results.reduce((min, item) =>
          item.price < min.price ? item : min
        )
      : null;

  // ============================================
  // LOAD SAVED SEARCH
  // ============================================

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

  // ============================================
  // FIREBASE NOTIFICATIONS
  // ============================================

  useEffect(() => {

    const setupNotifications = async () => {

      try {

        // Generate FCM Token
        const token = await generateToken();

        console.log("FCM Token:", token);

        // Listen for foreground messages
        listenForMessages();

      } catch (error) {

        console.log(
          "Notifications unavailable:",
          error
        );
      }
    };

    setupNotifications();

  }, []);

  // ============================================
  // SEARCH
  // ============================================

  const searchProduct = async () => {

    if (!product.trim()) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `http://10.0.2.2:5000/api/search?product=${product}`
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

        setMessage("No products found");

        setTimeout(() => {
          setMessage("");
        }, 2000);
      }

    } catch (error) {

      console.log(error);

      setResults([]);

      setMessage("Search failed");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } finally {

      setLoading(false);
    }
  };

  // ============================================
  // WATCHLIST
  // ============================================

  const addToWatchlist = async (item) => {

    try {

      await axios.post(
        "http://10.0.2.2:5000/api/watchlist",
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

      setMessage("Added to Watchlist");

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch {

      setMessage("Failed to add");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================

  const logout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <div className="dashboard-container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <p className="welcome-text">
            Welcome Back 👋
          </p>

          <h1 className="dashboard-title">
            PricePilot
          </h1>

        </div>

        <div className="profile-avatar">
          F
        </div>

      </div>

      {/* SEARCH */}

      <div className="search-section">

        <div className="search-bar">

          <input
            type="text"
            placeholder="Search products..."
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
            {loading ? "..." : "Go"}
          </button>

        </div>

      </div>

      {/* CATEGORIES */}

      <div className="categories-row">

        <div className="category-pill">
          Phones
        </div>

        <div className="category-pill">
          Laptops
        </div>

        <div className="category-pill">
          Gaming
        </div>

        <div className="category-pill">
          Audio
        </div>

      </div>

      {/* BEST DEAL */}

      <div className="smart-card">

        <p className="smart-label">
          Smart Price Tracking
        </p>

        <h2>
          {
            bestDeal
              ? `Best deal from $${bestDeal.price}`
              : "Track Prices Instantly"
          }
        </h2>

      </div>

      {/* TRENDING */}

      <div className="section-header">

        <h2>
          Trending Deals
        </h2>

      </div>

      <div className="featured-scroll">

        {featuredProducts.map((item, index) => (

          <div
            className="featured-card"
            key={index}
          >

            <img
              src={item.image}
              alt={item.title}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300";
              }}
            />

            <div className="featured-info">

              <h3>
                {item.title}
              </h3>

              <p>
                ${item.price}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* MESSAGE */}

      {message && (

        <div className="message-box">
          {message}
        </div>

      )}

      {/* RESULTS */}

      {results.length > 0 && (

        <>

          <div className="section-header">

            <h2>
              Search Results
            </h2>

          </div>

          <div className="results-grid">

            {results.map((item, index) => (

              <div
                className="result-card"
                key={index}
              >

                {
                  bestDeal?.price === item.price && (

                    <div className="best-deal-badge">
                      Best
                    </div>

                  )
                }

                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/300"
                  }
                  alt={item.title}
                  className="product-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300";
                  }}
                />

                <div className="result-content">

                  <h3>
                    {item.title}
                  </h3>

                  <p className="store-name">
                    {item.store}
                  </p>

                  <div className="price-row">

                    <h2>
                      ${item.price}
                    </h2>

                  </div>

                  <div className="action-buttons">

                    <button
                      onClick={() =>
                        addToWatchlist(item)
                      }
                    >
                      Watchlist
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* COMPARISON TABLE */}

          <div className="comparison-section">

            <div className="section-header">

              <h2>
                Price Comparison
              </h2>

            </div>

            <div className="comparison-table">

              {results.map((item, index) => (

                <div
                  key={index}
                  className="comparison-row"
                >

                  <div className="comparison-left">

                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.title}
                      className="comparison-image"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100";
                      }}
                    />

                    <div className="comparison-info">

                      <h4>
                        {item.title}
                      </h4>

                      <p>
                        {item.store}
                      </p>

                    </div>

                  </div>

                  <div className="comparison-right">

                    <h3>
                      ${item.price}
                    </h3>

                    <span>
                      ⭐ {item.rating || 4.0}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </>

      )}

      {/* BOTTOM NAV */}

      <div className="bottom-nav">

        <div className="bottom-item active-bottom">
          Home
        </div>

        <div
          className="bottom-item"
          onClick={() =>
            navigate("/watchlist")
          }
        >
          Watchlist
        </div>

        <div
          className="bottom-item"
          onClick={logout}
        >
          Logout
        </div>

      </div>

    </div>
  );
}