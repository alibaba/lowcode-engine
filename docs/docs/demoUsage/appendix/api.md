---
title: demo 使用相关 API
sidebar_position: 2
---
## 数据源相关
### 请求数据源
```javascript
// 请求 userList（userList 在数据源面板中定义）

this.dataSourceMap['userList'].load({
	data: {}
}).then(res => {})
  .catch(error => {});
```

### 获取数据源的值
```javascript
const { userList } = this.state;
```

### 手动修改数据源值
```javascript
// 获取数据源面板中定义的值
const { user } = this.state;

// 修改 state 值
this.setState({
	user: {}
});
```
