// components/Chat/Messages/FeedbackModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

import { createPortal } from "react-dom";

const FeedbackModal = ({ type, onSubmit, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [comment, setComment] = useState('');
  const [otherText, setOtherText] = useState('');

  const positiveOptions = [
    'Accurate RTI information',
    'Clear and helpful guidance',
    'Proper legal language',
    'Complete draft structure',
    'Relevant public authority suggestions',
    'Easy to understand',
    'Other'
  ];

  const negativeOptions = [
    'Incorrect RTI information',
    'Missing important details',
    'Wrong public authority suggested',
    'Unclear or confusing language',
    'Incomplete draft structure',
    'Legal inaccuracies',
    'Technical issues',
    'Other'
  ];

  const options = type === 'positive' ? positiveOptions : negativeOptions;

  const handleOptionChange = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      selectedOptions: selectedOptions.map(option => 
        option === 'Other' && otherText ? `${option}: ${otherText}` : option
      ),
      comment: comment.trim(),
    };
    onSubmit(feedbackData);
  };

  return createPortal (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {type === 'positive' 
              ? 'What did you like about this response?' 
              : 'What could be improved?'
            }
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3 mb-4">
            {options.map((option) => (
              <label key={option} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>

          {selectedOptions.includes('Other') && (
            <div className="mb-4">
              <textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Please specify..."
                className="w-full p-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 text-sm"
                rows="2"
                maxLength="200"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Additional comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="w-full p-3 border rounded-md dark:border-gray-600 dark:bg-gray-700 text-sm"
              rows="3"
              maxLength="500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root") 
  );
};

export default FeedbackModal;
