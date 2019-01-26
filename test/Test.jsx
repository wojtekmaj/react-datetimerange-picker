import React, { Component } from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker/src/entry.nostyle';
import '@wojtekmaj/react-datetimerange-picker/src/DateTimeRangePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-calendar/src/Calendar.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-clock/src/Clock.less';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.less';

const now = new Date();

export default class Test extends Component {
  state = {
    disabled: false,
    locale: null,
    maxDate: new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 12),
    maxDetail: 'minute',
    minDate: new Date(1995, now.getUTCMonth() + 1, 15, 12),
    required: true,
    showLeadingZeros: true,
    showNeighboringMonth: false,
    showWeekNumbers: false,
    value: now,
  }

  onChange = value => this.setState({ value })

  render() {
    const {
      disabled,
      locale,
      maxDate,
      maxDetail,
      minDate,
      required,
      showLeadingZeros,
      showNeighboringMonth,
      showWeekNumbers,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    return (
      <div className="Test">
        <header>
          <h1>
            react-datetimerange-picker test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <MaxDetailOptions
              maxDetail={maxDetail}
              setState={setState}
            />
            <ValidityOptions
              maxDate={maxDate}
              minDate={minDate}
              required={required}
              setState={setState}
            />
            <LocaleOptions
              setState={setState}
              locale={locale}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
            <ViewOptions
              disabled={disabled}
              setState={setState}
              showLeadingZeros={showLeadingZeros}
              showNeighboringMonth={showNeighboringMonth}
              showWeekNumbers={showWeekNumbers}
            />
          </aside>
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                /* eslint-disable no-console */
                console.warn('Calendar triggered submitting the form.');
                console.log(event);
                /* eslint-enable no-console */
              }}
            >
              <DateTimeRangePicker
                className="myCustomDateTimeRangePickerClassName"
                calendarClassName="myCustomCalendarClassName"
                disabled={disabled}
                locale={locale}
                maxDate={maxDate}
                maxDetail={maxDetail}
                minDate={minDate}
                name="myCustomName"
                onChange={this.onChange}
                required={required}
                showLeadingZeros={showLeadingZeros}
                showNeighboringMonth={showNeighboringMonth}
                showWeekNumbers={showWeekNumbers}
                value={value}
              />
              <br />
              <br />
              <button
                type="submit"
                id="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
