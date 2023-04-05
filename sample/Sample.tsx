import React, { useState } from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

import './Sample.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const now = new Date();
const yesterdayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);

export default function Sample() {
  const [value, onChange] = useState<Value>([yesterdayBegin, todayNoon]);

  return (
    <div className="Sample">
      <header>
        <h1>react-datetimerange-picker sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <DateTimeRangePicker onChange={onChange} value={value} />
        </main>
      </div>
    </div>
  );
}
