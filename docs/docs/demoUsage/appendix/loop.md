---
title: 如何使用循环值
sidebar_position: 0
---
1.设置循环数据
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01Gw1kXO1qaXulQCWap_!!6000000005512-2-tps-3840-1900.png)

2.给需要的变量绑定 this.item
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01RpP2Ev24lRxjqpHdY_!!6000000007431-2-tps-3840-1892.png)

绑定之后的效果如下：
![image.png](https://img.alicdn.com/imgextra/i3/O1CN019qa1J31m7ugsXcnaA_!!6000000004908-2-tps-3840-1884.png)

其中 this.item 的 item 是可以配置的。配置不同的 key 可以方便在多层循环中使用不同层级的循环 item 值。
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01XQfnYL1P4wxn01oXv_!!6000000001788-2-tps-3840-1896.png)

this.index 是当前循环的索引值。
