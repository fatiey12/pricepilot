const express = require("express");
const Watchlist = require("../models/Watchlist");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


// ADD ITEM
router.post("/", auth, async (req, res) => {
  try {
    const item = await Watchlist.create({
      userId: req.user.id,
      productName: req.body.productName,
      store: req.body.store,
      price: req.body.price
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET ITEMS
router.get("/", auth, async (req, res) => {
  try {
    const items = await Watchlist.find({
      userId: req.user.id
    });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE ITEM
router.delete("/:id", auth, async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;