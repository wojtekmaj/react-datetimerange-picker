import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getISOLocalDateTime } from './shared/dates';

export default class ValueOptions extends PureComponent {
  get startDate() {
    const { value } = this.props;

    return [].concat(value)[0];
  }

  get endDate() {
    const { value } = this.props;

    return [].concat(value)[1];
  }

  setValue = (value) => {
    const { setState } = this.props;

    setState({ value });
  }

  setStartValue = (startValue) => {
    const { value } = this.props;

    if (!startValue) {
      this.setValue(value[1] || startValue);
      return;
    }

    if (Array.isArray(value)) {
      this.setValue([startValue, value[1]]);
    } else {
      this.setValue(startValue);
    }
  }

  setEndValue = (endValue) => {
    const { value } = this.props;

    if (!endValue) {
      this.setValue(value[0]);
      return;
    }

    if (Array.isArray(value)) {
      this.setValue([value[0], endValue]);
    } else {
      this.setValue([value, endValue]);
    }
  }

  onStartChange = (event) => {
    const { value } = event.target;
    this.setStartValue(new Date(value));
  }

  onEndChange = (event) => {
    const { value } = event.target;
    this.setEndValue(new Date(value));
  }

  render() {
    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">
          Value options
        </legend>

        <div>
          <label htmlFor="startDatetime">
            Start date
          </label>
          <input
            id="startDatetime"
            onChange={this.onStartChange}
            type="datetime-local"
            value={this.startDate ? getISOLocalDateTime(this.startDate) : ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setStartValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setStartValue('')}
          >
            Clear to empty string
          </button>
        </div>

        <div>
          <label htmlFor="endDatetime">
            End date
          </label>
          <input
            id="endDatetime"
            onChange={this.onEndChange}
            type="datetime-local"
            value={this.endDate ? getISOLocalDateTime(this.endDate) : ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setEndValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setEndValue('')}
          >
            Clear to empty string
          </button>
        </div>
      </fieldset>
    );
  }
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};
