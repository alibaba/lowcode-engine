---
title: SelectSetter
---
#### 简介
用来选择组件。在限定的可选性内进行选择，核心能力是选择
#### 展示
![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644395925308-538eb962-f035-43b9-bdb3-ecc5bc9d1e85.png#clientId=u8b43103b-f292-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=301&id=u7a9a7786&margin=%5Bobject%20Object%5D&name=image.png&originHeight=602&originWidth=574&originalType=binary&ratio=1&rotation=0&showTitle=false&size=36601&status=done&style=none&taskId=u089007a6-76ec-44e8-94b5-127a8ba1a51&title=&width=287)
#### setter 配置
| 属性名 | 说明 |
| --- | --- |
| mode | 选择器模式

可选值:
'single', 'multiple', 'tag' |
| defaultValue | 默认值 |
| options | 传入的数据源，
**参数格式**:
[
{label/title: '文字', value: 'text'}, ...
] |

#### 返回类型
String | Number | Boolean
会返回options中的value值
