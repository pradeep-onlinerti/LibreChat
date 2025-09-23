// client/src/constants/feedback.ts
export const FEEDBACK_CATEGORIES = {
  positive: [
    'Accurate RTI draft',
    'Relevant legal references',
    'Clear and well-structured response',
    'Helpful additional information',
    'Good understanding of query',
    'Proper RTI format',
    'Comprehensive guidance',
    'Relevant case law citations',
    'Other'
  ],
  negative: [
    'Incorrect information',
    'Irrelevant response',
    'Missing important details',
    'Poor RTI format/structure',
    'Unclear language',
    'Technical issues',
    'Incomplete draft',
    'Wrong legal references',
    'Missing mandatory fields',
    'Other'
  ]
} as const;

export const FEEDBACK_CONFIG = {
  maxCommentLength: 500,
  debounceTime: 300,
  retryAttempts: 3,
  timeoutMs: 10000
} as const;

