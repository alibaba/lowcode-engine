---
category: Components
type: Data Display
title: Collapse
cols: 1
---

A content area which can be collapsed and expanded.

## When To Use

- Can be used to group or hide complex regions to keep the page clean.
- `Accordion` is a special kind of `Collapse`, which allows only one panel to be expanded at a time.

## API

### Collapse

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey | Key of the active panel | string\[]\|string\| number\[]\|number | No default value. In `accordion` mode, it's the key of the first panel. |  |
| defaultActiveKey | Key of the initial active panel | string\[]\|string\| number\[]\|number | - |  |
| bordered | Toggles rendering of the border around the collapse block | boolean | `true` |  |
| accordion | If `true`, `Collapse` renders as `Accordion` | boolean | `false` |  |
| onChange | Callback function executed when active panel is changed | Function | - |  |
| expandIcon | allow to customize collapse icon | (panelProps) => ReactNode | - |  |
| expandIconPosition | Set expand icon position | `left` \| `right` | - |  |
| destroyInactivePanel | Destroy Inactive Panel | boolean | `false` |  |

### Collapse.Panel

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | If `true`, panel cannot be opened or closed | boolean | `false` |  |
| forceRender | Forced render of content on panel, instead of lazy rending after clicking on header | boolean | `false` |  |
| header | Title of the panel | string\|ReactNode | - |  |
| key | Unique key identifying the panel from among its siblings | string\|number | - |  |
| showArrow | If `false`, panel will not show arrow icon | boolean | `true` |  |
| extra | extra element in the corner | ReactNode | - |  |
