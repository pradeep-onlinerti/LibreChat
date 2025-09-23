const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  messageId: { type: String, required: true, index: true },
  conversationId: { type: String, required: true, index: true },
  feedbackType: { 
    type: String, 
    enum: ['positive', 'negative'], 
    required: true 
  },
  selectedOptions: [{ type: String }],
  userComment: { type: String, maxlength: 500 },
  userSessionId: { type: String },
  ipAddressHash: { type: String },
  timestamp: { type: Date, default: Date.now },
  rtiMetadata: {
    publicAuthority: String,
    rtiType: String,
    complexity: String,
  }
}, {
  collection: 'feedback'
});

// Prevent duplicate feedback
feedbackSchema.index(
  { messageId: 1, userSessionId: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
