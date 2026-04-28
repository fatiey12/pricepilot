const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  productName: {
    type: String,
    required: true
  },

  store: String,
  price: Number
},
{ timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);