import { useRef, useState } from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import ValidityOptions from './ValidityOptions.js';
import MaxDetailOptions from './MaxDetailOptions.js';
import LocaleOptions from './LocaleOptions.js';
import ValueOptions from './ValueOptions.js';
import ViewOptions from './ViewOptions.js';

import './Test.css';

import type { Detail, LooseValue } from './shared/types.js';

const now = new Date();

const nineteenNinetyFive = new Date(1995, now.getUTCMonth() + 1, 15, 12);
const fifteenthOfNextMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 15, 12);

export default function Test() {
  const portalContainer = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const [locale, setLocale] = useState<string>();
  const [maxDate, setMaxDate] = useState<Date | undefined>(fifteenthOfNextMonth);
  const [maxDetail, setMaxDetail] = useState<Detail>('minute');
  const [minDate, setMinDate] = useState<Date | undefined>(nineteenNinetyFive);
  const [renderInPortal, setRenderInPortal] = useState(false);
  const [required, setRequired] = useState(true);
  const [showLeadingZeros, setShowLeadingZeros] = useState(true);
  const [showNeighboringMonth, setShowNeighboringMonth] = useState(false);
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [value, setValue] = useState<LooseValue>(now);

  return (
    <div className="Test">
      <header>
        <h1>react-datetimerange-picker test page</h1>
      </header>
      <div className="Test__container">
        <aside className="Test__container__options">
          <MaxDetailOptions maxDetail={maxDetail} setMaxDetail={setMaxDetail} />
          <ValidityOptions
            maxDate={maxDate}
            minDate={minDate}
            required={required}
            setMaxDate={setMaxDate}
            setMinDate={setMinDate}
            setRequired={setRequired}
          />
          <LocaleOptions locale={locale} setLocale={setLocale} />
          <ValueOptions setValue={setValue} value={value} />
          <ViewOptions
            disabled={disabled}
            renderInPortal={renderInPortal}
            setDisabled={setDisabled}
            setRenderInPortal={setRenderInPortal}
            setShowLeadingZeros={setShowLeadingZeros}
            setShowNeighboringMonth={setShowNeighboringMonth}
            setShowWeekNumbers={setShowWeekNumbers}
            showLeadingZeros={showLeadingZeros}
            showNeighboringMonth={showNeighboringMonth}
            showWeekNumbers={showWeekNumbers}
          />
        </aside>
        <main className="Test__container__content">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              console.warn('Calendar triggered submitting the form.');
              console.log(event);
            }}
          >
            <DateTimeRangePicker
              calendarProps={{
                className: 'myCustomCalendarClassName',
                showNeighboringMonth,
                showWeekNumbers,
              }}
              className="myCustomDateTimeRangePickerClassName"
              data-testid="myCustomDateTimeRangePicker"
              disabled={disabled}
              locale={locale}
              maxDate={maxDate}
              maxDetail={maxDetail}
              minDate={minDate}
              name="myCustomName"
              onCalendarClose={() => console.log('Calendar closed')}
              onCalendarOpen={() => console.log('Calendar opened')}
              onChange={setValue}
              onClockClose={() => console.log('Clock closed')}
              onClockOpen={() => console.log('Clock opened')}
              portalContainer={renderInPortal ? portalContainer.current : undefined}
              required={required}
              showLeadingZeros={showLeadingZeros}
              value={value}
            />
            <div ref={portalContainer} />
            <br />
            <br />
            <button type="submit">Submit</button>
          </form>
        </main>
      </div>
    </div>
  );
}
