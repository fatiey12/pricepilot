import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WatchlistPage() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const token =
    localStorage.getItem("token");

  // =================================================
  // LOAD WATCHLIST
  // =================================================
  const loadWatchlist = async () => {

    try {

      const res = await axios.get(
        "http://10.0.2.2:5000/api/watchlist",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setItems(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // =================================================
  // DELETE ITEM
  // =================================================
  const deleteItem = async (id) => {

    try {

      await axios.delete(
        `http://10.0.2.2:5000/api/watchlist/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      loadWatchlist();

    } catch (error) {

      console.log(error);
    }
  };

  // =================================================
  // LOGOUT
  // =================================================
  const logout = () => {

    localStorage.clear();

    navigate("/");
  };

  useEffect(() => {

    loadWatchlist();

  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "20px",
        paddingBottom: "100px"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: "28px"
        }}
      >

        <div>

          <p
            style={{
              color: "#777",
              marginBottom: "8px"
            }}
          >
            Saved Products
          </p>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700"
            }}
          >
            My Watchlist
          </h1>

        </div>

        <button
          onClick={logout}
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "14px",
            padding: "12px 18px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Logout
        </button>

      </div>

      {/* HERO CARD */}
      <div
        style={{
          background:
            "linear-gradient(to right, #7c3aed, #7c3aed)",
          borderRadius: "24px",
          padding: "24px",
          color: "white",
          marginBottom: "30px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.15)"
        }}
      >

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "10px"
          }}
        >
          Tracked Products
        </p>

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px"
          }}
        >
          {items.length}
        </h1>

        <p
          style={{
            color: "#34d399",
            fontWeight: "600"
          }}
        >
          Price monitoring active
        </p>

      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px 25px",
            textAlign: "center",
            boxShadow:
              "0 6px 18px rgba(0,0,0,0.06)"
          }}
        >

          <h2
            style={{
              marginBottom: "12px"
            }}
          >
            No Saved Products
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: "24px"
            }}
          >
            Start searching and save
            products to monitor price changes.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "14px 20px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Explore Products
          </button>

        </div>

      ) : (

        <>
          {/* WATCHLIST GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px"
            }}
          >

            {items.map((item) => (

              <div
                key={item._id}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "22px",
                  position: "relative",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.06)"
                }}
              >

                {/* BADGE */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "#dcfce7",
                    color: "#10b981",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  Tracking
                </div>

                {/* PRODUCT */}
                <div
                  style={{
                    marginBottom: "20px"
                  }}
                >

                  <h2
                    style={{
                      marginBottom: "10px",
                      fontSize: "22px"
                    }}
                  >
                    {item.productName}
                  </h2>

                  <p
                    style={{
                      color: "#777",
                      marginBottom: "14px"
                    }}
                  >
                    {item.store}
                  </p>

                  <h1
                    style={{
                      fontSize: "34px",
                      color: "#111827"
                    }}
                  >
                    ${item.price}
                  </h1>

                </div>

                {/* BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >

                  <button
                    onClick={() =>
                      navigate(
                        `/history/${item._id}`
                      )
                    }
                    style={{
                      flex: 1,
                      background: "#111827",
                      color: "white",
                      border: "none",
                      borderRadius: "14px",
                      padding: "12px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    History
                  </button>

                  <button
                    onClick={() =>
                      deleteItem(
                        item._id
                      )
                    }
                    style={{
                      flex: 1,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "14px",
                      padding: "12px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>
        </>
      )}

      {/* BOTTOM NAV */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          borderTop:
            "1px solid #eee",
          display: "flex",
          justifyContent:
            "space-around",
          padding: "16px 0",
          zIndex: 100
        }}
      >

        <div
          onClick={() =>
            navigate("/dashboard")
          }
          style={{
            color: "#777",
            cursor: "pointer"
          }}
        >
          Home
        </div>

        <div
          style={{
            color: "#10b981",
            fontWeight: "600"
          }}
        >
          Watchlist
        </div>

        <div
          onClick={logout}
          style={{
            color: "#777",
            cursor: "pointer"
          }}
        >
          Logout
        </div>

      </div>

    </div>
  );
}