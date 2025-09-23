// =============================================
// 1. TYPES DEFINITIONS
// =============================================

// client/src/types/feedback.ts
export interface FeedbackData {
  messageId: string;
  conversationId: string;
  feedbackType: 'positive' | 'negative';
  categories: string[];
  comment?: string;
}

export interface FeedbackResponse {
  id: string;
  messageId: string;
  conversationId: string;
  userId?: string;
  feedbackType: 'positive' | 'negative';
  categories: string[];
  comment?: string;
  createdAt: string;
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  positiveCount: number;
  negativeCount: number;
  positiveRate: number;
  commonCategories: Array<{
    category: string;
    count: number;
  }>;
  recentFeedback: FeedbackResponse[];
}

