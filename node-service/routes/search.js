const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const product = req.query.product;

    if (!product) {
      return res.status(400).json({
        message: "Product query is required"
      });
    }

    const response = await axios.get(
      `http://collector:8000/internal/prices?q=${product}`
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prices",
      error: error.message
    });
  }
});

module.exports = router;