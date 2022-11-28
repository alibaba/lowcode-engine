---
title: 如何使用循环值
sidebar_position: 0
---
1.设置循环数据
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1655975447215-026bd3ae-ae2a-4f90-805e-df0d5c4bb7d2.png#clientId=ubd100ffc-952a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=950&id=u6413eee5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1900&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=339030&status=done&style=none&taskId=ued46d732-83a2-441f-a80f-23061587689&title=&width=1920)

2.给需要的变量绑定 this.item
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1655975499246-f9d14ef4-6736-46a5-8b24-8eedd4477617.png#clientId=ubd100ffc-952a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=946&id=u0b50f02a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1892&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=451804&status=done&style=none&taskId=uf4916102-2e3d-4277-ac81-604c6761615&title=&width=1920)

绑定之后的效果如下：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1655975540038-ccf3aabc-3f7c-4e33-a701-a9b005b1cf25.png#clientId=uc887596b-8aed-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=942&id=u32901b3a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1884&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=333998&status=done&style=none&taskId=u2853d459-4432-4d0a-ba12-494e79e892a&title=&width=1920)

其中 this.item 的 item 是可以配置的。配置不同的 key 可以方便在多层循环中使用不同层级的循环 item 值。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1655975569197-33d90389-7394-4e65-bc6a-582b7ceb9fee.png#clientId=uc887596b-8aed-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=948&id=u6e6741d2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1896&originWidth=3840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=311961&status=done&style=none&taskId=u14bbcfbb-e7cf-4307-a58d-3cb58afe8f7&title=&width=1920)

this.index 是当前循环的索引值。
