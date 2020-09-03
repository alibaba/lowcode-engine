export default {
  "componentName": "Page",
  "fileName": "dataSource",
  "props": {},
  "children": [{
    "componentName": "Div",
    "props": {},
    "children": [{
      "componentName": "Text",
      "props": {
        "text": "{{this.item.title}}"
      }
    }, {
      "componentName": "Switch",
      "props": {
        "checkedChildren": "开",
        "unCheckedChildren": "关",
        "checked": "{{this.item.done}}"
      }
    }],
    "loop": "{{this.dataSourceMap.todos.data}}"
  }],
  "dataSource": {
    "list": [{
      "id": "todos",
      "isInit": true,
      "type": "jsonp",
      "options": {
        "method": "GET",
        "uri": "https://mocks.alibaba-inc.com/mock/D8iUX7zB/todo_getAll"
      },
      "dataHandler": function dataHandler(data) {
        return data.data;
      }
    }]
  }
}