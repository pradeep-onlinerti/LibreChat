const express = require("express");
const passport = require("passport");
const router = express.Router();
const Feedback = require("../../models/Feedback");

// POST feedback (protected with JWT)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { messageId, rating, comment, conversationId, feedbackType, selectedOptions } = req.body;

//      if (!messageId || !rating) {
        if (!messageId ) {
        return res.status(400).json({ error: "messageId and rating are required" });
      }


      const feedback = new Feedback({
        messageId,
        conversationId,
        feedbackType,
        userId: req.user._id, // comes from passport
        rating,
        userComment: comment,
        selectedOptions,
      });

      await feedback.save();
      res.json({ success: true, feedback });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET feedback for a message (admin use case)
router.get(
  "/:messageId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const feedbacks = await Feedback.find({ messageId: req.params.messageId })
        .populate("userId", "username email");
      res.json(feedbacks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
