import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function HistoryPage() {

  const { productId } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const res = await axios.get(
        `http://10.0.2.2:5000/api/history/${productId}`
      );

      setData(
        res.data.history || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const latestPrice =
    data.length > 0
      ? data[data.length - 1].price
      : 0;

  const highestPrice =
    data.length > 0
      ? Math.max(
          ...data.map(
            (d) => d.price
          )
        )
      : 0;

  const lowestPrice =
    data.length > 0
      ? Math.min(
          ...data.map(
            (d) => d.price
          )
        )
      : 0;

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
          marginBottom: "25px"
        }}
      >

        <div>

          <p
            style={{
              color: "#777",
              marginBottom: "8px"
            }}
          >
            Product Tracking
          </p>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: "700"
            }}
          >
            Price History
          </h1>

        </div>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "14px",
            padding: "12px 18px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Back
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
          marginBottom: "28px",
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
          Current Best Price
        </p>

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "12px"
          }}
        >
          ${latestPrice}
        </h1>

        <p
          style={{
            color: "#34d399",
            fontWeight: "600"
          }}
        >
          Live market tracking enabled
        </p>

      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "28px"
        }}
      >

        {/* Highest */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.06)"
          }}
        >

          <p
            style={{
              color: "#777",
              marginBottom: "8px"
            }}
          >
            Highest
          </p>

          <h2
            style={{
              fontSize: "28px"
            }}
          >
            ${highestPrice}
          </h2>

        </div>

        {/* Lowest */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "20px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.06)"
          }}
        >

          <p
            style={{
              color: "#777",
              marginBottom: "8px"
            }}
          >
            Lowest
          </p>

          <h2
            style={{
              fontSize: "28px"
            }}
          >
            ${lowestPrice}
          </h2>

        </div>

      </div>

      {/* CHART SECTION */}
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "22px",
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.06)"
        }}
      >

        <div
          style={{
            marginBottom: "20px"
          }}
        >

          <h2
            style={{
              marginBottom: "8px"
            }}
          >
            Market Trend
          </h2>

          <p
            style={{
              color: "#777"
            }}
          >
            Monitor product price movement
          </p>

        </div>

        {loading ? (

          <div
            style={{
              height: "350px",
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              color: "#777"
            }}
          >
            Loading price history...
          </div>

        ) : (

          <div
            style={{
              width: "100%",
              height: 380
            }}
          >

            <ResponsiveContainer>

              <AreaChart data={data}>

                <defs>

                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fill: "#777"
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#777"
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{
                    r: 4
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>

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
          History
        </div>

        <div
          onClick={() =>
            navigate("/watchlist")
          }
          style={{
            color: "#777",
            cursor: "pointer"
          }}
        >
          Watchlist
        </div>

      </div>

    </div>
  );
}