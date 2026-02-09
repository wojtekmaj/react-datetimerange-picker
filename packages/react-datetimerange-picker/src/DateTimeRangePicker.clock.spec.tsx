import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { act } from 'react-dom/test-utils';

// Mock react-clock to render an SVG with predictable transforms for hands
vi.mock('react-clock', async () => {
  const React = await import('react');

  const MockClock = ({ value }: { value: Date | null }) => {
    const date = value ? new Date(value) : new Date(0);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const hourRotate = hour % 12 === 0 ? 0 : hour * 30 + Math.floor(minute / 2);
    const minuteRotate = minute * 6;

    return (
      <svg data-testid="mock-clock">
        <g data-testid="mock-hour" transform={`rotate(${hourRotate})`} />
        <g data-testid="mock-minute" transform={`rotate(${minuteRotate})`} />
      </svg>
    );
  };

  return { default: MockClock };
});

import DateTimeRangePicker from './DateTimeRangePicker.js';

const defaultProps = {
  amPmAriaLabel: 'amPm',
  dayAriaLabel: 'day',
  hourAriaLabel: 'hour',
  minuteAriaLabel: 'minute',
  monthAriaLabel: 'month',
  secondAriaLabel: 'second',
  yearAriaLabel: 'year',
};

describe('DateTimeRangePicker — clock SVG integration', () => {
  it('renders clock with minute hand matching the focused (to) value', async () => {
    const from = new Date(2019, 0, 1, 9, 0);
    const to = new Date(2019, 0, 1, 10, 30);

    const { container } = await render(
      <DateTimeRangePicker {...defaultProps} value={[from, to]} maxDetail="minute" />,
    );

    const dateTimeInputs = container.querySelectorAll('.react-datetimerange-picker__inputGroup');
    const dateTimeToInput = dateTimeInputs[1] as HTMLDivElement;

    // Focus an input inside the "to" group to activate the second clock
    const hourToInput =
      (dateTimeToInput.querySelector('input[name="hour12"]') as HTMLElement) ||
      (dateTimeToInput.querySelector('input[name="hour24"]') as HTMLElement);

    await act(() => hourToInput.focus());

    // The mocked clock renders an element with data-testid "mock-minute"
    const minuteHand = container.querySelector('[data-testid="mock-minute"]');

    expect(minuteHand).toBeTruthy();

    const transform = minuteHand!.getAttribute('transform');

    // 'to' minutes are 30 -> rotation should be 30 * 6 = 180
    expect(transform).toContain('rotate(180)');
  });
});
