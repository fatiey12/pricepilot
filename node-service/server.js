const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");
const historyRoutes = require("./routes/history");
const notificationRoutes = require("./routes/notification");




dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const searchRoutes = require("./routes/search");

app.get("/", (req, res) => {
  res.json({ message: "Node API Gateway Running" });
});




app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/history", historyRoutes);
app.use("/api", notificationRoutes);

const PORT = process.env.PORT || 5000;


app.get("/api/health", (req, res) => {
  res.json({ status: "Gateway healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});