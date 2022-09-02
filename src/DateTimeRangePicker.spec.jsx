import React, { createRef } from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';

import DateTimeRangePicker from './DateTimeRangePicker';

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

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass(className);
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

  it('renders clear button', () => {
    const { container } = render(<DateTimeRangePicker />);

    const clearButton = container.querySelector('button.react-datetimerange-picker__clear-button');

    expect(clearButton).toBeInTheDocument();
  });

  it('renders calendar button', () => {
    const { container } = render(<DateTimeRangePicker />);

    const calendarButton = container.querySelector(
      'button.react-datetimerange-picker__calendar-button',
    );

    expect(calendarButton).toBeInTheDocument();
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

  it('closes Calendar component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isCalendarOpen />, { attachTo: root });

    fireEvent.mouseDown(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-calendar'));
  });

  it('closes Calendar component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isCalendarOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-calendar'));
  });

  it('closes Calendar component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isCalendarOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-calendar'));
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isClockOpen />, { attachTo: root });

    fireEvent.mouseDown(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isClockOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('closes Clock component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DateTimeRangePicker isClockOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const { container } = render(<DateTimeRangePicker isCalendarOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[0];
    const monthInput = customInputs[1];

    fireEvent.blur(dayInput);
    fireEvent.focus(monthInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Clock component when focused within time inputs', () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[3];
    const minuteInput = customInputs[4];

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    waitForElementToBeRemoved(() => container.querySelector('.react-calendar'));

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', () => {
    const { container } = render(<DateTimeRangePicker isClockOpen />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector('button.react-datetimerange-picker__calendar-button');

    expect(clock).toBeInTheDocument();

    fireEvent.click(button);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('closes Calendar when calling internal onChange by default', () => {
    const instance = createRef();

    const { container } = render(<DateTimeRangePicker isCalendarOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date());

    waitForElementToBeRemoved(() => container.querySelector('.react-calendar'));
  });

  it('does not close Calendar when calling internal onChange with prop closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(
      <DateTimeRangePicker closeWidgets={false} isCalendarOpen ref={instance} />,
    );

    const { onChange } = instance.current;

    onChange(new Date());

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when calling internal onChange with closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(<DateTimeRangePicker isCalendarOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date(), false);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Clock when calling internal onChange by default', () => {
    const instance = createRef();

    const { container } = render(<DateTimeRangePicker isClockOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date());

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('does not close Clock when calling internal onChange with prop closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(
      <DateTimeRangePicker closeWidgets={false} isClockOpen ref={instance} />,
    );

    const { onChange } = instance.current;

    onChange(new Date());

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when calling internal onChange with closeWidgets = false', () => {
    const instance = createRef();

    const { container } = render(<DateTimeRangePicker isClockOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date(), false);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when calling internal onChange', () => {
    const instance = createRef();
    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    render(<DateTimeRangePicker onChange={onChange} ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const instance = createRef();
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const valueFrom = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValueFrom = new Date(2019, 0, 1);
    const valueTo = new Date(2019, 6, 17);
    const onChange = jest.fn();

    render(<DateTimeRangePicker onChange={onChange} value={[valueFrom, valueTo]} ref={instance} />);

    const { onDateChange } = instance.current;

    onDateChange([nextValueFrom, valueTo]);

    expect(onChange).toHaveBeenCalledWith([
      new Date(2019, 0, 1, hours, minutes, seconds, ms),
      valueTo,
    ]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const instance = createRef();
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const valueFrom = new Date(2018, 6, 17);
    const valueTo = new Date(2019, 6, 17, hours, minutes, seconds, ms);
    const nextValueTo = new Date(2019, 0, 1);
    const onChange = jest.fn();

    render(<DateTimeRangePicker onChange={onChange} value={[valueFrom, valueTo]} ref={instance} />);

    const { onDateChange } = instance.current;

    onDateChange([valueFrom, nextValueTo]);

    expect(onChange).toHaveBeenCalledWith([
      valueFrom,
      new Date(2019, 0, 1, hours, minutes, seconds, ms),
    ]);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const instance = createRef();
    const nextValue = new Date(2019, 0, 1, 21, 40, 11, 458);
    const onChange = jest.fn();

    render(
      <DateTimeRangePicker onChange={onChange} value={new Date(2018, 6, 17)} ref={instance} />,
    );

    const { onChange: onChangeInternal } = instance.current;

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const { container } = render(<DateTimeRangePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');
    const button = container.querySelector('button.react-datetimerange-picker__clear-button');

    expect(calendar).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', () => {
      const instance = createRef();

      render(<DateTimeRangePicker ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], undefined);
    });

    it('calls onChange properly given single initial value', () => {
      const instance = createRef();
      const value = new Date(2018, 0, 1);

      render(<DateTimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], undefined);
    });

    it('calls onChange properly given initial value as an array', () => {
      const instance = createRef();
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      render(<DateTimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, valueTo], undefined);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', () => {
      const instance = createRef();

      render(<DateTimeRangePicker ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([undefined, nextValueTo], undefined);
    });

    it('calls onChange properly given single initial value', () => {
      const instance = createRef();
      const value = new Date(2018, 0, 1);

      render(<DateTimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([value, nextValueTo], undefined);
    });

    it('calls onChange properly given initial value as an array', () => {
      const instance = createRef();
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      render(<DateTimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([valueFrom, nextValueTo], undefined);
    });
  });
});
