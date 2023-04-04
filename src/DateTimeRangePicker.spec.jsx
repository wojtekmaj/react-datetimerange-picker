import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateTimeRangePicker from './DateTimeRangePicker';

async function waitForElementToBeRemovedOrHidden(callback) {
  const element = callback();

  if (element) {
    try {
      await waitFor(() =>
        expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
      );
    } catch (error) {
      await waitForElementToBeRemoved(element);
    }
  }
}

describe('DateTimeRangePicker', () => {
  it('passes default name to DateTimeInput components', () => {
    const { container } = render(<DateTimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toHaveAttribute('name', 'datetimerange_from');
    expect(nativeInputs[1]).toHaveAttribute('name', 'datetimerange_to');
  });

  it('passes custom name to DateTimeInput components', () => {
    const name = 'testName';

    const { container } = render(<DateTimeRangePicker name={name} />);

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toHaveAttribute('name', `${name}_from`);
    expect(nativeInputs[1]).toHaveAttribute('name', `${name}_to`);
  });

  // See https://github.com/jsdom/jsdom/issues/3041
  it.skip('passes autoFocus flag to first DateTimeInput component', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<DateTimeRangePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('autofocus');
  });

  it('passes disabled flag to DateTimeInput components', () => {
    const { container } = render(<DateTimeRangePicker disabled />);

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs[0]).toBeDisabled();
    expect(nativeInputs[1]).toBeDisabled();
  });

  it('passes format to DateTimeInput components', () => {
    const { container } = render(<DateTimeRangePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(2);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
    expect(customInputs[1]).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to DateTimeInput components', () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      calendarAriaLabel: 'Toggle calendar',
      clearAriaLabel: 'Clear value',
      dayAriaLabel: 'Day',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      monthAriaLabel: 'Month',
      nativeInputAriaLabel: 'Date and time',
      secondAriaLabel: 'Second',
      yearAriaLabel: 'Year',
    };

    const { container } = render(<DateTimeRangePicker {...ariaLabelProps} maxDetail="second" />);

    const calendarButton = container.querySelector(
      'button.react-datetimerange-picker__calendar-button',
    );
    const clearButton = container.querySelector('button.react-datetimerange-picker__clear-button');
    const dateTimeInputs = container.querySelectorAll('.react-datetimerange-picker__inputGroup');

    const [dateTimeFromInput, dateTimeToInput] = dateTimeInputs;

    const nativeFromInput = dateTimeFromInput.querySelector('input[type="datetime-local"]');
    const dayFromInput = dateTimeFromInput.querySelector('input[name="day"]');
    const monthFromInput = dateTimeFromInput.querySelector('input[name="month"]');
    const yearFromInput = dateTimeFromInput.querySelector('input[name="year"]');
    const hourFromInput = dateTimeFromInput.querySelector('input[name="hour12"]');
    const minuteFromInput = dateTimeFromInput.querySelector('input[name="minute"]');
    const secondFromInput = dateTimeFromInput.querySelector('input[name="second"]');

    const nativeToInput = dateTimeToInput.querySelector('input[type="datetime-local"]');
    const dayToInput = dateTimeToInput.querySelector('input[name="day"]');
    const monthToInput = dateTimeToInput.querySelector('input[name="month"]');
    const yearToInput = dateTimeToInput.querySelector('input[name="year"]');
    const hourToInput = dateTimeToInput.querySelector('input[name="hour12"]');
    const minuteToInput = dateTimeToInput.querySelector('input[name="minute"]');
    const secondToInput = dateTimeToInput.querySelector('input[name="second"]');

    expect(calendarButton).toHaveAttribute('aria-label', ariaLabelProps.calendarAriaLabel);
    expect(clearButton).toHaveAttribute('aria-label', ariaLabelProps.clearAriaLabel);

    expect(nativeFromInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(dayFromInput).toHaveAttribute('aria-label', ariaLabelProps.dayAriaLabel);
    expect(monthFromInput).toHaveAttribute('aria-label', ariaLabelProps.monthAriaLabel);
    expect(yearFromInput).toHaveAttribute('aria-label', ariaLabelProps.yearAriaLabel);
    expect(hourFromInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteFromInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondFromInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);

    expect(nativeToInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(dayToInput).toHaveAttribute('aria-label', ariaLabelProps.dayAriaLabel);
    expect(monthToInput).toHaveAttribute('aria-label', ariaLabelProps.monthAriaLabel);
    expect(yearToInput).toHaveAttribute('aria-label', ariaLabelProps.yearAriaLabel);
    expect(hourToInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteToInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondToInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to DateTimeInput components', () => {
    const placeholderProps = {
      dayPlaceholder: 'dd',
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      monthPlaceholder: 'mm',
      secondPlaceholder: 'ss',
      yearPlaceholder: 'yyyy',
    };

    const { container } = render(<DateTimeRangePicker {...placeholderProps} maxDetail="second" />);

    const dateTimeInputs = container.querySelectorAll('.react-datetimerange-picker__inputGroup');

    const [dateTimeFromInput, dateTimeToInput] = dateTimeInputs;

    const dayFromInput = dateTimeFromInput.querySelector('input[name="day"]');
    const monthFromInput = dateTimeFromInput.querySelector('input[name="month"]');
    const yearFromInput = dateTimeFromInput.querySelector('input[name="year"]');
    const hourFromInput = dateTimeFromInput.querySelector('input[name="hour12"]');
    const minuteFromInput = dateTimeFromInput.querySelector('input[name="minute"]');
    const secondFromInput = dateTimeFromInput.querySelector('input[name="second"]');

    const dayToInput = dateTimeToInput.querySelector('input[name="day"]');
    const monthToInput = dateTimeToInput.querySelector('input[name="month"]');
    const yearToInput = dateTimeToInput.querySelector('input[name="year"]');
    const hourToInput = dateTimeToInput.querySelector('input[name="hour12"]');
    const minuteToInput = dateTimeToInput.querySelector('input[name="minute"]');
    const secondToInput = dateTimeToInput.querySelector('input[name="second"]');

    expect(dayFromInput).toHaveAttribute('placeholder', placeholderProps.dayPlaceholder);
    expect(monthFromInput).toHaveAttribute('placeholder', placeholderProps.monthPlaceholder);
    expect(yearFromInput).toHaveAttribute('placeholder', placeholderProps.yearPlaceholder);
    expect(hourFromInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteFromInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondFromInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);

    expect(dayToInput).toHaveAttribute('placeholder', placeholderProps.dayPlaceholder);
    expect(monthToInput).toHaveAttribute('placeholder', placeholderProps.monthPlaceholder);
    expect(yearToInput).toHaveAttribute('placeholder', placeholderProps.yearPlaceholder);
    expect(hourToInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteToInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondToInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);
  });

  describe('passes value to DateTimeInput components', () => {
    it('passes single value to DateTimeInput components', () => {
      const value = new Date(2019, 0, 1);

      const { container } = render(<DateTimeRangePicker value={value} />);

      const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

      expect(nativeInputs[0]).toHaveValue('2019-01-01T00:00');
      expect(nativeInputs[1]).toHaveValue('');
    });

    it('passes the first item of an array of values to DateTimeInput components', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1, 12, 30);

      const { container } = render(<DateTimeRangePicker value={[value1, value2]} />);

      const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

      expect(nativeInputs[0]).toHaveValue('2019-01-01T00:00');
      expect(nativeInputs[1]).toHaveValue('2019-07-01T12:30');
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const { container } = render(<DateTimeRangePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isCalendarOpen flag', () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetimerange-picker--open');
  });

  it('applies "--open" className to its wrapper when given isClockOpen flag', () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-datetimerange-picker--open');
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const { container } = render(
      <DateTimeRangePicker calendarClassName={calendarClassName} isCalendarOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(
      <DateTimeRangePicker clockClassName={clockClassName} isClockOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders DateTimeInput components', () => {
    const { container } = render(<DateTimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="datetime-local"]');

    expect(nativeInputs.length).toBe(2);
  });

  it('renders range divider with default divider', () => {
    const { container } = render(<DateTimeRangePicker />);

    const rangeDivider = container.querySelector('.react-datetimerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('–');
  });

  it('renders range divider with custom divider', () => {
    const { container } = render(<DateTimeRangePicker rangeDivider="to" />);

    const rangeDivider = container.querySelector('.react-datetimerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('to');
  });

  describe('renders clear button properly', () => {
    it('renders clear button', () => {
      const { container } = render(<DateTimeRangePicker />);

      const clearButton = container.querySelector(
        'button.react-datetimerange-picker__clear-button',
      );

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', () => {
      const { container } = render(<DateTimeRangePicker />);

      const clearButton = container.querySelector(
        'button.react-datetimerange-picker__clear-button',
      );

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', () => {
      const { container } = render(<DateTimeRangePicker clearIcon="❌" />);

      const clearButton = container.querySelector(
        'button.react-datetimerange-picker__clear-button',
      );

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', () => {
      function ClearIcon() {
        return '❌';
      }

      const { container } = render(<DateTimeRangePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector(
        'button.react-datetimerange-picker__clear-button',
      );

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', () => {
      function ClearIcon() {
        return '❌';
      }

      const { container } = render(<DateTimeRangePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector(
        'button.react-datetimerange-picker__clear-button',
      );

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', () => {
      const { container } = render(<DateTimeRangePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetimerange-picker__calendar-button',
      );

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', () => {
      const { container } = render(<DateTimeRangePicker />);

      const calendarButton = container.querySelector(
        'button.react-datetimerange-picker__calendar-button',
      );

      const calendarIcon = calendarButton.querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', () => {
      const { container } = render(<DateTimeRangePicker calendarIcon="📅" />);

      const calendarButton = container.querySelector(
        'button.react-datetimerange-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', () => {
      function CalendarIcon() {
        return '📅';
      }

      const { container } = render(<DateTimeRangePicker calendarIcon={<CalendarIcon />} />);

      const calendarButton = container.querySelector(
        'button.react-datetimerange-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', () => {
      function CalendarIcon() {
        return '📅';
      }

      const { container } = render(<DateTimeRangePicker calendarIcon={CalendarIcon} />);

      const calendarButton = container.querySelector(
        'button.react-datetimerange-picker__calendar-button',
      );

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders DateTimeInput and Calendar components when given isCalendarOpen flag', () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('renders Clock component when given isClockOpen flag', () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', () => {
    const { container } = render(<DateTimeRangePicker disableCalendar isCalendarOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', () => {
    const { container } = render(<DateTimeRangePicker disableClock isClockOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', () => {
    const { container, rerender } = render(<DateTimeRangePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    rerender(<DateTimeRangePicker isCalendarOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Clock component when given isClockOpen flag by changing props', () => {
    const { container, rerender } = render(<DateTimeRangePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<DateTimeRangePicker isClockOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', () => {
    const { container } = render(<DateTimeRangePicker />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector('button.react-datetimerange-picker__calendar-button');

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const { container } = render(<DateTimeRangePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimeRangePicker openWidgetsOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimeRangePicker openWidgetsOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const { container } = render(<DateTimeRangePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const calendar = container.querySelector('.react-calendar');
      const select = container.querySelector('select[name="month"]');

      expect(calendar).toBeFalsy();

      fireEvent.focus(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const { container } = render(<DateTimeRangePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openWidgetsOnFocus = true', () => {
      const { container } = render(<DateTimeRangePicker openWidgetsOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openWidgetsOnFocus = false', () => {
      const { container } = render(<DateTimeRangePicker openWidgetsOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<DateTimeRangePicker format="dd.MMMM.yyyy hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );
  });

  it('closes Calendar component when tapped outside', async () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__clock'),
    );
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.blur(monthInput);
    fireEvent.focus(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', async () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3];
    const minuteInput = customInputs[4];

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', async () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector('button.react-datetimerange-picker__calendar-button');

    expect(clock).toBeInTheDocument();

    fireEvent.click(button);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__clock'),
    );
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const [firstTile, secondTile] = container.querySelectorAll('.react-calendar__tile');

    act(() => {
      fireEvent.click(firstTile);
    });

    act(() => {
      fireEvent.click(secondTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeWidgets = true', async () => {
    const { container } = render(<DateTimeRangePicker closeWidgets isCalendarOpen />);

    const [firstTile, secondTile] = container.querySelectorAll('.react-calendar__tile');

    act(() => {
      fireEvent.click(firstTile);
    });

    act(() => {
      fireEvent.click(secondTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-datetimerange-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeWidgets = false', () => {
    const { container } = render(<DateTimeRangePicker closeWidgets={false} isCalendarOpen />);

    const [firstTile, secondTile] = container.querySelectorAll('.react-calendar__tile');

    act(() => {
      fireEvent.click(firstTile);
    });

    act(() => {
      fireEvent.click(secondTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const dayInput = container.querySelector('input[name="day"]');

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock when changing value using inputs', () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const hourInput = container.querySelector('input[name="hour12"]');

    act(() => {
      fireEvent.change(hourInput, { target: { value: '9' } });
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', () => {
    const value = new Date(2023, 0, 31, 21, 40, 11);
    const onChange = vi.fn();

    const { container } = render(
      <DateTimeRangePicker maxDetail="second" onChange={onChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]');

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    expect(onChange).toHaveBeenCalledWith([new Date(2023, 0, 1, 21, 40, 11), undefined]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given Date', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const valueFrom = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValueFrom = new Date(2019, 0, 1, hours, minutes, seconds, ms);
    const valueTo = new Date(2019, 6, 17);

    const { container, getByRole } = render(
      <DateTimeRangePicker isCalendarOpen onChange={onChange} value={[valueFrom, valueTo]} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector('.react-calendar__navigation__label');
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    // Navigate up the calendar
    fireEvent.click(drillUpButton); // To year 2019

    // Click July
    const julyButton = getByRole('button', { name: 'July 2019' });
    fireEvent.click(julyButton);

    // Click 17th
    const seventeenthButton = getByRole('button', { name: 'July 17, 2019' });
    fireEvent.click(seventeenthButton);

    expect(onChange).toHaveBeenCalledWith([nextValueFrom, valueTo]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given ISO string', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const valueFrom = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValueFrom = new Date(2019, 0, 1, hours, minutes, seconds, ms);
    const valueTo = new Date(2019, 6, 17);

    const { container, getByRole } = render(
      <DateTimeRangePicker isCalendarOpen onChange={onChange} value={[valueFrom, valueTo]} />,
    );

    // Navigate up the calendar
    const drillUpButton = container.querySelector('.react-calendar__navigation__label');
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    // Navigate up the calendar
    fireEvent.click(drillUpButton); // To year 2019

    // Click July
    const julyButton = getByRole('button', { name: 'July 2019' });
    fireEvent.click(julyButton);

    // Click 17th
    const seventeenthButton = getByRole('button', { name: 'July 17, 2019' });
    fireEvent.click(seventeenthButton);

    expect(onChange).toHaveBeenCalledWith([nextValueFrom, valueTo]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given Date', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const valueFrom = new Date(2018, 6, 17);
    const valueTo = new Date(2019, 6, 17, hours, minutes, seconds, ms);
    const nextValueTo = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container, getByRole } = render(
      <DateTimeRangePicker isCalendarOpen onChange={onChange} value={[valueFrom, valueTo]} />,
    );

    // Click 17th
    const seventeenthButton = getByRole('button', { name: 'July 17, 2018' });
    fireEvent.click(seventeenthButton);

    // Navigate up the calendar
    const drillUpButton = container.querySelector('.react-calendar__navigation__label');
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith([valueFrom, nextValueTo]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange given ISO string', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const onChange = vi.fn();
    const valueFrom = new Date(2018, 6, 17);
    const valueTo = new Date(2019, 6, 17, hours, minutes, seconds, ms);
    const nextValueTo = new Date(2019, 0, 1, hours, minutes, seconds, ms);

    const { container, getByRole } = render(
      <DateTimeRangePicker isCalendarOpen onChange={onChange} value={[valueFrom, valueTo]} />,
    );

    // Click 17th
    const seventeenthButton = getByRole('button', { name: 'July 17, 2018' });
    fireEvent.click(seventeenthButton);

    // Navigate up the calendar
    const drillUpButton = container.querySelector('.react-calendar__navigation__label');
    fireEvent.click(drillUpButton); // To year 2018
    fireEvent.click(drillUpButton); // To 2011 – 2020 decade

    // Click year 2019
    const twentyNineteenButton = getByRole('button', { name: '2019' });
    fireEvent.click(twentyNineteenButton);

    // Click January
    const januaryButton = getByRole('button', { name: 'January 2019' });
    fireEvent.click(januaryButton);

    // Click 1st
    const firstButton = getByRole('button', { name: 'January 1, 2019' });
    fireEvent.click(firstButton);

    expect(onChange).toHaveBeenCalledWith([valueFrom, nextValueTo]);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = vi.fn();

    const { container } = render(<DateTimeRangePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector('button.react-datetimerange-picker__clear-button');

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', () => {
      const onChange = vi.fn();

      const { container } = render(
        <DateTimeRangePicker format="M/d/y H:m:s" maxDetail="second" onChange={onChange} />,
      );

      const nextValueFrom = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[0];
      const dayInput = customInputs[1];
      const yearInput = customInputs[2];
      const hourInput = customInputs[3];
      const minuteInput = customInputs[4];
      const secondInput = customInputs[5];

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, undefined]);
    });

    it('calls onChange properly given single initial value', () => {
      const onChange = vi.fn();
      const value = new Date(2018, 0, 1);

      const { container } = render(
        <DateTimeRangePicker
          format="M/d/y H:m:s"
          maxDetail="second"
          onChange={onChange}
          value={value}
        />,
      );

      const nextValueFrom = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[0];
      const dayInput = customInputs[1];
      const yearInput = customInputs[2];
      const hourInput = customInputs[3];
      const minuteInput = customInputs[4];
      const secondInput = customInputs[5];

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, undefined]);
    });

    it('calls onChange properly given initial value as an array', () => {
      const onChange = vi.fn();
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      const { container } = render(
        <DateTimeRangePicker
          format="M/d/y H:m:s"
          maxDetail="second"
          onChange={onChange}
          value={value}
        />,
      );

      const nextValueFrom = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[0];
      const dayInput = customInputs[1];
      const yearInput = customInputs[2];
      const hourInput = customInputs[3];
      const minuteInput = customInputs[4];
      const secondInput = customInputs[5];

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, valueTo]);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', () => {
      const onChange = vi.fn();

      const { container } = render(
        <DateTimeRangePicker format="M/d/y H:m:s" maxDetail="second" onChange={onChange} />,
      );

      const nextValueTo = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[6];
      const dayInput = customInputs[7];
      const yearInput = customInputs[8];
      const hourInput = customInputs[9];
      const minuteInput = customInputs[10];
      const secondInput = customInputs[11];

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([undefined, nextValueTo]);
    });

    it('calls onChange properly given single initial value', () => {
      const onChange = vi.fn();
      const value = new Date(2018, 0, 1);

      const { container } = render(
        <DateTimeRangePicker
          format="M/d/y H:m:s"
          maxDetail="second"
          onChange={onChange}
          value={value}
        />,
      );

      const nextValueTo = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[6];
      const dayInput = customInputs[7];
      const yearInput = customInputs[8];
      const hourInput = customInputs[9];
      const minuteInput = customInputs[10];
      const secondInput = customInputs[11];

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([value, nextValueTo]);
    });

    it('calls onChange properly given initial value as an array', () => {
      const onChange = vi.fn();
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      const { container } = render(
        <DateTimeRangePicker
          format="M/d/y H:m:s"
          maxDetail="second"
          onChange={onChange}
          value={value}
        />,
      );

      const nextValueTo = new Date(2018, 1, 15, 12, 30, 45);

      const customInputs = container.querySelectorAll('input[data-input]');
      const monthInput = customInputs[6];
      const dayInput = customInputs[7];
      const yearInput = customInputs[8];
      const hourInput = customInputs[9];
      const minuteInput = customInputs[10];
      const secondInput = customInputs[11];

      act(() => {
        fireEvent.change(dayInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.change(monthInput, { target: { value: '2' } });
      });

      act(() => {
        fireEvent.change(yearInput, { target: { value: '2018' } });
      });

      act(() => {
        fireEvent.change(hourInput, { target: { value: '12' } });
      });

      act(() => {
        fireEvent.change(minuteInput, { target: { value: '30' } });
      });

      act(() => {
        fireEvent.change(secondInput, { target: { value: '45' } });
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([valueFrom, nextValueTo]);
    });
  });
});
