# 更新日志

## [1.0.0] - 2019-11-13
### 新增
* iceluna-sdk基本功能；

## [1.0.1] - 2019-11-26
### 新增
* 粘贴schema时判断如果为非法schema触发illegalSchema.paste消息；
* 增加schema.paste 和 schema.copy消息；
* schema中支持__ignoreParse，标记不需解析成ReactDom的schema结构；
* 复制组件后，高亮选中新增的组件；

### 优化
* 修改sdk入口文件；
* engine的hidden属性改为suspended；
* websocket重连delay时间改为3s；

### 修复
* 当异步请求返回数据中success为false的时候，依然走请求成功回调，由用户自己判断错误处理方式；
* 修复预发发布以后异步请求配置变量不解析问题；
* 修复初始数据重新获取导致调试字段t不更新问题；
* 修复异步请求配置参数变量解析时机不及时导致参数解析出错问题；

## [1.0.2] - 2019-12-16
### 新增
* 画布支持缩放以及placeholder设置；
* window上挂载react和reactDOM；
* 支持国际化；
* 画布支持layout设置；

### 优化
* 若schema中的loop或者loopArgs变成默认值时删除该属性字段；
* 扩展模式时组件最小高度调整为10px；
* 采用react.forward透传compFactory和addonFactory高阶组件ref；
* 插件通过context透传国际化配置；
* 画布最外层组件支持设置固定宽高；

### 修复
* 修发布后的页面被嵌入到iframe中变量解析时的跨域问题；
* 修复form循环问题；
* 修复模型结构中null及undefined被转成空对象问题；
* 修复fetch请求类型为PUT和DELETE时参数序列化问题；
* 修复form自定义设置key导致的scopeprops不传递问题；
* 修复beforeRequest和afterRequest中this上下文丢失问题；

## [1.0.3] - 2019-12-24
### 新增
* compFactory和addonFactory增加version static字段；
* 接入小二工作台fetch库；
* 增加标准搭建协议转换API；
* 上下文增加React Router的match属性；

### 优化
* 错误码非200时依旧解析请求返回结果；
* 增加编辑器环境判断并兼容vscode复制粘贴操作；
* 国际化语言判断的边界校验；

### 修复
* 修复当children设置为变量时且condition为false时报错问题；
* 修复未支持国际化的插件报错问题；
* 修复canvas获取viewport不存在时的报错问题；

## [1.0.4] - 2020-01-13
### 新增
* 增加黄金令箭埋点API；
* 新增ReadMe；
* 渲染引擎支持Flagment组件；
* 容器类组件支持自动loading及占位高度属性配置；

### 优化
* schema序列化增加unsafe选项设置；
* 优化自定义组件预览逻辑；
* 渲染引擎scope、ctx和self上下文构造重构；
* 异步数据请求API兼容callback写法；
* bzb增加根据url参数控制环境；

### 修复
* 修复无内容状态容器展示异常的问题；
* 修复自定义组件children属性中添加Block导致Block内部组件无法进行依赖分析，从而无法展示问题；
* 修复componentsMap获取失败问题；
* 升级bzb-request；
* 修复初始数据源无内容返回导致容器组件不重新渲染问题；
* 修复单独使用this时，变量解析过程中this转义问题；