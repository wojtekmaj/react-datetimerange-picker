import { useId } from 'react';
import { getISOLocalDateTime } from '@wojtekmaj/date-utils';

import type { LooseValue } from './shared/types.js';

type ValueOptionsProps = {
  setValue: (value: LooseValue) => void;
  value?: LooseValue;
};

export default function ValueOptions({ setValue, value }: ValueOptionsProps) {
  const startDatetimeId = useId();
  const endDatetimeId = useId();

  const [startDate, endDate] = Array.isArray(value) ? value : [value, null];

  function setStartValue(nextStartDate: string | Date | null) {
    if (!nextStartDate) {
      setValue(endDate);
      return;
    }

    if (Array.isArray(value)) {
      setValue([nextStartDate, endDate]);
    } else {
      setValue(nextStartDate);
    }
  }

  function setEndValue(nextEndDate: string | Date | null) {
    if (!nextEndDate) {
      setValue(startDate || null);
      return;
    }

    setValue([startDate || null, nextEndDate]);
  }

  function onStartChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;
    setStartValue(nextValue ? new Date(nextValue) : null);
  }

  function onEndChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setEndValue(nextValue ? new Date(nextValue) : null);
  }

  return (
    <fieldset>
      <legend>Value options</legend>

      <div>
        <label htmlFor={startDatetimeId}>Start date</label>
        <input
          id={startDatetimeId}
          onChange={onStartChange}
          type="datetime-local"
          value={
            startDate && startDate instanceof Date
              ? getISOLocalDateTime(startDate)
              : startDate || undefined
          }
        />
        &nbsp;
        <button onClick={() => setStartValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setStartValue('')} type="button">
          Clear to empty string
        </button>
      </div>

      <div>
        <label htmlFor={endDatetimeId}>End date</label>
        <input
          id={endDatetimeId}
          onChange={onEndChange}
          type="datetime-local"
          value={
            endDate && endDate instanceof Date ? getISOLocalDateTime(endDate) : endDate || undefined
          }
        />
        &nbsp;
        <button onClick={() => setEndValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setEndValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}
