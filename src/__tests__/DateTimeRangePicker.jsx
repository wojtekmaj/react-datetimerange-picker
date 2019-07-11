import React from 'react';
import { mount } from 'enzyme';

import DateTimeRangePicker from '../DateTimeRangePicker';

/* eslint-disable comma-dangle */

describe('DateTimeRangePicker', () => {
  it('passes default name to DateTimeInput components', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.at(0).prop('name')).toBe('datetimerange_from');
    expect(dateTimeInput.at(1).prop('name')).toBe('datetimerange_to');
  });

  it('passes custom name to DateTimeInput components', () => {
    const name = 'testName';

    const component = mount(
      <DateTimeRangePicker name={name} />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.at(0).prop('name')).toBe(`${name}_from`);
    expect(dateTimeInput.at(1).prop('name')).toBe(`${name}_to`);
  });

  it('passes format to DateTimeInput components', () => {
    const format = 'y-MM-dd h:mm:ss a';

    const component = mount(
      <DateTimeRangePicker format={format} />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.at(0).prop('format')).toBe(format);
    expect(dateTimeInput.at(1).prop('format')).toBe(format);
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
      yearAriaLabel: 'Year'
    };

    const component = mount(
      <DateTimeRangePicker {...ariaLabelProps} />
    );

    const calendarButton = component.find('button.react-datetimerange-picker__calendar-button');
    const clearButton = component.find('button.react-datetimerange-picker__clear-button');
    const dateTimeInput = component.find('DateTimeInput');

    expect(calendarButton.prop('aria-label')).toBe(ariaLabelProps.calendarAriaLabel);
    expect(clearButton.prop('aria-label')).toBe(ariaLabelProps.clearAriaLabel);
    expect(dateTimeInput.at(0).prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(dateTimeInput.at(0).prop('dayAriaLabel')).toBe(ariaLabelProps.dayAriaLabel);
    expect(dateTimeInput.at(0).prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(dateTimeInput.at(0).prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(dateTimeInput.at(0).prop('monthAriaLabel')).toBe(ariaLabelProps.monthAriaLabel);
    expect(dateTimeInput.at(0).prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
    expect(dateTimeInput.at(0).prop('yearAriaLabel')).toBe(ariaLabelProps.yearAriaLabel);
    expect(dateTimeInput.at(1).prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(dateTimeInput.at(1).prop('dayAriaLabel')).toBe(ariaLabelProps.dayAriaLabel);
    expect(dateTimeInput.at(1).prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(dateTimeInput.at(1).prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(dateTimeInput.at(1).prop('monthAriaLabel')).toBe(ariaLabelProps.monthAriaLabel);
    expect(dateTimeInput.at(1).prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
    expect(dateTimeInput.at(1).prop('yearAriaLabel')).toBe(ariaLabelProps.yearAriaLabel);
  });

  describe('passes value to DateTimeInput components', () => {
    it('passes single value to DateTimeInput components', () => {
      const value = new Date(2019, 0, 1);

      const component = mount(
        <DateTimeRangePicker value={value} />
      );

      const dateTimeInput = component.find('DateTimeInput');

      expect(dateTimeInput.at(0).prop('value')).toBe(value);
      expect(dateTimeInput.at(1).prop('value')).toBe(undefined);
    });

    it('passes the first item of an array of values to DateTimeInput components', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const component = mount(
        <DateTimeRangePicker value={[value1, value2]} />
      );

      const dateTimeInput = component.find('DateTimeInput');

      expect(dateTimeInput.at(0).prop('value')).toBe(value1);
      expect(dateTimeInput.at(1).prop('value')).toBe(value2);
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DateTimeRangePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const component = mount(
      <DateTimeRangePicker
        calendarClassName={calendarClassName}
        isCalendarOpen
      />
    );

    const calendar = component.find('Calendar');
    const calendarWrapperClassName = calendar.prop('className');

    expect(calendarWrapperClassName.includes(calendarClassName)).toBe(true);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const component = mount(
      <DateTimeRangePicker
        clockClassName={clockClassName}
        isClockOpen
      />
    );

    const clock = component.find('Clock');
    const calendarWrapperClassName = clock.prop('className');

    expect(calendarWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders DateTimeInput components', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput).toHaveLength(2);
  });

  it('renders range divider', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const rangeDivider = component.find('.react-datetimerange-picker__range-divider');

    expect(rangeDivider).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const clearButton = component.find('button.react-datetimerange-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendarButton = component.find('button.react-datetimerange-picker__calendar-button');

    expect(calendarButton).toHaveLength(1);
  });

  it('renders DateTimeInput and Calendar components when given isCalendarOpen flag', () => {
    const component = mount(
      <DateTimeRangePicker isCalendarOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateTimeInput).toHaveLength(2);
    expect(calendar).toHaveLength(1);
  });

  it('renders DateTimeInput and Clock components when given isClockOpen flag', () => {
    const component = mount(
      <DateTimeRangePicker isClockOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Clock');

    expect(dateTimeInput).toHaveLength(2);
    expect(calendar).toHaveLength(1);
  });

  it('does not render Calendar component when given disableCalendar & isCalendarOpen flags', () => {
    const component = mount(
      <DateTimeRangePicker disableCalendar isCalendarOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const calendar = component.find('Calendar');

    expect(dateTimeInput).toHaveLength(2);
    expect(calendar).toHaveLength(0);
  });

  it('does not render Clock component when given disableClock & isClockOpen flags', () => {
    const component = mount(
      <DateTimeRangePicker disableClock isClockOpen />
    );

    const dateTimeInput = component.find('DateTimeInput');
    const clock = component.find('Clock');

    expect(dateTimeInput).toHaveLength(2);
    expect(clock).toHaveLength(0);
  });

  it('opens Calendar component when given isCalendarOpen flag by changing props', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendar = component.find('Calendar');

    expect(calendar).toHaveLength(0);

    component.setProps({ isCalendarOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Clock component when given isClockOpen flag by changing props', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendar = component.find('Clock');

    expect(calendar).toHaveLength(0);

    component.setProps({ isClockOpen: true });
    component.update();

    const calendar2 = component.find('Clock');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when clicking on a button', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-datetimerange-picker__calendar-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when focusing on an input inside', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendar = component.find('Calendar');
    const input = component.find('input[name="day"]').first();

    expect(calendar).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Clock component when focusing on a time input inside', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const clock = component.find('Clock');
    const input = component.find('input[name^="hour"]').first();

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Calendar component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isCalendarOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Calendar component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isCalendarOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Calendar component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isCalendarOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isClockOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isClockOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('closes Clock component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DateTimeRangePicker isClockOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Calendar component when focused within date inputs', () => {
    const component = mount(
      <DateTimeRangePicker isCalendarOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.simulate('blur');
    monthInput.simulate('focus');
    component.update();

    expect(component.state('isCalendarOpen')).toBe(true);
    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Clock component when focused within time inputs', () => {
    const component = mount(
      <DateTimeRangePicker isClockOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(3);
    const minuteInput = customInputs.at(4);

    hourInput.simulate('blur');
    minuteInput.simulate('focus');
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
    expect(component.state('isClockOpen')).toBe(true);
  });

  it('closes Clock when Calendar is opened by a click on the calendar icon', () => {
    const component = mount(
      <DateTimeRangePicker isClockOpen />
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-datetimerange-picker__calendar-button');

    expect(clock).toHaveLength(1);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Calendar when calling internal onChange', () => {
    const component = mount(
      <DateTimeRangePicker isCalendarOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isCalendarOpen')).toBe(false);
  });

  it('does not close Calendar when calling internal onChange with closeWidgets = false', () => {
    const component = mount(
      <DateTimeRangePicker isCalendarOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isCalendarOpen')).toBe(true);
  });

  it('closes Clock when calling internal onChange', () => {
    const component = mount(
      <DateTimeRangePicker isClockOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Clock when calling internal onChange with closeWidgets = false', () => {
    const component = mount(
      <DateTimeRangePicker isClockOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isClockOpen')).toBe(true);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    const component = mount(
      <DateTimeRangePicker onChange={onChange} />
    );

    const { onChange: onChangeInternal } = component.instance();

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const valueFrom = new Date(2018, 6, 17, hours, minutes, seconds, ms);
    const nextValueFrom = new Date(2019, 0, 1);
    const valueTo = new Date(2019, 6, 17);
    const onChange = jest.fn();

    const component = mount(
      <DateTimeRangePicker
        onChange={onChange}
        value={[valueFrom, valueTo]}
      />
    );

    const { onDateChange } = component.instance();

    onDateChange([nextValueFrom, valueTo]);

    expect(onChange).toHaveBeenCalledWith([
      new Date(2019, 0, 1, hours, minutes, seconds, ms),
      valueTo
    ]);
  });

  it('calls onChange callback with merged new date & old time when calling internal onDateChange', () => {
    const hours = 21;
    const minutes = 40;
    const seconds = 11;
    const ms = 458;

    const valueFrom = new Date(2018, 6, 17);
    const valueTo = new Date(2019, 6, 17, hours, minutes, seconds, ms);
    const nextValueTo = new Date(2019, 0, 1);
    const onChange = jest.fn();

    const component = mount(
      <DateTimeRangePicker
        onChange={onChange}
        value={[valueFrom, valueTo]}
      />
    );

    const { onDateChange } = component.instance();

    onDateChange([valueFrom, nextValueTo]);

    expect(onChange).toHaveBeenCalledWith([
      valueFrom,
      new Date(2019, 0, 1, hours, minutes, seconds, ms),
    ]);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const nextValue = new Date(2019, 0, 1, 21, 40, 11, 458);
    const onChange = jest.fn();

    const component = mount(
      <DateTimeRangePicker
        onChange={onChange}
        value={new Date(2018, 6, 17)}
      />
    );

    const { onChange: onChangeInternal } = component.instance();

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const component = mount(
      <DateTimeRangePicker onChange={onChange} />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-datetimerange-picker__clear-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', () => {
      const component = mount(
        <DateTimeRangePicker />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], true);
    });

    it('calls onChange properly given single initial value', () => {
      const value = new Date(2018, 0, 1);

      const component = mount(
        <DateTimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], true);
    });

    it('calls onChange properly given initial value as an array', () => {
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      const component = mount(
        <DateTimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, valueTo], true);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', () => {
      const component = mount(
        <DateTimeRangePicker />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([undefined, nextValueTo], true);
    });

    it('calls onChange properly given single initial value', () => {
      const value = new Date(2018, 0, 1);

      const component = mount(
        <DateTimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([value, nextValueTo], true);
    });

    it('calls onChange properly given initial value as an array', () => {
      const valueFrom = new Date(2018, 0, 1);
      const valueTo = new Date(2018, 6, 1);
      const value = [valueFrom, valueTo];

      const component = mount(
        <DateTimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = new Date();
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([valueFrom, nextValueTo], true);
    });
  });
});
