---
category: Components
type: Data Entry
cols: 2
title: AutoComplete
---

Autocomplete function of input field.

## When To Use

When there is a need for autocomplete functionality.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button, effective in multiple mode only. | boolean | false |  |
| autoFocus | get focus when component mounted | boolean | false |  |
| backfill | backfill selected item the input when using keyboard | boolean | false |  |
| children (for customize input element) | customize input element | HTMLInputElement <br /><br /> HTMLTextAreaElement <br /><br /> `React.ReactElement<InputProps>` | `<Input />` |  |
| children (for dataSource) | Data source to auto complete | `React.ReactElement<OptionProps>` <br /><br /> `Array<React.ReactElement<OptionProps>>` | - |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultValue | Initial selected option. | string | - |  |
| disabled | Whether disabled select | boolean | false |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean or function(inputValue, option) | true |  |
| placeholder | placeholder of input | string | - |  |
| value | selected option | string | - |  |
| onBlur | Called when leaving the component. | function() | - |  |
| onChange | Called when select an option or input value change, or value of input is changed | function(value) | - |  |
| onFocus | Called when entering the component | function() | - |  |
| onSearch | Called when searching items. | function(value) | - |  |
| onSelect | Called when a option is selected. param is option's value and option instance. | function(value, option) | - |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| open | Controlled open state of dropdown | boolean | - |  |
| onDropdownVisibleChange | Call when dropdown open | function(open) | - |  |

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | remove focus |         |
| focus() | get focus    |         |

## FAQ

### Why doesn't the text composition system work well with onSearch in controlled mode?

Please use `onChange` to manage control state. `onSearch` is used for searching input which is not same as `onChange`. Besides, clicking on the option will not trigger the `onSearch` event.

Related issue: [#18230](https://github.com/ant-design/ant-design/issues/18230) [#17916](https://github.com/ant-design/ant-design/issues/17916)

### Part of api from v3 not available in v4?

AutoComplete is a Input component support auto complete tips which should not support `labelInValue` prop to modify dispaly value in input. In v3, AutoComplete realization can not handle case that user type match of both `value` & `label` are the same. v4 not longer support `label` as the value input.
