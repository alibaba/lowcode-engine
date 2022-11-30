---
title: 3. 如何通过按钮展示/隐藏弹窗
sidebar_position: 1
---
### 1.拖拽一个按钮

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355202273-1a84b1e5-e33c-4686-b92b-633936423141.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=906&id=u81f6abfa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1812&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=749009&status=done&style=none&taskId=u6f4bf7e1-db67-4fca-8107-04021936c00&title=&width=1792)
### 2.拖拽一个弹窗
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355233863-6d65ee77-b2fa-4d51-a04c-f0582c99eb72.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=811&id=u848a34e1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1622&originWidth=3578&originalType=binary&ratio=1&rotation=0&showTitle=false&size=774132&status=done&style=none&taskId=ue713e331-7ce0-4bd8-b41d-3ae1e07c69b&title=&width=1789)

### 3.查看弹窗 refId
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355269097-3e5282ed-2fdd-4a3b-b9b8-d78fac69c42e.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=794&id=ufd9346c1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1588&originWidth=3574&originalType=binary&ratio=1&rotation=0&showTitle=false&size=843332&status=done&style=none&taskId=ubc630826-e577-4dee-a2c3-5478bdf266a&title=&width=1787)

- 点击弹窗
- 点击右侧面板中的高级
- 找到 refId

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355320821-dd2c85f7-a75e-495d-896a-67e4761561ac.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=898&id=u4bf6b721&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1796&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=993930&status=done&style=none&taskId=u8c648fa2-c660-4979-8991-1cf138d2372&title=&width=1792)

这里我们的 refId 是 "pro-dialog-entryl32xgrus"
### 4.隐藏弹窗
点击工具栏的隐藏小图标，将弹窗在画布中隐藏
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355400766-f7bdca37-7ba9-497d-a7e2-ad1d92233a26.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=784&id=ucbbe5086&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1568&originWidth=3578&originalType=binary&ratio=1&rotation=0&showTitle=false&size=774518&status=done&style=none&taskId=u2c8e73cd-10c5-47d3-b96e-30e6840d1af&title=&width=1789)

### 5.按钮绑定事件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1652355486231-172c5797-c376-4f6f-94f7-8c3c593caa02.png#clientId=udd01ff56-e3fe-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=907&id=ufcf7d50e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1814&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=845218&status=done&style=none&taskId=u7c2c54ce-9c18-4b29-a066-f3024a95443&title=&width=1792)

**通过下面的代码即可打开弹窗**

```typescript
this.$('pro-dialog-entryl32xgrus').open();
```
####
