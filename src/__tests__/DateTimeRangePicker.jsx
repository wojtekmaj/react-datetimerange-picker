import React from 'react';
import { mount } from 'enzyme';

import DateTimeRangePicker from '../DateTimeRangePicker';

/* eslint-disable comma-dangle */

const mockDocumentListeners = () => {
  const eventMap = {};
  document.addEventListener = jest.fn((method, cb) => {
    if (!eventMap[method]) {
      eventMap[method] = [];
    }
    eventMap[method].push(cb);
  });

  return {
    simulate: (method, args) => {
      eventMap[method].forEach(cb => cb(args));
    },
  };
};

describe('DateTimeRangePicker', () => {
  it('passes name to DateTimeInput', () => {
    const name = 'testName';

    const component = mount(
      <DateTimeRangePicker name={name} />
    );

    const dateTimeInput = component.find('DateTimeInput');

    expect(dateTimeInput.at(0).prop('name')).toBe(`${name}_from`);
    expect(dateTimeInput.at(1).prop('name')).toBe(`${name}_to`);
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

  it('closes Calendar and Clock component when clicked outside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <DateTimeRangePicker isCalendarOpen isClockOpen />
    );

    simulate('mousedown', {
      target: document,
    });
    component.update();

    expect(component.state('isCalendarOpen')).toBe(false);
    expect(component.state('isClockOpen')).toBe(false);
  });

  it('does not close Calendar and Clock component when clicked inside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <DateTimeRangePicker isCalendarOpen isClockOpen />
    );

    simulate('mousedown', {
      target: component.getDOMNode(),
    });
    component.update();

    expect(component.state('isCalendarOpen')).toBe(true);
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
});
