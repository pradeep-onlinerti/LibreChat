// client/src/utils/accessibility.ts
export const FEEDBACK_ARIA_LABELS = {
  positiveButton: 'Mark this response as helpful',
  negativeButton: 'Mark this response as not helpful',
  feedbackModal: 'Provide detailed feedback',
  categoryCheckbox: (category: string) => `Select ${category} as feedback category`,
  commentTextarea: 'Additional comments about this response',
  submitButton: 'Submit feedback',
  cancelButton: 'Cancel feedback submission'
} as const;

export const getFeedbackAriaLabel = (
  type: 'positive' | 'negative',
  isSubmitted: boolean
): string => {
  if (isSubmitted) {
    return type === 'positive' 
      ? 'Marked as helpful' 
      : 'Marked as not helpful';
  }
  return type === 'positive' 
    ? FEEDBACK_ARIA_LABELS.positiveButton 
    : FEEDBACK_ARIA_LABELS.negativeButton;
};
