---
category: Components
cols: 1
type: Data Display
title: Table
---

A table displays rows of data.

## When To Use

- To display a collection of structured data.
- To sort, search, paginate, filter data.

## How To Use

Specify `dataSource` of Table as an array of data.

```jsx
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

<Table dataSource={dataSource} columns={columns} />;
```

## API

### Table

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| tableLayout | [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) attribute of table element | - \| `auto` \| `fixed` | -<hr />`fixed` when header/columns are fixed, or using `column.ellipsis` |
| bordered | Whether to show all table borders | boolean | `false` |
| columns | Columns of table | [ColumnProps](#Column)\[] | - |
| components | Override default table elements | [TableComponents](https://git.io/fANxz) | - |
| dataSource | Data record array to be displayed | any\[] | - |
| expandable | Config expandable content | [expandable](#expandable) | - |
| footer | Table footer renderer | Function(currentPageData) | - |
| loading | Loading status of table | boolean\|[object](/components/spin/#API) ([more](https://github.com/ant-design/ant-design/issues/4544#issuecomment-271533135)) | `false` |
| locale | i18n text including filter, sort, empty text, etc | object | filterConfirm: 'Ok' <br> filterReset: 'Reset' <br> emptyText: 'No Data' <br> [Default](https://github.com/ant-design/ant-design/issues/575#issuecomment-159169511) |
| pagination | Config of pagination. You can ref table pagination [config](#pagination) or full [`pagination`](/components/pagination/) document, hide it by setting it to `false` | object | - |
| rowClassName | Row's className | Function(record, index):string | - |
| rowKey | Row's unique key, could be a string or function that returns a string | string\|Function(record):string | `key` |
| rowSelection | Row selection [config](#rowSelection) | object | null |
| scroll | Whether the table can be scrollable, [config](#scroll) | object | - |
| showHeader | Whether to show table header | boolean | `true` |
| size | Size of table | `default` \| `middle` \| `small` | `default` |
| summary | Summary content | (currentData) => ReactNode | - |
| title | Table title renderer | Function(currentPageData) | - |
| onChange | Callback executed when pagination, filters or sorter is changed | Function(pagination, filters, sorter, extra: { currentDataSource: [] }) | - |
| onHeaderRow | Set props on per header row | Function(column, index) | - |
| onRow | Set props on per row | Function(record, index) | - |
| getPopupContainer | the render container of dropdowns in table | (triggerNode) => HTMLElement | `() => TableHtmlElement` |
| sortDirections | supported sort way, could be `'ascend'`, `'descend'` | Array | `['ascend', 'descend']` |
| showSorterTooltip | header show next sorter direction tooltip | boolean | `true` |

#### onRow usage

Same as `onRow` `onHeaderRow` `onCell` `onHeaderCell`

```jsx
<Table
  onRow={(record, rowIndex) => {
    return {
      onClick: event => {}, // click row
      onDoubleClick: event => {}, // double click row
      onContextMenu: event => {}, // right button click row
      onMouseEnter: event => {}, // mouse enter row
      onMouseLeave: event => {}, // mouse leave row
    };
  }}
  onHeaderRow={column => {
    return {
      onClick: () => {}, // click header row
    };
  }}
/>
```

### Column

One of the Table `columns` prop for describing the table's columns, Column has the same API.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| align | specify which way that column is aligned | `left` \| `right` \| `center` | `left` |
| ellipsis | ellipsis cell content, not working with sorter and filters for now.<br />tableLayout would be `fixed` when `ellipsis` is true. | boolean | false |
| className | className of this column | string | - |
| colSpan | Span of this column's title | number | - |
| dataIndex | Display field of the data record, support nest path by string array | string \| string\[] | - |
| defaultFilteredValue | Default filtered values | string\[] | - |  |
| defaultSortOrder | Default order of sorted values | `ascend` \| `descend` | - |
| filterDropdown | Customized filter overlay | React.ReactNode \| (props: [FilterDropdownProps](https://git.io/fjP5h)) => React.ReactNode | - |
| filterDropdownVisible | Whether `filterDropdown` is visible | boolean | - |
| filtered | Whether the `dataSource` is filtered | boolean | `false` |
| filteredValue | Controlled filtered value, filter icon will highlight | string\[] | - |
| filterIcon | Customized filter icon | ReactNode\|(filtered: boolean) => ReactNode | `false` |
| filterMultiple | Whether multiple filters can be selected | boolean | `true` |
| filters | Filter menu config | object\[] | - |
| fixed | (IE not support) Set column to be fixed: `true`(same as left) `'left'` `'right'` | boolean\|string | `false` |
| key | Unique key of this column, you can ignore this prop if you've set a unique `dataIndex` | string | - |
| render | Renderer of the table cell. The return value should be a ReactNode, or an object for [colSpan/rowSpan config](#components-table-demo-colspan-rowspan) | Function(text, record, index) {} | - |
| sorter | Sort function for local sort, see [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)'s compareFunction. If you need sort buttons only, set to `true` | Function\|boolean | - |
| sortOrder | Order of sorted values: `'ascend'` `'descend'` `false` | boolean\|string | - |
| sortDirections | supported sort way, override `sortDirections` in `Table`, could be `'ascend'`, `'descend'` | Array | `['ascend', 'descend']` |
| title | Title of this column | ReactNode\|({ sortOrder, sortColumn, filters }) => ReactNode | - |
| width | Width of this column ([width not working?](https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241)) | string\|number | - |
| onCell | Set props on per cell | Function(record, rowIndex) | - |
| onFilter | Callback executed when the confirm filter button is clicked | Function | - |
| onFilterDropdownVisibleChange | Callback executed when `filterDropdownVisible` is changed | function(visible) {} | - |
| onHeaderCell | Set props on per header cell | Function(column) | - |
| showSorterTooltip | header show next sorter direction tooltip, override `showSorterTooltip` in table | boolean | `true` |

### ColumnGroup

| Property | Description               | Type              | Default |
| -------- | ------------------------- | ----------------- | ------- |
| title    | Title of the column group | string\|ReactNode | -       |

### pagination

Properties for pagination.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| position | specify the position of `Pagination`, could be `topLeft` \| `topCenter` \| `topRight` \|`bottomLeft` \| `bottomCenter` \| `bottomRight` | Array | `['bottomRight']` |

More about pagination, please check [`Pagination`](/components/pagination/).

### expandable

Properties for expandable.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| childrenColumnName | The column contains children to display | string\[] | children |
| defaultExpandAllRows | Expand all rows initially | boolean | `false` |
| defaultExpandedRowKeys | Initial expanded row keys | string\[] | - |
| expandIcon | Customize row expand Icon. Ref [example](https://codesandbox.io/s/fervent-bird-nuzpr) | Function(props):ReactNode | - |
| expandIconColumnIndex | Customize expand icon column index | number | - |
| expandedRowKeys | Current expanded row keys | string\[] | - |
| expandedRowRender | Expanded container render for each row | Function(record, index, indent, expanded):ReactNode | - |
| expandRowByClick | Whether to expand row by clicking anywhere in the whole row | boolean | `false` |
| indentSize | Indent size in pixels of tree data | number | 15 |
| rowExpandable | Enable row can be expandable | (record) => boolean | - |
| onExpand | Callback executed when the row expand icon is clicked | Function(expanded, record) | - |
| onExpandedRowsChange | Callback executed when the expanded rows change | Function(expandedRows) | - |

### rowSelection

Properties for row selection.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| columnWidth | Set the width of the selection column | string\|number | `60px` | 4.0 |
| columnTitle | Set the title of the selection column | string\|React.ReactNode | - | 4.0 |
| fixed | Fixed selection column on the left | boolean | - | 4.0 |
| getCheckboxProps | Get Checkbox or Radio props | Function(record) | - | 4.0 |
| hideDefaultSelections | Remove the default `Select All` and `Select Invert` selections when [custom selection](#components-table-demo-row-selection-custom) | boolean | `false` | 4.0 |
| renderCell | Renderer of the table cell. Same as `render` in column | Function(checked, record, index, originNode) {} | - | 4.1 |
| selectedRowKeys | Controlled selected row keys | string\[]\|number[] | \[] | 4.0 |
| selections | Custom selection [config](#rowSelection), only displays default selections when set to `true` | object\[]\|boolean | - | 4.0 |
| type | `checkbox` or `radio` | `checkbox` \| `radio` | `checkbox` | 4.0 |
| onChange | Callback executed when selected rows change | Function(selectedRowKeys, selectedRows) | - | 4.0 |
| onSelect | Callback executed when select/deselect one row | Function(record, selected, selectedRows, nativeEvent) | - | 4.0 |
| onSelectAll | Callback executed when select/deselect all rows | Function(selected, selectedRows, changeRows) | - | 4.0 |
| onSelectInvert | Callback executed when row selection is inverted | Function(selectedRowKeys) | - | 4.0 |

### scroll

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| x | Set horizontal scrolling, can also be used to specify the width of the scroll area, could be number, percent value, true and ['max-content'](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width#max-content) | number \| true | - |
| y | Set vertical scrolling, can also be used to specify the height of the scroll area, could be number | number | - |
| scrollToFirstRowOnChange | Whether to scroll to the top of the table when paging, sorting, filtering changes | boolean | - |

### selection

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| key | Unique key of this selection | string | - |
| text | Display text of this selection | string\|React.ReactNode | - |
| onSelect | Callback executed when this selection is clicked | Function(changeableRowKeys) | - |

## Using in TypeScript

```tsx
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

interface User {
  key: number,
  name: string;
}

const columns: ColumnProps<User>[] = [{
  key: 'name',
  title: 'Name',
  dataIndex: 'name',
}];

const data: User[] = [{
  key: 0,
  name: 'Jack',
}];

class UserTable extends Table<User> {}

<UserTable columns={columns} dataSource={data} />

// Use JSX style API
class NameColumn extends Table.Column<User> {}

<UserTable dataSource={data}>
  <NameColumn key="name" title="Name" dataIndex="name" />
</UserTable>

// after TypeScript 2.9 can write like this
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#generic-type-arguments-in-jsx-elements
<Table<User> columns={columns} dataSource={data} />
<Table<User> dataSource={data}>
  <Table.Column<User> key="name" title="Name" dataIndex="name" />
</Table>
```

## Note

According to the [React documentation](https://facebook.github.io/react/docs/lists-and-keys.html#keys), every child in an array should be assigned a unique key. The values inside the Table's `dataSource` and `columns` should follow this rule. By default, `dataSource[i].key` will be treated as the key value for `dataSource`.

![console warning](https://os.alipayobjects.com/rmsportal/luLdLvhPOiRpyss.png)

If `dataSource[i].key` is not provided, then you should specify the primary key of dataSource value via `rowKey`, as shown below. If not, warnings like the one above will show in browser console.

```jsx
// primary key is uid
return <Table rowKey="uid" />;
// or
return <Table rowKey={record => record.uid} />;
```

## Migrate to v4

Table removes `onRowClick`, `onRowDoubleClick`, `onRowMouseEnter`, `onRowMouseLeave` and some other api which is already deprecated in v3. If you only use api listing in official document, that's OK.

Besides, the breaking change is changing `dataIndex` from nest string path like `user.age` to string array path like `['user', 'age']`. This help to resolve developer should additional work on the field which contains `.`.

## FAQ

### How to hide pagination when single page or not data?

You can set `hideOnSinglePage` with `pagination` prop.

### Table will return to first page when filter data.

Table total page count usually reduce after filter data, we defaultly return to first page in case of current page is out of filtered results.

You may need to keep current page after filtering when fetch data from remote service, please check [this demo](https://codesandbox.io/s/yuanchengjiazaishuju-ant-design-demo-7y2uf) as workaround.

### Why Table pagination show size changer?

In order to improve user experience, Pagination show size changer by default when `total >= 50` since `4.1.0`. You can set `showSizeChanger=false` to disable this feature.
