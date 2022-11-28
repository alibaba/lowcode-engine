---
title: IconSetter
---
#### 简介
用来选择图标
#### 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644394747068-9b8f47e1-06f7-48de-ba73-9ed3d389f913.png#clientId=u144a54e7-b111-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=290&id=uae8bb869&margin=%5Bobject%20Object%5D&name=image.png&originHeight=579&originWidth=1172&originalType=binary&ratio=1&rotation=0&showTitle=false&size=148927&status=done&style=none&taskId=ud281e100-e277-493d-8d4a-0e7b2c1b8f2&title=&width=586)
#### setter 配置
| **属性名** | **类型** | **说明** |
| --- | --- | --- |
| type | String | 选择器返回类型
**可选值**:
"string" &#124; "node" |
| defaultValue | String &#124; ReactNode | 默认值 |
| hasClear | Boolean | 选择器是否显示清除按钮 |
| icons | Array | 自定义icon集合；默认值详见[图标可选值](#SWnNn) |
| placeholder | String | 没有值的时候的占位符 |

#### 返回类型
String | ReactNode
#### 图标可选值
```json
[
  'smile',
  'cry',
  'success',
  'warning',
  'prompt',
  'error',
  'help',
  'clock',
  'success-filling',
  'delete-filling',
  'favorites-filling',
  'add',
  'minus',
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-double-left',
  'arrow-double-right',
  'switch',
  'sorting',
  'descending',
  'ascending',
  'select',
  'semi-select',
  'loading',
  'search',
  'close',
  'ellipsis',
  'picture',
  'calendar',
  'ashbin',
  'upload',
  'download',
  'set',
  'edit',
  'refresh',
  'filter',
  'attachment',
  'account',
  'email',
  'atm',
  'copy',
  'exit',
  'eye',
  'eye-close',
  'toggle-left',
  'toggle-right',
  'lock',
  'unlock',
  'chart-pie',
  'chart-bar',
  'form',
  'detail',
  'list',
  'dashboard',
]
```
