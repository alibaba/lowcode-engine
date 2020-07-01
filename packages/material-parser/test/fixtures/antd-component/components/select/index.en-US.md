---
category: Components
type: Data Entry
title: Select
---

Select component to select value from options.

## When To Use

- A dropdown menu for displaying choices - an elegant alternative to the native `<select>` element.
- Utilizing [Radio](/components/radio/) is recommended when there are fewer total options (less than 5).

## API

```jsx
<Select>
  <Option value="lucy">lucy</Option>
</Select>
```

### Select props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button. | boolean | false |  |
| autoClearSearchValue | Whether the current search will be cleared on selecting an item. Only applies when `mode` is set to `multiple` or `tags`. | boolean | true |  |
| autoFocus | Get focus by default | boolean | false |  |
| defaultActiveFirstOption | Whether active first option by default | boolean | true |  |
| defaultValue | Initial selected option. | string\|string\[]<br />number\|number\[]<br />LabeledValue\|LabeledValue[] | - |  |
| disabled | Whether disabled select | boolean | false |  |
| dropdownClassName | className of dropdown menu | string | - |  |
| dropdownMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. `false` will disable virtual scroll | boolean \| number | true |  |
| dropdownRender | Customize dropdown content | (menuNode: ReactNode, props) => ReactNode | - |  |
| dropdownStyle | style of dropdown menu | object | - |  |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns `true`, the option will be included in the filtered set; Otherwise, it will be excluded. | boolean or function(inputValue, option) | true |  |
| getPopupContainer | Parent Node which the selector should be rendered to. Default to `body`. When position issues happen, try to modify it into scrollable content and position it relative. [Example](https://codesandbox.io/s/4j168r7jw0) | function(triggerNode) | () => document.body |  |
| labelInValue | whether to embed label in value, turn the format of value from `string` to `{key: string, label: ReactNode}` | boolean | false |  |
| listHeight | Config popup height | number | 256 |  |
| maxTagCount | Max tag count to show | number | - |  |
| maxTagTextLength | Max tag text length to show | number | - |  |
| maxTagPlaceholder | Placeholder for not showing tags | ReactNode/function(omittedValues) | - |  |
| tagRender | Customize tag render | (props) => ReactNode | - |  |
| mode | Set mode of Select | `multiple` \| `tags` | - |  |
| notFoundContent | Specify content to show when no result matches.. | string | 'Not Found' |  |
| optionFilterProp | Which prop value of option will be used for filter if filterOption is true | string | value |  |
| optionLabelProp | Which prop value of option will render as content of select. [Example](https://codesandbox.io/s/antd-reproduction-template-tk678) | string | `value` for `combobox`, `children` for other modes |  |
| placeholder | Placeholder of select | string\|ReactNode | - |  |
| showArrow | Whether to show the drop-down arrow | boolean | true |  |
| showSearch | Whether show search input in single mode. | boolean | false |  |
| size | Size of Select input. | `large` \| `middle` \| `small` |  |  |
| suffixIcon | The custom suffix icon | ReactNode | - |  |
| removeIcon | The custom remove icon | ReactNode | - |  |
| clearIcon | The custom clear icon | ReactNode | - |  |
| menuItemSelectedIcon | The custom menuItemSelected icon with multiple options | ReactNode | - |  |
| tokenSeparators | Separator used to tokenize on tag/multiple mode | string\[] |  |  |
| value | Current selected option. | string\|string\[]<br />number\|number\[]<br />LabeledValue\|LabeledValue[] | - |  |
| virtual | Disable virtual scroll when set to `false` | boolean | true | 4.1.0 |
| onBlur | Called when blur | function | - |  |
| onChange | Called when select an option or input value change, or value of input is changed in combobox mode | function(value, option:Option/Array&lt;Option>) | - |  |
| onDeselect | Called when a option is deselected, param is the selected option's value. Only called for multiple or tags, effective in multiple or tags mode only. | function(string\|number\|LabeledValue) | - |  |
| onFocus | Called when focus | function | - |  |
| onInputKeyDown | Called when key pressed | function | - |  |
| onMouseEnter | Called when mouse enter | function | - |  |
| onMouseLeave | Called when mouse leave | function | - |  |
| onPopupScroll | Called when dropdown scrolls | function | - |  |
| onSearch | Callback function that is fired when input changed. | function(value: string) |  |  |
| onSelect | Called when a option is selected, the params are option's value (or key) and option instance. | function(string\|number\|LabeledValue, option:Option) | - |  |
| defaultOpen | Initial open state of dropdown | boolean | - |  |
| open | Controlled open state of dropdown | boolean | - |  |
| onDropdownVisibleChange | Call when dropdown open | function(open) | - |  |
| loading | indicate loading state | Boolean | false |  |
| bordered | whether has border style | Boolean | true |  |

### Select Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### Option props

| Property  | Description                                | Type           | Default | Version |
| --------- | ------------------------------------------ | -------------- | ------- | ------- |
| disabled  | Disable this option                        | boolean        | false   |         |
| title     | `title` of Select after select this Option | string         | -       |         |
| value     | default to filter with this property       | string\|number | -       |         |
| className | additional class to option                 | string         | -       |         |

### OptGroup props

| Property | Description | Type                  | Default | Version |
| -------- | ----------- | --------------------- | ------- | ------- |
| key      |             | string                | -       |         |
| label    | Group label | string\|React.Element | -       |         |

## FAQ

### The dropdown is closed when click `dropdownRender` area?

See the instruction in [dropdownRender example](#components-select-demo-custom-dropdown-menu).

### Why sometime customize Option cause scroll break?

Virtual scroll internal set item height as `32px`. You need to adjust `listItemHeight` when your option height is less and `listHeight` config list container height:

```tsx
<Select listItemHeight={10} listHeight={250} />
```

Note: `listItemHeight` and `listHeight` are internal props. Please only modify when necessary.
