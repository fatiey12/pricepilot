const admin = require("../firebaseAdmin");

const sendNotification = async (token) => {
  try {
    await admin.messaging().send({
  token,
  notification: {
    title: "Test Notification",
    body: "Your notifications are working!"
  },
  data: {
    title: "Test Notification",
    body: "Your notifications are working!"
  }
});
  } catch (error) {
    console.log("Notification error:", error);
  }
};

module.exports = sendNotification;