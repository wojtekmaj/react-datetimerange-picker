import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import Fit from 'react-fit';

import DateTimeInput from 'react-datetime-picker/dist/cjs/DateTimeInput';

import { isMaxDate, isMinDate } from './shared/propTypes';

import type { ClassName, Detail, LooseValue, Value } from './shared/types';

const baseClassName = 'react-datetimerange-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['hour', 'minute', 'second'];

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

type Icon = React.ReactElement | string;

type IconOrRenderFunction = Icon | React.ComponentType | React.ReactElement;

type CalendarProps = Omit<
  React.ComponentPropsWithoutRef<typeof Calendar>,
  'className' | 'maxDetail' | 'onChange'
>;

type ClockProps = Omit<React.ComponentPropsWithoutRef<typeof Clock>, 'value'>;

type EventProps = ReturnType<typeof makeEventProps>;

type DateTimeRangePickerProps = {
  amPmAriaLabel?: string;
  autoFocus?: boolean;
  calendarAriaLabel?: string;
  calendarClassName?: ClassName;
  calendarIcon?: IconOrRenderFunction | null;
  className?: ClassName;
  clearAriaLabel?: string;
  clearIcon?: IconOrRenderFunction | null;
  clockClassName?: ClassName;
  closeWidgets?: boolean;
  'data-testid'?: string;
  dayAriaLabel?: string;
  dayPlaceholder?: string;
  disableCalendar?: boolean;
  disableClock?: boolean;
  disabled?: boolean;
  format?: string;
  hourAriaLabel?: string;
  hourPlaceholder?: string;
  id?: string;
  isCalendarOpen?: boolean;
  isClockOpen?: boolean;
  locale?: string;
  maxDate?: Date;
  maxDetail?: Detail;
  minDate?: Date;
  minuteAriaLabel?: string;
  minutePlaceholder?: string;
  monthAriaLabel?: string;
  monthPlaceholder?: string;
  name?: string;
  nativeInputAriaLabel?: string;
  onCalendarClose?: () => void;
  onCalendarOpen?: () => void;
  onChange?: (value: Value) => void;
  onClockClose?: () => void;
  onClockOpen?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  openWidgetsOnFocus?: boolean;
  portalContainer?: HTMLElement | null;
  rangeDivider?: React.ReactNode;
  required?: boolean;
  secondAriaLabel?: string;
  secondPlaceholder?: string;
  showLeadingZeros?: boolean;
  value?: LooseValue;
  yearAriaLabel?: string;
  yearPlaceholder?: string;
} & CalendarProps &
  ClockProps &
  EventProps;

export default function DateTimeRangePicker(props: DateTimeRangePickerProps) {
  const {
    amPmAriaLabel,
    autoFocus,
    calendarAriaLabel,
    calendarIcon = CalendarIcon,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    closeWidgets: shouldCloseWidgetsProps = true,
    'data-testid': dataTestid,
    dayAriaLabel,
    dayPlaceholder,
    disableCalendar,
    disableClock,
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder,
    id,
    isCalendarOpen: isCalendarOpenProps = null,
    isClockOpen: isClockOpenProps = null,
    locale,
    maxDate,
    maxDetail = 'minute',
    minDate,
    minuteAriaLabel,
    minutePlaceholder,
    monthAriaLabel,
    monthPlaceholder,
    name = 'datetimerange',
    nativeInputAriaLabel,
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onClockClose,
    onClockOpen,
    onFocus: onFocusProps,
    openWidgetsOnFocus = true,
    rangeDivider = '–',
    required,
    secondAriaLabel,
    secondPlaceholder,
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  } = props;

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean | null>(isCalendarOpenProps);
  const [isClockOpen, setIsClockOpen] = useState<boolean | null>(isClockOpenProps);
  const wrapper = useRef<HTMLDivElement>(null);
  const calendarWrapper = useRef<HTMLDivElement>(null);
  const clockWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCalendarOpen(isCalendarOpenProps);
  }, [isCalendarOpenProps]);

  useEffect(() => {
    setIsClockOpen(isClockOpenProps);
  }, [isClockOpenProps]);

  function openCalendar() {
    setIsClockOpen(false);
    setIsCalendarOpen(true);

    if (onCalendarOpen) {
      onCalendarOpen();
    }
  }

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);

    if (onCalendarClose) {
      onCalendarClose();
    }
  }, [onCalendarClose]);

  function toggleCalendar() {
    if (isCalendarOpen) {
      closeCalendar();
    } else {
      openCalendar();
    }
  }

  function openClock() {
    setIsCalendarOpen(false);
    setIsClockOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(() => {
    setIsClockOpen(false);

    if (onClockClose) {
      onClockClose();
    }
  }, [onClockClose]);

  const closeWidgets = useCallback(() => {
    closeCalendar();
    closeClock();
  }, [closeCalendar, closeClock]);

  function onChange(value: Value, shouldCloseWidgets = shouldCloseWidgetsProps) {
    if (shouldCloseWidgets) {
      closeWidgets();
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onChangeFrom(valueFrom: Date | null, closeCalendar: boolean) {
    const [, valueTo] = Array.isArray(value) ? value : [value];

    const valueToDate = valueTo ? new Date(valueTo) : null;

    onChange([valueFrom, valueToDate], closeCalendar);
  }

  function onChangeTo(valueTo: Date | null, closeCalendar: boolean) {
    const [valueFrom] = Array.isArray(value) ? value : [value];

    const valueFromDate = valueFrom ? new Date(valueFrom) : null;

    onChange([valueFromDate, valueTo], closeCalendar);
  }

  type DatePiece = Date | null;

  function onDateChange(
    nextValue: DatePiece | [DatePiece, DatePiece],
    shouldCloseWidgets?: boolean,
  ) {
    // React-Calendar passes an array of values when selectRange is enabled
    const [rawNextValueFrom, rawNextValueTo] = Array.isArray(nextValue) ? nextValue : [nextValue];
    const [valueFrom, valueTo] = Array.isArray(value) ? value : [value];

    const nextValueFrom = (() => {
      if (!valueFrom || !rawNextValueFrom) {
        return rawNextValueFrom;
      }

      const valueFromDate = new Date(valueFrom);
      const nextValueFromWithHour = new Date(rawNextValueFrom);
      nextValueFromWithHour.setHours(
        valueFromDate.getHours(),
        valueFromDate.getMinutes(),
        valueFromDate.getSeconds(),
        valueFromDate.getMilliseconds(),
      );

      return nextValueFromWithHour;
    })();

    const nextValueTo = (() => {
      if (!valueTo || !rawNextValueTo) {
        return rawNextValueTo;
      }

      const valueToDate = new Date(valueTo);
      const nextValueToWithHour = new Date(rawNextValueTo);
      nextValueToWithHour.setHours(
        valueToDate.getHours(),
        valueToDate.getMinutes(),
        valueToDate.getSeconds(),
        valueToDate.getMilliseconds(),
      );

      return nextValueToWithHour;
    })();

    onChange([nextValueFrom || null, nextValueTo || null], shouldCloseWidgets);
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isCalendarOpen ||
      isClockOpen ||
      !openWidgetsOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    switch (event.target.name) {
      case 'day':
      case 'month':
      case 'year':
        openCalendar();
        break;
      case 'hour12':
      case 'hour24':
      case 'minute':
      case 'second':
        openClock();
        break;
      default:
    }
  }

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeWidgets();
      }
    },
    [closeWidgets],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: React.FocusEvent) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event: Event) => {
      const { current: wrapperEl } = wrapper;
      const { current: calendarWrapperEl } = calendarWrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = (
        'composedPath' in event ? event.composedPath()[0] : (event as Event).target
      ) as HTMLElement;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!calendarWrapperEl || !calendarWrapperEl.contains(target)) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeWidgets();
      }
    },
    [calendarWrapper, clockWrapper, closeWidgets, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isCalendarOpen || isClockOpen) => {
      outsideActionEvents.forEach((event) => {
        if (shouldListen) {
          document.addEventListener(event, onOutsideAction);
        } else {
          document.removeEventListener(event, onOutsideAction);
        }
      });

      if (shouldListen) {
        document.addEventListener('keydown', onKeyDown);
      } else {
        document.removeEventListener('keydown', onKeyDown);
      }
    },
    [isCalendarOpen, isClockOpen, onOutsideAction, onKeyDown],
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners]);

  function renderInputs() {
    const [valueFrom, valueTo] = Array.isArray(value) ? value : [value];

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
          onChange={onChangeFrom}
          value={valueFrom}
        />
        <span className={`${baseClassName}__range-divider`}>{rangeDivider}</span>
        <DateTimeInput {...commonProps} name={`${name}_to`} onChange={onChangeTo} value={valueTo} />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={clear}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clearIcon === 'function' ? React.createElement(clearIcon) : clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleCalendar}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof calendarIcon === 'function' ? React.createElement(calendarIcon) : calendarIcon}
          </button>
        )}
      </div>
    );
  }

  function renderCalendar() {
    if (isCalendarOpen === null || disableCalendar) {
      return null;
    }

    const {
      calendarClassName,
      className: dateTimeRangePickerClassName, // Unused, here to exclude it from calendarProps
      maxDetail: dateTimeRangePickerMaxDetail, // Unused, here to exclude it from calendarProps
      onChange: onChangeProps, // Unused, here to exclude it from calendarProps
      portalContainer,
      value,
      ...calendarProps
    } = props;

    const className = `${baseClassName}__calendar`;
    const classNames = clsx(className, `${className}--${isCalendarOpen ? 'open' : 'closed'}`);

    const calendar = (
      <Calendar
        className={calendarClassName}
        onChange={(value) => onDateChange(value)}
        selectRange
        value={value}
        {...calendarProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={calendarWrapper} className={classNames}>
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

  function renderClock() {
    if (isClockOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: dateTimePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail = 'minute',
      onChange,
      portalContainer,
      value,
      ...clockProps
    } = props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isClockOpen ? 'open' : 'closed'}`);

    const [valueFrom] = Array.isArray(value) ? value : [value];

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
        <div ref={clockWrapper} className={classNames}>
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

  const eventProps = useMemo(() => makeEventProps(otherProps), [otherProps]);

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
      {...eventProps}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderCalendar()}
      {renderClock()}
    </div>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]);

DateTimeRangePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  calendarIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
  value: isValueOrValueArray,
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
