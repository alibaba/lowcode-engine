---
category: Components
type: Data Entry
title: DatePicker
---

To select or input a date.

## When To Use

By clicking the input box, you can select a date from a popup calendar.

## API

There are five kinds of picker:

- DatePicker
- MonthPicker
- RangePicker
- WeekPicker
- YearPicker
- QuarterPicker (Added in 4.1.0)

### Localization

The default locale is en-US, if you need to use other languages, recommend to use internationalized components provided by us at the entrance. Look at: [ConfigProvider](http://ant.design/components/config-provider/).

If there are special needs (only modifying single component language), Please use the property: local. Example: [default](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json).

```jsx
import locale from 'antd/es/date-picker/locale/zh_CN';

<DatePicker locale={locale} />;
```

```jsx
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import moment from 'moment';

<DatePicker defaultValue={moment('2015-01-01', 'YYYY-MM-DD')} />;
```

### Common API

The following APIs are shared by DatePicker, YearPicker, MonthPicker, RangePicker, WeekPicker.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to show clear button | boolean | true |  |
| autoFocus | get focus when component mounted | boolean | false |  |
| className | picker className | string | '' |  |
| dateRender | custom rendering function for date cells | function(currentDate: moment, today: moment) => React.ReactNode | - |  |
| disabled | determine whether the DatePicker is disabled | boolean | false |  |
| disabledDate | specify the date that cannot be selected | (currentDate: moment) => boolean | - |  |
| dropdownClassName | to customize the className of the popup calendar | string | - |  |
| getPopupContainer | to set the container of the floating layer, while the default is to create a `div` element in `body` | function(trigger) | - |  |
| locale | localization configuration | object | [default](https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json) |  |
| mode | picker panel mode（[Cannot select year or month anymore?](/docs/react/faq#When-set-mode-to-DatePicker/RangePicker,-cannot-select-year-or-month-anymore?) | `time` \| `date` \| `month` \| `year` \| `decade` | - |  |
| open | open state of picker | boolean | - |  |
| picker | Set picker type | `date` \| `week` \| `month` \| `quarter` (4.1.0) \| `year` | `date` |  |
| placeholder | placeholder of date input | string\|RangePicker\[] | - |  |
| popupStyle | to customize the style of the popup calendar | object | {} |  |
| size | determine the size of the input box, the height of `large` and `small`, are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - |  |
| bordered | whether has border style | Boolean | true |  |
| suffixIcon | The custom suffix icon | ReactNode | - |  |
| style | to customize the style of the input box | object | {} |  |
| onOpenChange | a callback function, can be executed whether the popup calendar is popped up or closed | function(open) | - |  |
| onPanelChange | callback when picker panel mode is changed | function(value, mode) | - |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |

### Common Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |

### DatePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | to set default date, if start time or end time is null or undefined, the date range will be an open interval | [moment](http://momentjs.com/) | - |  |
| defaultPickerValue | to set default picker date | [moment](http://momentjs.com/) | - |  |
| disabledTime | to specify the time that cannot be selected | function(date) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/). When an array is provided, all values are used for parsing and first value is used for formatting. | string \| string[] | "YYYY-MM-DD" |  |
| renderExtraFooter | render extra footer in panel | (mode) => React.ReactNode | - |  |
| showTime | to provide an additional time selection | object\|boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | to set default time of selected date, [demo](#components-date-picker-demo-disabled-date) | [moment](http://momentjs.com/) | moment() |  |
| showToday | whether to show "Today" button | boolean | true |  |
| value | to set date | [moment](http://momentjs.com/) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(date: moment, dateString: string) | - |  |
| onOk | callback when click ok button | function() | - |  |
| onPanelChange | Callback function for panel changing | function(value, mode) | - |  |

### YearPicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | to set default date | [moment](http://momentjs.com/) | - |  |
| defaultPickerValue | to set default picker date | [moment](http://momentjs.com/) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/) | string | "YYYY" |  |
| renderExtraFooter | render extra footer in panel | () => React.ReactNode | - |  |
| value | to set date | [moment](http://momentjs.com/) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(date: moment, dateString: string) | - |  |

### QuarterPicker

Added in `4.1.0`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | to set default date | [moment](http://momentjs.com/) | - |  |
| defaultPickerValue | to set default picker date | [moment](http://momentjs.com/) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/) | string | "YYYY-\QQ" |  |
| renderExtraFooter | render extra footer in panel | () => React.ReactNode | - |  |
| value | to set date | [moment](http://momentjs.com/) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(date: moment, dateString: string) | - |  |

### MonthPicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | to set default date | [moment](http://momentjs.com/) | - |  |
| defaultPickerValue | to set default picker date | [moment](http://momentjs.com/) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/) | string | "YYYY-MM" |  |
| monthCellRender | Custom month cell content render method | function(date, locale): ReactNode | - |  |
| renderExtraFooter | render extra footer in panel | () => React.ReactNode | - |  |
| value | to set date | [moment](http://momentjs.com/) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(date: moment, dateString: string) | - |  |

### WeekPicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | to set default date | [moment](http://momentjs.com/) | - |  |
| defaultPickerValue | to set default picker date | [moment](http://momentjs.com/) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/) | string | "YYYY-wo" |  |
| value | to set date | [moment](http://momentjs.com/) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(date: moment, dateString: string) | - |  |
| renderExtraFooter | render extra footer in panel | (mode) => React.ReactNode | - |  |

### RangePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowEmpty | Allow start or end input leave empty | \[boolean, boolean] | \[false, false] |  |
| defaultValue | to set default date | \[[moment](http://momentjs.com/), [moment](http://momentjs.com/)] | - |  |
| defaultPickerValue | to set default picker date | \[[moment](http://momentjs.com/), [moment](http://momentjs.com/)\] | - |  |
| disabled | disable start or end | [boolean, boolean] | - |  |
| disabledTime | to specify the time that cannot be selected | function(dates: \[moment, moment], partial: `'start'|'end'`) | - |  |
| format | to set the date format, refer to [moment.js](http://momentjs.com/). When an array is provided, all values are used for parsing and first value is used for formatting. | string \| string[] | "YYYY-MM-DD HH:mm:ss" |  |
| ranges | preseted ranges for quick selection | { \[range: string]: [moment](http://momentjs.com/)\[] } \| { \[range: string]: () => [moment](http://momentjs.com/)\[] } | - |  |
| renderExtraFooter | render extra footer in panel | () => React.ReactNode | - |  |
| separator | set separator between inputs | string | '~' |  |
| showTime | to provide an additional time selection | object\|boolean | [TimePicker Options](/components/time-picker/#API) |  |
| showTime.defaultValue | to set default time of selected date, [demo](#components-date-picker-demo-disabled-date) | [moment](http://momentjs.com/)\[] | \[moment(), moment()] |  |
| value | to set date | \[[moment](http://momentjs.com/), [moment](http://momentjs.com/)] | - |  |
| onCalendarChange | a callback function, can be executed when the start time or the end time of the range is changing | function(dates: \[moment, moment], dateStrings: \[string, string]) | - |  |
| onChange | a callback function, can be executed when the selected time is changing | function(dates: \[moment, moment], dateStrings: \[string, string]) | - |  |

<style>
.code-box-demo .ant-picker {
  margin: 0 8px 12px 0;
}
</style>

## FAQ

- [When set mode to DatePicker/RangePicker, cannot select year or month anymore?](/docs/react/faq#When-set-mode-to-DatePicker/RangePicker,-cannot-select-year-or-month-anymore?)

- [How to use DatePicker with customize date library like dayjs](/docs/react/replace-moment#DatePicker)
