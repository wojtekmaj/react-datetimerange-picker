import React, { createRef, PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Calendar from 'react-calendar';
import Fit from 'react-fit';

import Clock from 'react-clock';
import DateTimeInput from 'react-datetime-picker/dist/DateTimeInput';

import { isMaxDate, isMinDate } from './shared/propTypes';

const allViews = ['hour', 'minute', 'second'];
const baseClassName = 'react-datetimerange-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];

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

  wrapper = createRef();

  calendarWrapper = createRef();

  clockWrapper = createRef();

  componentDidMount() {
    this.handleOutsideActionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isCalendarOpen, isClockOpen } = this.state;
    const { onCalendarClose, onCalendarOpen, onClockClose, onClockOpen } = this.props;

    const isWidgetOpen = isCalendarOpen || isClockOpen;
    const prevIsWidgetOpen = prevState.isCalendarOpen || prevState.isClockOpen;

    if (isWidgetOpen !== prevIsWidgetOpen) {
      this.handleOutsideActionListeners();
    }

    if (isCalendarOpen !== prevState.isCalendarOpen) {
      const callback = isCalendarOpen ? onCalendarOpen : onCalendarClose;
      if (callback) callback();
    }

    if (isClockOpen !== prevState.isClockOpen) {
      const callback = isClockOpen ? onClockOpen : onClockClose;
      if (callback) callback();
    }
  }

  componentWillUnmount() {
    this.handleOutsideActionListeners(false);
  }

  get eventProps() {
    return makeEventProps(this.props);
  }

  onOutsideAction = (event) => {
    const { wrapper, calendarWrapper, clockWrapper } = this;

    // Try event.composedPath first to handle clicks inside a Shadow DOM.
    const target = 'composedPath' in event ? event.composedPath()[0] : event.target;

    if (
      wrapper.current &&
      !wrapper.current.contains(target) &&
      (!calendarWrapper.current || !calendarWrapper.current.contains(target)) &&
      (!clockWrapper.current || !clockWrapper.current.contains(target))
    ) {
      this.closeWidgets();
    }
  };

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
  };

  onChange = (value, closeWidgets = this.props.closeWidgets) => {
    const { onChange } = this.props;

    if (closeWidgets) {
      this.closeWidgets();
    }

    if (onChange) {
      onChange(value);
    }
  };

  onChangeFrom = (valueFrom, closeWidgets) => {
    const { value } = this.props;
    const [, valueTo] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeWidgets);
  };

  onChangeTo = (valueTo, closeWidgets) => {
    const { value } = this.props;
    const [valueFrom] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeWidgets);
  };

  onFocus = (event) => {
    const { disabled, onFocus, openWidgetsOnFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    if (openWidgetsOnFocus) {
      if (event.target.dataset.select === 'true') {
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
  };

  onKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.closeWidgets();
    }
  };

  openClock = () => {
    this.setState((prevState) => {
      const nextState = { isClockOpen: true };

      if (prevState.isCalendarOpen) {
        nextState.isCalendarOpen = false;
      }

      return nextState;
    });
  };

  openCalendar = () => {
    this.setState((prevState) => {
      const nextState = { isCalendarOpen: true };

      if (prevState.isClockOpen) {
        nextState.isClockOpen = false;
      }

      return nextState;
    });
  };

  toggleCalendar = () => {
    this.setState((prevState) => {
      const nextState = { isCalendarOpen: !prevState.isCalendarOpen };

      if (prevState.isClockOpen) {
        nextState.isClockOpen = false;
      }

      return nextState;
    });
  };

  closeWidgets = () => {
    this.setState((prevState) => {
      const nextState = {};

      if (prevState.isCalendarOpen) {
        nextState.isCalendarOpen = false;
      }

      if (prevState.isClockOpen) {
        nextState.isClockOpen = false;
      }

      return nextState;
    });
  };

  stopPropagation = (event) => event.stopPropagation();

  clear = () => this.onChange(null);

  handleOutsideActionListeners(shouldListen) {
    const { isCalendarOpen, isClockOpen } = this.state;
    const isWidgetOpen = isCalendarOpen || isClockOpen;

    const shouldListenWithFallback =
      typeof shouldListen !== 'undefined' ? shouldListen : isWidgetOpen;
    const fnName = shouldListenWithFallback ? 'addEventListener' : 'removeEventListener';
    outsideActionEvents.forEach((eventName) => document[fnName](eventName, this.onOutsideAction));
    document[fnName]('keydown', this.onKeyDown);
  }

  renderInputs() {
    const {
      amPmAriaLabel,
      autoFocus,
      calendarAriaLabel,
      calendarIcon,
      clearAriaLabel,
      clearIcon,
      dayAriaLabel,
      dayPlaceholder,
      disableCalendar,
      disabled,
      format,
      hourAriaLabel,
      hourPlaceholder,
      locale,
      maxDate,
      maxDetail,
      minDate,
      minuteAriaLabel,
      minutePlaceholder,
      monthAriaLabel,
      monthPlaceholder,
      name,
      nativeInputAriaLabel,
      rangeDivider,
      required,
      secondAriaLabel,
      secondPlaceholder,
      showLeadingZeros,
      value,
      yearAriaLabel,
      yearPlaceholder,
    } = this.props;

    const { isCalendarOpen, isClockOpen } = this.state;

    const [valueFrom, valueTo] = [].concat(value);

    const ariaLabelProps = {
      amPmAriaLabel,
      dayAriaLabel,
      hourAriaLabel,
      minuteAriaLabel,
      monthAriaLabel,
      nativeInputAriaLabel,
      secondAriaLabel,
      yearAriaLabel,
    };

    const placeholderProps = {
      dayPlaceholder,
      hourPlaceholder,
      minutePlaceholder,
      monthPlaceholder,
      secondPlaceholder,
      yearPlaceholder,
    };

    const commonProps = {
      ...ariaLabelProps,
      ...placeholderProps,
      className: `${baseClassName}__inputGroup`,
      disabled,
      format,
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          name={`${name}_from`}
          onChange={this.onChangeFrom}
          returnValue="start"
          value={valueFrom}
        />
        <span className={`${baseClassName}__range-divider`}>{rangeDivider}</span>
        <DateTimeInput
          {...commonProps}
          name={`${name}_to`}
          onChange={this.onChangeTo}
          returnValue="end"
          value={valueTo}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onBlur={this.resetValue}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
      </div>
    );
  }

  renderCalendar() {
    const { disableCalendar } = this.props;
    const { isCalendarOpen } = this.state;

    if (isCalendarOpen === null || disableCalendar) {
      return null;
    }

    const {
      calendarClassName,
      className: dateTimeRangePickerClassName, // Unused, here to exclude it from calendarProps
      maxDetail: dateTimeRangePickerMaxDetail, // Unused, here to exclude it from calendarProps
      onChange,
      portalContainer,
      value,
      ...calendarProps
    } = this.props;

    const className = `${baseClassName}__calendar`;
    const classNames = clsx(className, `${className}--${isCalendarOpen ? 'open' : 'closed'}`);

    const calendar = (
      <Calendar
        className={calendarClassName}
        onChange={(value) => this.onDateChange(value)}
        selectRange
        value={value || null}
        {...calendarProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={this.calendarWrapper} className={classNames}>
          {calendar}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isCalendarOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {calendar}
        </div>
      </Fit>
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
      portalContainer,
      value,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isClockOpen ? 'open' : 'closed'}`);

    const [valueFrom] = [].concat(value);

    const maxDetailIndex = allViews.indexOf(maxDetail);

    const clock = (
      <Clock
        className={clockClassName}
        renderMinuteHand={maxDetailIndex > 0}
        renderSecondHand={maxDetailIndex > 1}
        value={valueFrom}
        {...clockProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={this.clockWrapper} className={classNames}>
          {clock}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isClockOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {clock}
        </div>
      </Fit>
    );
  }

  render() {
    const { eventProps } = this;
    const { className, 'data-testid': dataTestid, disabled, id } = this.props;
    const { isCalendarOpen, isClockOpen } = this.state;

    const { onChange, ...eventPropsWithoutOnChange } = eventProps;

    return (
      <div
        className={clsx(
          baseClassName,
          `${baseClassName}--${isCalendarOpen || isClockOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        data-testid={dataTestid}
        id={id}
        {...eventPropsWithoutOnChange}
        onFocus={this.onFocus}
        ref={this.wrapper}
      >
        {this.renderInputs()}
        {this.renderCalendar()}
        {this.renderClock()}
      </div>
    );
  }
}

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 19,
  height: 19,
  viewBox: '0 0 19 19',
  stroke: 'black',
  strokeWidth: 2,
};

const CalendarIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__calendar-button__icon ${baseClassName}__button__icon`}
  >
    <rect fill="none" height="15" width="15" x="2" y="2" />
    <line x1="6" x2="6" y1="0" y2="4" />
    <line x1="13" x2="13" y1="0" y2="4" />
  </svg>
);

const ClearIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

DateTimeRangePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  closeWidgets: true,
  isCalendarOpen: null,
  isClockOpen: null,
  maxDetail: 'minute',
  name: 'datetimerange',
  openWidgetsOnFocus: true,
  rangeDivider: '–',
};

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

DateTimeRangePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.node,
  clockClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  closeWidgets: PropTypes.bool,
  'data-testid': PropTypes.string,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disableCalendar: PropTypes.bool,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  id: PropTypes.string,
  isCalendarOpen: PropTypes.bool,
  isClockOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  minuteAriaLabel: PropTypes.string,
  minutePlaceholder: PropTypes.string,
  monthAriaLabel: PropTypes.string,
  monthPlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onCalendarClose: PropTypes.func,
  onCalendarOpen: PropTypes.func,
  onChange: PropTypes.func,
  onClockClose: PropTypes.func,
  onClockOpen: PropTypes.func,
  onFocus: PropTypes.func,
  openWidgetsOnFocus: PropTypes.bool,
  portalContainer: PropTypes.object,
  rangeDivider: PropTypes.node,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
