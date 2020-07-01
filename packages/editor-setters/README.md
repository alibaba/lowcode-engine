通用设置器

## 使用文档
- name：绑定props属性key，类型为string
- setter：setter组件内容，类型可以为string或object，当为string时，指setter名，当为object时：
  - componentName：setter名，类型为string
  - props：setter属性，类型为object

## 使用demo
```
{
  "name": "TextAreaSetter",
  "setter": "TextAreaSetter"
}, {
  "name": "date",
  "title": "测试日期",
  "setter": "DateSetter"
}, {
  "name": "date",
  "title": "测试日期-年",
  "setter": "DateYearSetter"
}, {
  "name": "date",
  "title": "测试日期-月",
  "setter": "DateMonthSetter"
}, {
  "name": "date",
  "title": "测试日期-区间",
  "setter": "DateRangeSetter"
}, {
  "name": "mode",
  "title": "选择器模式",
  "setter": {
    "componentName": "RadioGroupSetter",
    "props": {
      "defaultValue": "single",
      "dataSource": [{
        "value": "single",
        "label": "single"
      }, {
        "value": "multiple",
        "label": "multiple"
      }, {
        "value": "tag",
        "label": "tag"
      }]
    }
  }
}, {
  "name": "mode",
  "title": "选择器模式",
  "setter": {
    "componentName": "SelectSetter",
    "props": {
      "defaultValue": "single",
      "dataSource": [{
        "value": "single",
        "label": "single"
      }, {
        "value": "multiple",
        "label": "multiple"
      }, {
        "value": "tag",
        "label": "tag"
      }]
    }
  }
}, {
  "name": "value",
  "title": "受控值",
  "setter": "StringSetter"
}, {
  "name": "hasBorder",
  "title": "是否有边框",
  "setter": {
    "componentName": "BoolSetter",
    "props": {
      "defaultValue": true
    }
  }
}, {
  "name": "maxTagCount",
  "title": "最多显示多少个 tag",
  "setter": "NumberSetter"
}, {
  "name": "maxTagCount",
  "title": "最多显示多少个 tag",
  "setter": "ExpressionSetter"
}, {
  "name": "color",
  "title": "颜色选择",
  "setter": "ColorSetter"
}, {
  "name": "json",
  "title": "JSON设置",
  "setter": "JsonSetter"
}, {
  "name": "MixinSetter",
  "placeholder": "混合",
  "setter": {
    "componentName": "MixinSetter",
    "props": {
      "types": [{
        "name": "StringSetter",
        "props": {}
      }, {
        "name": "TextAreaSetter",
        "props": {}
      }, {
        "name": "SelectSetter",
        "props": {
          "hasClear": true,
          "dataSource": [{
            "label": "上",
            "value": "t"
          }, {
            "label": "右",
            "value": "r"
          }, {
            "label": "下",
            "value": "b"
          }, {
            "label": "左",
            "value": "l"
          }],
          "defaultValue": "l"
        }
      }, {
        "name": "NumberSetter",
        "props": {
          "defaultValue": 5
        }
      }, {
        "name": "BoolSetter",
        "props": {}
      }],
      "defaultType": "SelectSetter"
    }
  }
```