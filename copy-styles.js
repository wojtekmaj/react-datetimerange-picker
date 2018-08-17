const fs = require('fs');

fs.copyFile('src/DateTimeRangePicker.less', 'dist/DateTimeRangePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('DateTimeRangePicker.less copied successfully.');
});
