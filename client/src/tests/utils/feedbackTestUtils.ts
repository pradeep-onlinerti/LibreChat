// client/src/__tests__/utils/feedbackTestUtils.ts
import { FeedbackData, FeedbackResponse } from '~/types/feedback';

export const mockFeedbackData: FeedbackData = {
  messageId: 'msg_123',
  conversationId: 'conv_456',
  feedbackType: 'positive',
  categories: ['Accurate RTI draft', 'Clear and well-structured response'],
  comment: 'This was very helpful!'
};

export const mockFeedbackResponse: FeedbackResponse = {
  id: 'feedback_789',
  ...mockFeedbackData,
  createdAt: new Date().toISOString()
};

export const createMockFeedback = (overrides: Partial<FeedbackData> = {}): FeedbackData => ({
  ...mockFeedbackData,
  ...overrides
});
