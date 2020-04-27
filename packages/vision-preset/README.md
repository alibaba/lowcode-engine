子视图
prototype.view
view.Preview
view.Mobile

实时切

设备
device
创建多个 simulator

不同simulator 加载不同视图

这样有利于 环境隔离，比如 rax 和 react

适配规则

规则 1
mobile view.mobile.xxx
rax    view.rax.xxx
miniapp view.miniapp.xxx
view.<device>.xxx
通配 view.xxx

universal

规则 2
urls: "view.js,view2 <device selector>, view3 <device selector>",
urls: [
  "view.js",
  "view.js *",
  "view1.js mobile|pc",
  "view2.js <device selector>"
]

环境通用资源

"react": {
  "urls": [
    "//g.alicdn.com/platform/c/react/16.5.2/react.min.js"
  ],
  "library": "React",
  "package": "react",
  "version": "16.5.2",
  "devices-for": "*" | ["mobile", "web"] | "rax|mobile"
}


load legao assets
  load all x-prototype-urls
  

load assets

  build componentMeta
  if has x-prototype-urls ,
  load x-prototype-urls
    call Bundle.createPrototype() or something register
   got prototypeView

load schema


open schema

load simulator resources



simulator 中加载资源，根据 componentsMap 构建组件查询字典，


获取 view 相关的样式、脚本
获取 proto 相关的样式
在 simulator 中也加载一次

1. meta 信息构造
2. components 字典构造, proto.getView 或者 通过 npm 信息查询
3. 


componentMeta 段描述的信息，如果包含 x-prototype-urls ，那么这个 meta 信息都可以丢掉
