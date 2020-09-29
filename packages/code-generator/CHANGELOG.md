# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.10"></a>
## [1.0.10](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.9...@ali/lowcode-code-generator@1.0.10) (2020-09-29)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.9"></a>
## [1.0.9](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.8...@ali/lowcode-code-generator@1.0.9) (2020-09-28)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.8"></a>
## [1.0.8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.8-0...@ali/lowcode-code-generator@1.0.8) (2020-09-28)


### Bug Fixes

* 🐛 解决 Rax 出码到小程序的时候 require(xxx) 语句不能被编译的问题 ([332a473](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/332a473))
* 🐛 经验证发现小程序里面还是得包上 eval 否则 Rax 框架会误把 context 发送到渲染进程而出错 ([c7a10c0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c7a10c0))
* 🐛 若全量引入 lodash 则在小程序下会跑不通,所以改成引入 lodash/clone ([a1a3b68](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a1a3b68))
* 🐛 小程序里面不支持可选链 "?.", 先直接访问 dataSourceEngine 吧 ([36c486b](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/36c486b))
* 🐛 fix typo of dataHandler ([acd1f06](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/acd1f06))
* 🐛 Rax 出码到小程序, 事件处理函数绑定 JSExpression 时也不应该包裹一个 eval, 小程序会报错 ([9f129aa](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/9f129aa))
* 🐛 Result use types package ([dd97a0c](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/dd97a0c))
* 🐛 use lowcode types ([b11425b](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b11425b))
* enhance api design ([95d67c1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/95d67c1))
* fix test result ([7f6fbe8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/7f6fbe8))
* ignore eslintrc in test-case  ([c0ef4bc](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c0ef4bc))
* merge problems & deps bugs ([7a36eab](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/7a36eab))
* miniAppBuildType config(temp) ([584b4c2](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/584b4c2))
* miss scope ([97242c3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/97242c3))


### Features

* 🎸 按 826 对齐结论调整出码和数据源引擎 ([b9a562e](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b9a562e))
* 🎸 补充对数据源的一些处理 ([4572b53](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/4572b53))
* 🎸 补充一个默认的数据源的构建后的样子 ([78f34ab](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/78f34ab))
* 🎸 出码模块的 DiskPublisher 改成支持传入自定义 FS ([46c896e](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/46c896e))
* 🎸 出码模块的 schema 相关的类型统一都改成引用 [@ali](https://gitlab.alibaba-inc.com/ali)/lowcode-types 中的,与设计器一致 ([27a9800](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/27a9800))
* 🎸 导出 Rax 的 solutions 的定义 ([27f0e13](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/27f0e13))
* 🎸 搞定 Rax 出码的时候的 package.json 中的 dependencies ([eba172c](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/eba172c))
* 🎸 还原出码模块的 solutions 的导出 ([c2a7d63](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c2a7d63))
* 🎸 解决通过 Rax 出码到小程序的时候循环里面没法用循环变量的问题 ([779ea7c](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/779ea7c))
* 🎸 容器的模块名统一都用 PascalCase, 并为页面添加特定后缀防止与组件名冲突 ([42f7bdb](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/42f7bdb))
* 🎸 数据源的类型默认是 fetch ([ec8a191](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/ec8a191))
* 🎸 数据源的requestHandlers选项改成requestHandlersMap, 命名更清晰 ([42e41bb](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/42e41bb))
* 🎸 添加 didMount 和 willUnmount 两个基本的生命周期 ([e33a95e](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/e33a95e))
* 🎸 添加一个判断 ContainerSchema 的 util 方便后续用 ([c3fdfe5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c3fdfe5))
* 🎸 通过 config.miniAppBuildType 来支持 Rax 的 runtime 模式 ([35fcdd9](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/35fcdd9))
* 🎸 完善 Rax 出码, 补充更复杂的带有数据源绑定/条件/循环以及 Utils 的测试用例并 pass ([adcfacb](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/adcfacb))
* 🎸 完善 Rax 出码, 跑通第一个测试用例👏👏👏 ([9f62110](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/9f62110))
* 🎸 完善 Rax 出码的时候的全局样式处理 ([058b087](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/058b087))
* 🎸 为 Rax 出码增加对 i18n 的支持 ([8d198bd](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/8d198bd))
* 🎸 新增 less 文件类型的定义, 以备后续某些 solution 出码用 less 文件作为样式文件 ([cac29d8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/cac29d8))
* 🎸 优化 Rax 出码时对绑定的表达式的包裹逻辑, 对于一些简单的安全的表达式不做包裹 ([facfa2a](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/facfa2a))
* 🎸 优化 ResultDir 的报错信息, 更方便定位问题 ([965ef4a](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/965ef4a))
* 🎸 优化完善 Rax 出码相关的模板和插件 ([c3d909a](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c3d909a))
* 🎸 与国凯的数据源保持一致,将 urlParams 所需的 search 参数直接传入 ([19fabc1](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/19fabc1))
* 🎸 与国凯的数据源引擎联调,对齐包名和导出方式 ([fea0946](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/fea0946))
* 🎸 支持对 JSON 文件进行 prettier 格式化 ([b7c4854](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b7c4854))
* 🎸 add rax code generator solution and test case ([20c0953](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/20c0953))
* 🎸 custom 类型的数据源请求不需要 handler ([fa939c4](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/fa939c4))
* 🎸 globalStyle 支持定制样式文件的后缀名 ([e78dae0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/e78dae0))
* 🎸 Rax 出码器支持路由功能 ([8ecc002](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/8ecc002))
* 🎸 Rax 出码适配数据源引擎的默认 requestHandlers ([5f529ae](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/5f529ae))
* 🎸 Rax 出码支持 constants 常量定义 ([fcf6c32](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/fcf6c32))
* 🎸 Rax 出码中添加数据源的 dataHandler 并与数据源引擎的对齐参数 ([42b9db3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/42b9db3))
* 🎸 Rax 出码中增加对 urlParams 这种特殊数据源的处理 ([c743afd](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/c743afd))




<a name="1.0.8-0"></a>
## [1.0.8-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.7-0...@ali/lowcode-code-generator@1.0.8-0) (2020-09-09)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.7-0"></a>
## [1.0.7-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.6-0...@ali/lowcode-code-generator@1.0.7-0) (2020-09-02)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.6-0"></a>
## [1.0.6-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.5-0...@ali/lowcode-code-generator@1.0.6-0) (2020-09-02)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.5-0"></a>
## [1.0.5-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.4-0...@ali/lowcode-code-generator@1.0.5-0) (2020-08-20)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.4-0"></a>
## [1.0.4-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.3-0...@ali/lowcode-code-generator@1.0.4-0) (2020-08-20)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.3-0"></a>
## [1.0.3-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.2-0...@ali/lowcode-code-generator@1.0.3-0) (2020-08-20)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.2-0"></a>
## [1.0.2-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.1-0...@ali/lowcode-code-generator@1.0.2-0) (2020-08-20)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.1-0"></a>
## [1.0.1-0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@1.0.0...@ali/lowcode-code-generator@1.0.1-0) (2020-08-20)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="1.0.0"></a>
# [1.0.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.13.0...@ali/lowcode-code-generator@1.0.0) (2020-08-17)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.13.0"></a>
# [0.13.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.12.0...@ali/lowcode-code-generator@0.13.0) (2020-08-17)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.12.0"></a>
# [0.12.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.10.0...@ali/lowcode-code-generator@0.12.0) (2020-08-17)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.11.0"></a>
# [0.11.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.10.0...@ali/lowcode-code-generator@0.11.0) (2020-08-17)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.10.0"></a>
# [0.10.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.9.0...@ali/lowcode-code-generator@0.10.0) (2020-08-16)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.9.0"></a>
# [0.9.0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.10...@ali/lowcode-code-generator@0.9.0) (2020-08-14)


### Bug Fixes

* 🐛 bugs about deps ([1eabd50](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/1eabd50))
* 🐛 children in props ([fe0ace8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/fe0ace8))
* 🐛 get deps info from slot ([6c3ae36](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/6c3ae36))
* 🐛 group chunks by filetype family ([db144a9](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/db144a9))
* 🐛 loop bug ([8f53910](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/8f53910))
* 🐛 repair children before deps analyze ([737d06e](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/737d06e))
* 🐛 support JSFunction type ([9061e4b](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/9061e4b))
* 🐛 更改复杂类型生成工具的接口形式，减少调用复杂度 ([ce616b5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/ce616b5))


### Features

* 🎸 add node type mapping config for jsx plugin ([19a51b8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/19a51b8))
* 🎸 code generator fix slot support ([e51b9cb](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/e51b9cb))




<a name="0.8.10"></a>
## [0.8.10](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.9...@ali/lowcode-code-generator@0.8.10) (2020-07-21)


### Bug Fixes

* 修复 condition 代码导出错误 ([57b30cf](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/57b30cf))
* 新增自定义模式 demo & 导出自定义需要的信息 ([07e2759](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/07e2759))


### Features

* add zip publisher ([31156ed](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/31156ed))
* prepare publish for code-generator ([93ff5c2](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/93ff5c2))




<a name="0.8.9"></a>
## [0.8.9](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.7...@ali/lowcode-code-generator@0.8.9) (2020-07-12)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.8.7"></a>
## [0.8.7](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.6...@ali/lowcode-code-generator@0.8.7) (2020-07-12)


### Bug Fixes

* demo data ([b4a27fc](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b4a27fc))
* factory api ([237b866](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/237b866))
* same name chunk case ([d6855e2](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/d6855e2))


### Features

* add recore project template ([267953b](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/267953b))
* add template create tool ([e906683](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/e906683))
* recore solution ([3bfe758](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/3bfe758))
* rewrite demo & export plugins and utils ([6cf7c3d](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/6cf7c3d))




<a name="0.8.6"></a>
## [0.8.6](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.5...@ali/lowcode-code-generator@0.8.6) (2020-06-23)


### Bug Fixes

* 更改生成 id 的规则, 否则命中 recore 解析 id 的一个限制 ([5adff44](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/5adff44))




<a name="0.8.5"></a>
## [0.8.5](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.4...@ali/lowcode-code-generator@0.8.5) (2020-04-15)


### Bug Fixes

* enhance compile config ([2899149](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/2899149))
* path resolve problem ([b12c0f8](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b12c0f8))
* post process file error ([389eaf7](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/389eaf7))
* rm demo in lib ([55630d6](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/55630d6))
* use webpack for package ([b350a88](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/b350a88))


### Features

* add prettier post processor ([49ac9a3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/49ac9a3))
* export publisher ([4a53faa](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/4a53faa))




<a name="0.8.4"></a>
## [0.8.4](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.3...@ali/lowcode-code-generator@0.8.4) (2020-03-30)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.8.3"></a>
## [0.8.3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/compare/@ali/lowcode-code-generator@0.8.2...@ali/lowcode-code-generator@0.8.3) (2020-03-30)




**Note:** Version bump only for package @ali/lowcode-code-generator

<a name="0.8.2"></a>
## 0.8.2 (2020-03-30)


### Features

* code generator main process ([021d6e0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/021d6e0))
* demo schema & complex children type ([a5ee6bd](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a5ee6bd))
* fix gaps ([32af3d3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/32af3d3))
* project builder fix & publish demo to disk ([26983b3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/26983b3))




<a name="0.8.1"></a>
## 0.8.1 (2020-03-30)


### Features

* code generator main process ([021d6e0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/021d6e0))
* demo schema & complex children type ([a5ee6bd](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a5ee6bd))
* fix gaps ([32af3d3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/32af3d3))
* project builder fix & publish demo to disk ([26983b3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/26983b3))
* code generator main process ([021d6e0](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/021d6e0fe9fb29a8b6c1c5d5f4d06ec71896faa5))
* demo schema & complex children type ([a5ee6bd](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/a5ee6bd55806fc9aea695096ccd4c7f50b8e31c4))
* fix gaps ([32af3d3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/32af3d3a3ca4d5aca15be25e05c840c8ea0cb6ae))
* project builder fix & publish demo to disk ([26983b3](https://gitlab.alibaba-inc.com/ali-lowcode/ali-lowcode-engine/commit/26983b38c2b0f1d39d79964eb54d8ce60250dd82))
