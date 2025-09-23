/ client/src/utils/feedback.ts
import { FeedbackData, FeedbackResponse } from '~/types/feedback';

export const validateFeedbackData = (data: FeedbackData): string[] => {
  const errors: string[] = [];

  if (!data.messageId?.trim()) {
    errors.push('Message ID is required');
  }

  if (!data.conversationId?.trim()) {
    errors.push('Conversation ID is required');
  }

  if (!['positive', 'negative'].includes(data.feedbackType)) {
    errors.push('Invalid feedback type');
  }

  if (!Array.isArray(data.categories)) {
    errors.push('Categories must be an array');
  }

  if (data.comment && data.comment.length > 500) {
    errors.push('Comment must be less than 500 characters');
  }

  return errors;
};

export const formatFeedbackForDisplay = (feedback: FeedbackResponse) => {
  return {
    ...feedback,
    categories: typeof feedback.categories === 'string' 
      ? JSON.parse(feedback.categories) 
      : feedback.categories,
    formattedDate: new Date(feedback.createdAt).toLocaleDateString(),
    formattedTime: new Date(feedback.createdAt).toLocaleTimeString()
  };
};

export const aggregateFeedbackStats = (feedbackList: FeedbackResponse[]) => {
  const total = feedbackList.length;
  const positive = feedbackList.filter(f => f.feedbackType === 'positive').length;
  const negative = total - positive;

  const categoryCount: Record<string, number> = {};
  feedbackList.forEach(feedback => {
    const categories = typeof feedback.categories === 'string' 
      ? JSON.parse(feedback.categories) 
      : feedback.categories;
    
    categories.forEach((category: string) => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const commonCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([category, count]) => ({ category, count }));

  return {
    total,
    positive,
    negative,
    positiveRate: total > 0 ? (positive / total) * 100 : 0,
    commonCategories
  };
};

