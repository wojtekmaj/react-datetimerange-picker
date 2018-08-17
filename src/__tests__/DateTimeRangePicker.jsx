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
  it('passes name to DateInput', () => {
    const name = 'testName';

    const component = mount(
      <DateTimeRangePicker name={name} />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.at(0).prop('name')).toBe(`${name}_from`);
    expect(dateInput.at(1).prop('name')).toBe(`${name}_to`);
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
        isOpen
      />
    );

    const calendar = component.find('Calendar');
    const calendarWrapperClassName = calendar.prop('className');

    expect(calendarWrapperClassName.includes(calendarClassName)).toBe(true);
  });

  it('renders DateInput components', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const dateInput = component.find('DateInput');

    expect(dateInput).toHaveLength(2);
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

  it('renders DateInput and Calendar components when given isOpen flag', () => {
    const component = mount(
      <DateTimeRangePicker isOpen />
    );

    const dateInput = component.find('DateInput');
    const calendar = component.find('Calendar');

    expect(dateInput).toHaveLength(2);
    expect(calendar).toHaveLength(1);
  });

  it('opens Calendar component when given isOpen flag by changing props', () => {
    const component = mount(
      <DateTimeRangePicker />
    );

    const calendar = component.find('Calendar');

    expect(calendar).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

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

  it('closes Calendar component when clicked outside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <DateTimeRangePicker isOpen />
    );

    simulate('mousedown', {
      target: document,
    });
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Calendar component when clicked inside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <DateTimeRangePicker isOpen />
    );

    simulate('mousedown', {
      target: component.getDOMNode(),
    });
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });
});
