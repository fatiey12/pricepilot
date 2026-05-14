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
        `http://localhost:5000/api/history/${productId}`
      );

      setData(res.data.history || []);

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
      ? Math.max(...data.map((d) => d.price))
      : 0;

  const lowestPrice =
    data.length > 0
      ? Math.min(...data.map((d) => d.price))
      : 0;

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px"
      }}
    >

      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >

        <div>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "10px"
            }}
          >
            Product Price Analytics
          </h1>

          <p style={{ color: "#666" }}>
            Historical pricing insights and trends
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#ffffffff",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "400"
          }}
        >
          Back to Dashboard
        </button>

      </div>

      {/* Analytics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <p style={{ color: "#666" }}>
            Current Price
          </p>

          <h2 style={{ marginTop: "10px" }}>
            ${latestPrice}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <p style={{ color: "#666" }}>
            Highest Price
          </p>

          <h2 style={{ marginTop: "10px" }}>
            ${highestPrice}
          </h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <p style={{ color: "#666" }}>
            Lowest Price
          </p>

          <h2 style={{ marginTop: "10px" }}>
            ${lowestPrice}
          </h2>
        </div>

      </div>

      {/* Chart Container */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow:
            "0 6px 18px rgba(0,0,0,0.08)"
        }}
      >

        <div
          style={{
            marginBottom: "20px"
          }}
        >
          <h2>
            Price Trend Analysis
          </h2>

          <p style={{ color: "#666" }}>
            Market price fluctuations over time
          </p>
        </div>

        {loading ? (

          <div
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Loading analytics...
          </div>

        ) : (

          <div style={{ width: "100%", height: 450 }}>

            <ResponsiveContainer>

              <AreaChart data={data}>

                <defs>
                  <linearGradient
                    id="colorPrice"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#7c3aed"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="#7c3aed"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#eee"
                />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#7c3aed"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#7c3aed"
                  strokeWidth={4}
                  dot={{
                    r: 5
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>

    </div>
  );
}