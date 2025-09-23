// client/src/components/Messages/FeedbackButtons.styles.ts
import styled from 'styled-components';

export const FeedbackContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FeedbackButton = styled.button<{
  $isSelected?: boolean;
  $feedbackType?: 'positive' | 'negative';
  $isDisabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  border-radius: 6px;
  background: ${({ $isSelected, $feedbackType, theme }) => {
    if ($isSelected && $feedbackType === 'positive') return theme.colors.success.light;
    if ($isSelected && $feedbackType === 'negative') return theme.colors.error.light;
    return 'transparent';
  }};
  color: ${({ $isSelected, $feedbackType, theme }) => {
    if ($isSelected && $feedbackType === 'positive') return theme.colors.success.main;
    if ($isSelected && $feedbackType === 'negative') return theme.colors.error.main;
    return theme.colors.text.secondary;
  }};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const FeedbackTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 4px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.tooltip.background};
  color: ${({ theme }) => theme.colors.tooltip.text};
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.tooltip.background};
  }
`;
