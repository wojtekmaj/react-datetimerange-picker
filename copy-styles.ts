import fs from 'node:fs';

fs.copyFile('src/DateTimeRangePicker.css', 'dist/DateTimeRangePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DateTimeRangePicker.css copied successfully.');
});
