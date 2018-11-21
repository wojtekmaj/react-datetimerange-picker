import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import detectElementOverflow from 'detect-element-overflow';

import Calendar from 'react-calendar/dist/entry.nostyle';
import Clock from 'react-clock/dist/entry.nostyle';
import DateTimeInput from 'react-datetime-picker/dist/DateTimeInput';

const allViews = ['hour', 'minute', 'second'];
const baseClassName = 'react-datetimerange-picker';

export default class DateTimeRangePicker extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    if (nextProps.isCalendarOpen !== prevState.isCalendarOpenProps) {
      nextState.isCalendarOpen = nextProps.isCalendarOpen;
      nextState.isCalendarOpenProps = nextProps.isCalendarOpen;
    }

    if (nextProps.isClockOpen !== prevState.isClockOpenProps) {
      nextState.isClockOpen = nextProps.isClockOpen;
      nextState.isClockOpenProps = nextProps.isClockOpen;
    }

    return nextState;
  }

  state = {};

  get eventProps() {
    return makeEventProps(this.props);
  }

  onDateChange = ([valueFrom, valueTo], closeWidgets = true) => {
    const { value } = this.props;
    const [prevValueFrom, prevValueTo] = [].concat(value);

    const nextValueFrom = (() => {
      if (!prevValueFrom) {
        return valueFrom;
      }

      const valueWithHour = new Date(valueFrom);
      valueWithHour.setHours(
        prevValueFrom.getHours(),
        prevValueFrom.getMinutes(),
        prevValueFrom.getSeconds(),
        prevValueFrom.getMilliseconds(),
      );

      return valueWithHour;
    })();

    const nextValueTo = (() => {
      if (!prevValueTo) {
        return valueTo;
      }

      const valueWithHour = new Date(valueTo);
      valueWithHour.setHours(
        prevValueTo.getHours(),
        prevValueTo.getMinutes(),
        prevValueTo.getSeconds(),
        prevValueTo.getMilliseconds(),
      );

      return valueWithHour;
    })();

    this.onChange([nextValueFrom, nextValueTo], closeWidgets);
  }

  onChange = (value, closeWidgets = true) => {
    this.setState(prevState => ({
      isCalendarOpen: prevState.isCalendarOpen && !closeWidgets,
      isClockOpen: prevState.isClockOpen && !closeWidgets,
    }));

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  onChangeFrom = (valueFrom, closeWidgets = true) => {
    const { value } = this.props;
    const [, valueTo] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeWidgets);
  }

  onChangeTo = (valueTo, closeWidgets = true) => {
    const { value } = this.props;
    const [valueFrom] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeWidgets);
  }

  onFocus = (event) => {
    const { disabled, onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year':
        this.openCalendar();
        break;
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second':
        this.openClock();
        break;
      default:
    }
  }

  onBlur = () => {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur(event);
    }

    this.closeWidgets();
  }

  openClock = () => {
    this.setState({
      isCalendarOpen: false,
      isClockOpen: true,
    });
  }

  openCalendar = () => {
    this.setState({
      isCalendarOpen: true,
      isClockOpen: false,
    });
  }

  toggleCalendar = () => {
    this.setState(prevState => ({
      isCalendarOpen: !prevState.isCalendarOpen,
      isClockOpen: false,
    }));
  }

  closeWidgets = () => {
    this.setState((prevState) => {
      if (!prevState.isCalendarOpen && !prevState.isClockOpen) {
        return null;
      }

      return {
        isCalendarOpen: false,
        isClockOpen: false,
      };
    });
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  renderInputs() {
    const {
      calendarIcon,
      clearIcon,
      disabled,
      locale,
      maxDetail,
      maxDate,
      minDate,
      name,
      required,
      showLeadingZeros,
      value,
    } = this.props;

    const { isCalendarOpen, isClockOpen } = this.state;

    const [valueFrom, valueTo] = [].concat(value);

    const commonProps = {
      className: `${baseClassName}__inputGroup`,
      disabled,
      isWidgetOpen: isCalendarOpen || isClockOpen,
      locale,
      maxDate,
      maxDetail,
      minDate,
      required,
      showLeadingZeros,
    };

    return (
      <div className={`${baseClassName}__wrapper`}>
        <DateTimeInput
          {...commonProps}
          name={`${name}_from`}
          onChange={this.onChangeFrom}
          returnValue="start"
          value={valueFrom}
        />
        –
        <DateTimeInput
          {...commonProps}
          name={`${name}_to`}
          onChange={this.onChangeTo}
          returnValue="end"
          value={valueTo}
        />
        {clearIcon !== null && (
          <button
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && (
          <button
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            onBlur={this.resetValue}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
      </div>
    );
  }

  renderCalendar() {
    const { isCalendarOpen } = this.state;

    if (isCalendarOpen === null) {
      return null;
    }

    const {
      calendarClassName,
      className: dateTimeRangePickerClassName, // Unused, here to exclude it from calendarProps
      maxDetail: dateTimeRangePickerMaxDetail, // Unused, here to exclude it from calendarProps
      onChange,
      value,
      ...calendarProps
    } = this.props;

    const className = `${baseClassName}__calendar`;

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isCalendarOpen ? 'open' : 'closed'}`,
        )}
        ref={(ref) => {
          if (!ref || !isCalendarOpen) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            const overflowTopAfterChange = (
              collisions.overflowTop + ref.clientHeight + this.wrapper.clientHeight
            );

            // If it's going to make situation any better, display the calendar above the input
            if (overflowTopAfterChange < collisions.overflowBottom) {
              ref.classList.add(`${className}--above-label`);
            }
          }
        }}
      >
        <Calendar
          className={calendarClassName}
          onChange={this.onDateChange}
          selectRange
          value={value || null}
          {...calendarProps}
        />
      </div>
    );
  }

  renderClock() {
    const { disableClock } = this.props;
    const { isClockOpen } = this.state;

    if (isClockOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: dateTimeRangePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      value: dateTimeRangePickerValue,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;

    const maxDetailIndex = allViews.indexOf(maxDetail);

    const value = [].concat(dateTimeRangePickerValue)[0]; // TODO: Show clock for "date to" inputs

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isClockOpen ? 'open' : 'closed'}`,
        )}
        ref={(ref) => {
          if (!ref || !isClockOpen) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            const overflowTopAfterChange = (
              collisions.overflowTop + ref.clientHeight + this.wrapper.clientHeight
            );

            // If it's going to make situation any better, display the calendar above the input
            if (overflowTopAfterChange < collisions.overflowBottom) {
              ref.classList.add(`${className}--above-label`);
            }
          }
        }}
      >
        <Clock
          className={clockClassName}
          renderMinuteHand={maxDetailIndex > 0}
          renderSecondHand={maxDetailIndex > 1}
          value={value}
          {...clockProps}
        />
      </div>
    );
  }

  render() {
    const { className, disabled } = this.props;
    const { isCalendarOpen, isClockOpen } = this.state;

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          `${baseClassName}--${isCalendarOpen || isClockOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        {...this.eventProps}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.wrapper = ref;
        }}
      >
        {this.renderInputs()}
        {this.renderCalendar()}
        {this.renderClock()}
      </div>
    );
  }
}

const CalendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <rect width="15" height="15" x="2" y="2" fill="none" />
      <line x1="6" y1="0" x2="6" y2="4" />
      <line x1="13" y1="0" x2="13" y2="4" />
    </g>
  </svg>
);

const ClearIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <line x1="4" y1="4" x2="15" y2="15" />
      <line x1="15" y1="4" x2="4" y2="15" />
    </g>
  </svg>
);

DateTimeRangePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  isCalendarOpen: null,
  isClockOpen: null,
  maxDetail: 'minute',
  name: 'datetimerange',
};

DateTimeRangePicker.propTypes = {
  ...Calendar.propTypes,
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.node,
  disabled: PropTypes.bool,
  disableClock: PropTypes.bool,
  isCalendarOpen: PropTypes.bool,
  isClockOpen: PropTypes.bool,
  maxDetail: PropTypes.oneOf(allViews),
  name: PropTypes.string,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
};

polyfill(DateTimeRangePicker);
