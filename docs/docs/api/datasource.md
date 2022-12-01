---
title: DataSource - 数据源 API
sidebar_position: 12
---
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
