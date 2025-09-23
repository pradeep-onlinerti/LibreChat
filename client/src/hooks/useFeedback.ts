// client/src/hooks/useFeedback.ts
import { useState, useCallback } from 'react';
import { useFeedbackMutation } from '~/data-provider';
import { FeedbackData } from '~/types/feedback';

export const useFeedback = (messageId: string, conversationId: string) => {
  const [submittedFeedback, setSubmittedFeedback] = useState<'positive' | 'negative' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'positive' | 'negative' | null>(null);

  const feedbackMutation = useFeedbackMutation();

  const handleFeedbackClick = useCallback((type: 'positive' | 'negative') => {
    if (submittedFeedback) return;
    setSelectedType(type);
    setIsModalOpen(true);
  }, [submittedFeedback]);

  const handleFeedbackSubmit = useCallback(async (feedbackData: Omit<FeedbackData, 'messageId' | 'conversationId'>) => {
    try {
      await feedbackMutation.mutateAsync({
        messageId,
        conversationId,
        ...feedbackData
      });
      
      setSubmittedFeedback(feedbackData.feedbackType);
      setIsModalOpen(false);
      setSelectedType(null);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }, [messageId, conversationId, feedbackMutation]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedType(null);
  }, []);

  return {
    submittedFeedback,
    isModalOpen,
    selectedType,
    isLoading: feedbackMutation.isLoading,
    error: feedbackMutation.error,
    handleFeedbackClick,
    handleFeedbackSubmit,
    handleModalClose
  };
};

