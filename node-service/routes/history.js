const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await axios.get(
      `http://collector:8000/internal/history/${productId}`
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
});

module.exports = router;