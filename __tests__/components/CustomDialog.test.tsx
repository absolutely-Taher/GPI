import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CustomDialog } from '../../src/components/CustomDialog';

// Mock dependencies
jest.mock('../../src/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#007AFF',
      error: '#FF3B30',
      cardShadow: '#000000',
    },
  }),
}));

describe('CustomDialog', () => {
  const mockButtons = [
    {
      text: 'Cancel',
      onPress: jest.fn(),
      style: 'cancel' as const,
    },
    {
      text: 'Delete',
      onPress: jest.fn(),
      style: 'destructive' as const,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dialog with title and message', () => {
    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText('Delete Product')).toBeTruthy();
    expect(getByText('Are you sure you want to delete this product?')).toBeTruthy();
  });

  it('should render buttons correctly', () => {
    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('should call button onPress when pressed', () => {
    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockButtons[0].onPress).toHaveBeenCalled();

    fireEvent.press(getByText('Delete'));
    expect(mockButtons[1].onPress).toHaveBeenCalled();
  });

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={jest.fn()}
        icon="delete-alert"
        iconColor="#FF3B30"
      />
    );

    expect(getByTestId('dialog-icon')).toBeTruthy();
  });

  it('should not render icon when not provided', () => {
    const { queryByTestId } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(queryByTestId('dialog-icon')).toBeNull();
  });

  it('should call onDismiss when overlay is pressed', () => {
    const mockOnDismiss = jest.fn();
    const { getByTestId } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={mockOnDismiss}
      />
    );

    fireEvent.press(getByTestId('dialog-overlay'));
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('should not call onDismiss when dialog content is pressed', () => {
    const mockOnDismiss = jest.fn();
    const { getByTestId } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={mockOnDismiss}
      />
    );

    fireEvent.press(getByTestId('dialog-container'));
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('should not render when visible is false', () => {
    const { queryByText } = render(
      <CustomDialog
        visible={false}
        title="Test Dialog"
        message="Test message"
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(queryByText('Test Dialog')).toBeNull();
  });

  it('should handle single button', () => {
    const singleButton = [
      {
        text: 'OK',
        onPress: jest.fn(),
        style: 'default' as const,
      },
    ];

    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={singleButton}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText('OK')).toBeTruthy();
  });

  it('should handle multiple buttons with different styles', () => {
    const multipleButtons = [
      {
        text: 'Cancel',
        onPress: jest.fn(),
        style: 'cancel' as const,
      },
      {
        text: 'Save',
        onPress: jest.fn(),
        style: 'default' as const,
      },
      {
        text: 'Delete',
        onPress: jest.fn(),
        style: 'destructive' as const,
      },
    ];

    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message="Test message"
        buttons={multipleButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('should handle long messages with proper line height', () => {
    const longMessage = 'This is a very long message that should wrap properly and maintain good readability. It should handle multiple lines and ensure the text is properly formatted within the dialog container.';

    const { getByText } = render(
      <CustomDialog
        visible={true}
        title="Test Dialog"
        message={longMessage}
        buttons={mockButtons}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText(longMessage)).toBeTruthy();
  });
});
