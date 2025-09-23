// components/Chat/Messages/FeedbackButtons.jsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import { useAuthContext } from '~/hooks';

const FeedbackButtons = ({ messageId, conversationId, messageContent }) => {
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { token } = useAuthContext();

  const handleFeedbackClick = (type) => {
    if (isSubmitted) return;
    setFeedbackType(type);
    setShowModal(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messageId,
          conversationId,
          feedbackType,
          ...feedbackData,
        }),
      });

      if (response.ok) {
        setFeedback(feedbackType);
        setIsSubmitted(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
      <button
        onClick={() => handleFeedbackClick('positive')}
        disabled={isSubmitted}
        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          feedback === 'positive' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : ''
        } ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
        title="Good response"
      >
        <ThumbsUp size={16} />
      </button>
      
      <button
        onClick={() => handleFeedbackClick('negative')}
        disabled={isSubmitted}
        className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          feedback === 'negative' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : ''
        } ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
        title="Bad response"
      >
        <ThumbsDown size={16} />
      </button>

      {showModal && (
        <FeedbackModal
          type={feedbackType}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FeedbackButtons;
