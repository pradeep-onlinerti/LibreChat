const Feedback = require('../../models/Feedback');
const crypto = require('crypto');

const { logger } = require('~/config');

// Hash IP for privacy
const hashIP = (ip) => {
  return crypto.createHash('sha256')
    .update(ip + (process.env.IP_SALT || 'default'))
    .digest('hex')
    .substring(0, 16);
};

const submitFeedback = async (req, res) => {
  try {

    logger.error('Feedback Data: ', req.body);
    
    const {
      messageId,
      conversationId, 
      feedbackType,
      selectedOptions,
      comment,
      rtiMetadata
    } = req.body;

    
 
    // Get user session info
    const userSessionId = req.user?.id || req.sessionID || req.ip;
    
    // Check for existing feedback
    const existingFeedback = await Feedback.findOne({
      messageId,
      userSessionId
    });

    if (existingFeedback) {
      return res.status(409).json({
        message: 'Feedback already submitted for this message'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      messageId,
      conversationId,
      feedbackType,
      selectedOptions: selectedOptions || [],
      userComment: comment?.substring(0, 500) || '',
      userSessionId,
      ipAddressHash: hashIP(req.ip),
      rtiMetadata
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      message: 'Failed to submit feedback'
    });
  }
};

const getFeedbackAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, feedbackType } = req.query;
    
    const matchConditions = {};
    if (startDate && endDate) {
      matchConditions.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (feedbackType) {
      matchConditions.feedbackType = feedbackType;
    }

    const analytics = await Feedback.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: '$feedbackType',
          count: { $sum: 1 },
          topOptions: { $push: '$selectedOptions' }
        }
      }
    ]);

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackAnalytics
};
