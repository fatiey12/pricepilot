const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const sendNotification = require("../utils/notification");

router.post("/save-token", authMiddleware, async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const userId = req.user.id;
    const { fcmToken } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    );

    console.log("UPDATED USER:", updatedUser);

    res.json({ message: "Token saved" });

  } catch (error) {
    console.log("SAVE TOKEN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/test-notification", async (req, res) => {
  try {
    const user = await User.findOne({
      fcmToken: { $exists: true, $ne: null }
    });

    if (!user) {
      return res.status(404).json({ message: "No token found" });
    }

    await sendNotification(user.fcmToken);

    res.json({ message: "Notification sent" });

  } catch (error) {
    console.log("NOTIFICATION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;