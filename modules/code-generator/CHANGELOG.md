# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.7-beta.2](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.3...@alilc/lowcode-code-generator@1.0.7-beta.2) (2022-11-24)

### Bug Fixes

* 🐛 解决 react 中 jsx 出码的时候对于循环数据漏包 __$evalArray 的问题 ([3b9b177](https://github.com/alibaba/lowcode-engine/commit/3b9b177b052169cd0c1078cf8b488f04cb374dac))
* 🐛 解决出码缺乏对于 i18n 数据的 params 的处理的问题 ([2cf788c](https://github.com/alibaba/lowcode-engine/commit/2cf788c1716ae63fef20004348c59a5a65c6b3d2)), closes [#288](https://github.com/alibaba/lowcode-engine/issues/288)
* 🐛 解决小程序环境没有 window, 而 rax 出码中却默认在 __$eval 中用到 window 的问题 ([ce531ae](https://github.com/alibaba/lowcode-engine/commit/ce531aeb457711fac92d828b431cfc3d643b3682))
* add support for jsx expression ([453e069](https://github.com/alibaba/lowcode-engine/commit/453e0699ece06d98e59227e23248baf1de4082aa))
* 修复生成的 icejs 项目不支持 constants 的问题, fixes [#1259](https://github.com/alibaba/lowcode-engine/issues/1259) ([a079fbc](https://github.com/alibaba/lowcode-engine/commit/a079fbc256f8275e8a69eb6d8abb6f6b08179578))
* 修正 react 框架出码中在严格模式对 methods 和 context 的处理 ([b1a6100](https://github.com/alibaba/lowcode-engine/commit/b1a61006bba4292790899c7c49c9c611a9384472))
### [1.0.7-beta.1](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.7-beta.0...@alilc/lowcode-code-generator@1.0.7-beta.1) (2022-10-26)


### Bug Fixes

* fix empty string lost when generate variable ([2cf74cd](https://github.com/alibaba/lowcode-engine/commit/2cf74cd04b4f48a3501d37329d39784f6964366a))

### [1.0.7-beta.0](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.6-beta.0...@alilc/lowcode-code-generator@1.0.7-beta.0) (2022-10-25)

### [1.0.6-beta.0](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.3...@alilc/lowcode-code-generator@1.0.6-beta.0) (2022-10-25)


### Features

* 🎸 设计态支持数据源引擎配置 ([04631f8](https://github.com/alibaba/lowcode-engine/commit/04631f813782dbf6d175f51c40ccc75ca4c099d2))
* 大纲树支持节点过滤 ([f30db20](https://github.com/alibaba/lowcode-engine/commit/f30db20606f5f2fdac0017305b1dda7ab2258c4b))
* 为 renderer 追加 displayName，以支持后续的反射功能 ([6399cce](https://github.com/alibaba/lowcode-engine/commit/6399cce05ae494dac6facf4366949b0b97576079))
* 资产包支持一个package从另一个package异步导出 ([#1150](https://github.com/alibaba/lowcode-engine/issues/1150)) ([6b78157](https://github.com/alibaba/lowcode-engine/commit/6b78157b211d6eabf60297b9ce980a3e10cc8272))
* add availableActions for ComponentMeta ([de1f60b](https://github.com/alibaba/lowcode-engine/commit/de1f60bbee157267e2c2212df1077cc49ce506f4))
* add code coverage action ([ed3ddcf](https://github.com/alibaba/lowcode-engine/commit/ed3ddcf5c942a8e78e1f247e41d4159da97e75a8))
* add componentMeta getter for setingPropEntry ([2f8b954](https://github.com/alibaba/lowcode-engine/commit/2f8b9545de0210260001a832b52f608238ac4191))
* add expanded to shell SettingPropEntry ([534e294](https://github.com/alibaba/lowcode-engine/commit/534e29429d445d97c71d95d4c4e492868527bb6b))
* add flag createIfNode for ShellNode#getProp ([152a24d](https://github.com/alibaba/lowcode-engine/commit/152a24d65528d0a3b7990c9aa87e6d8d09aa9b2a))
* add getComponentsMap() for DocumentModel ([f956645](https://github.com/alibaba/lowcode-engine/commit/f9566454ef83eb4c48b68d63a766c3d0ff927c73))
* add getExtraPropValue setExtraPropValue to shell SettingPropEntry ([70e7c1c](https://github.com/alibaba/lowcode-engine/commit/70e7c1c2e8998e80d58447759efdf651105724a9))
* add id setter for DocumentModel ([941ae05](https://github.com/alibaba/lowcode-engine/commit/941ae0592586334694c48197aaa6692d49cefbce))
* add importSchema event for documentModel ([4b8ec09](https://github.com/alibaba/lowcode-engine/commit/4b8ec09e86e3950a9d4066c28e681a59273b4c93))
* add isGroup & items to shell SettingPropEntry ([7b76ff3](https://github.com/alibaba/lowcode-engine/commit/7b76ff357e4e638454c31a9b1324fb68966ec522))
* add mergeChldren API for shell node ([a47d4ee](https://github.com/alibaba/lowcode-engine/commit/a47d4eea28cf4479e3b3a2bd1d194a6433666825))
* add onMountNode event for DocumentModel ([dcc247c](https://github.com/alibaba/lowcode-engine/commit/dcc247c7d54f6af2ed36d46bfd79c7eacf7bd604))
* add renderer for simulatorHost ([1cfc8d6](https://github.com/alibaba/lowcode-engine/commit/1cfc8d668b8897ef3a53c11520312cc6d18338f9))
* add script for synchronizing packages to intranet registry ([b4f463e](https://github.com/alibaba/lowcode-engine/commit/b4f463e7d45f7b476de04bd4d98ad9f74d53cf13))
* add scrollToNode for simulator host ([#1075](https://github.com/alibaba/lowcode-engine/issues/1075)) ([0bcd9ff](https://github.com/alibaba/lowcode-engine/commit/0bcd9ff78227aeddaf2fdc22d10fbd662fed91d3))
* add setVisible for Node ([ba90327](https://github.com/alibaba/lowcode-engine/commit/ba90327eac0f5f82f6349bb9a7684bf51259e9c9))
* add showArea & hideArea method for skeleton ([8f6b53e](https://github.com/alibaba/lowcode-engine/commit/8f6b53e67d89ee7af754132f0994a759522b3821))
* add slotNode for shell prop ([d9a44c5](https://github.com/alibaba/lowcode-engine/commit/d9a44c5de7861e9180567b4afb787e381cefac61))
* add some features ([18d1a4f](https://github.com/alibaba/lowcode-engine/commit/18d1a4fe1d952bcd4715e693def09fee94da49a5))
* add some necessary methods and attributes ([4fd7f27](https://github.com/alibaba/lowcode-engine/commit/4fd7f27f8eb33b66324ede279b412940fc1f7032))
* add some params for onDragstart & onDrag & onDragend ([d1c9838](https://github.com/alibaba/lowcode-engine/commit/d1c9838343ba1bdd4c02c1cfbf1f920dd8c87e7d))
* add top attrbute for Shell SettingPropEntry ([51aca3d](https://github.com/alibaba/lowcode-engine/commit/51aca3d330b6483c05b71867f1b362a9f5db6cfe))
* added lowcode engine standard specs ([f25feba](https://github.com/alibaba/lowcode-engine/commit/f25feba63f181efa83f1a8dff530e1c39ab1b34c))
* added lowcode engine standard specs ([57df803](https://github.com/alibaba/lowcode-engine/commit/57df803179ca9cec4e8ab1dac1be577175732e65))
* added thisRequiredInJSE API to control whether JSExpression expression access context must use this ([#702](https://github.com/alibaba/lowcode-engine/issues/702)) ([da7f77e](https://github.com/alibaba/lowcode-engine/commit/da7f77ee91b3bf441a4a57614872df32d6a1d041))
* assetLoader loda scripts with async=false ([f6ad4a1](https://github.com/alibaba/lowcode-engine/commit/f6ad4a157df8c0ff7db327f4770f454998693d9a))
* change loop sertter config, set defaultValue prop to JsonSetter ([aa6b9c8](https://github.com/alibaba/lowcode-engine/commit/aa6b9c8f7a5353771af9f46216310f044e57c533))
* cp dist files of simulator-renderer to that of engine ([03c5397](https://github.com/alibaba/lowcode-engine/commit/03c53971df6de8c35620fd77743ac4f57a82d323))
* export nodeChildrenSymbol && remove some unnecessary editor.set ([e83adce](https://github.com/alibaba/lowcode-engine/commit/e83adcee815eea73b6b1ed4f43f4d684c11818ca))
* fix render-core leaf hoc component condition config should get from leaf exportSchema fn ([85704c3](https://github.com/alibaba/lowcode-engine/commit/85704c36946191a1b88db789cfac59e9d027a371))
* low-code components support lifecycle and function execution ([176583f](https://github.com/alibaba/lowcode-engine/commit/176583f48af573d30c0d2c36faa3d901b0541c06))
* **material-parser:** check module before install it; fix default value issue in ts parser ([fc452f7](https://github.com/alibaba/lowcode-engine/commit/fc452f7166f02acfba6076c1a9425e6f5880b5f6))
* modify the output method of rendering module parsing errors ([8255b79](https://github.com/alibaba/lowcode-engine/commit/8255b7945836ee5d25fae73913faa6d0af7b3ff3))
* pass e to customizeIgnoreSelectors ([900b239](https://github.com/alibaba/lowcode-engine/commit/900b2394323e85f0dce5df83dfc773f96da23e24))
* refine nesting drawer ([4c032d0](https://github.com/alibaba/lowcode-engine/commit/4c032d0d0ead9731c038bd62dccc4a7d96435183))
* refine nesting drawer ([94a211e](https://github.com/alibaba/lowcode-engine/commit/94a211e2795f74721cfd2ae3ff38a1d3607e9cd0))
* refine pop drawer ([abf8fae](https://github.com/alibaba/lowcode-engine/commit/abf8fae3ef4d62b5688362e1b98f1b508a207029))
* requestHandlersMap should be optional ([ee7160e](https://github.com/alibaba/lowcode-engine/commit/ee7160ea3c625d421c07730ef51711b8f14392a0))
* return unbind function for onChangeDetecting & onChangeSelection ([30267cb](https://github.com/alibaba/lowcode-engine/commit/30267cb173fca2cd80a61450b9f2fe2bceac0f06))
* support for hiding settings tabs when there is only one item ([#669](https://github.com/alibaba/lowcode-engine/issues/669)) ([cbd95a1](https://github.com/alibaba/lowcode-engine/commit/cbd95a1778415406670f37507ce957af6b3ecd4a))
* support for NotFoundComponent design state is optional ([#1013](https://github.com/alibaba/lowcode-engine/issues/1013)) ([d3c891e](https://github.com/alibaba/lowcode-engine/commit/d3c891e2a46d138e31c81a7f9b804a8240154df5))
* support opening document with id ([3f7c0cd](https://github.com/alibaba/lowcode-engine/commit/3f7c0cd5191b7924f2630c58e6439f4d4a936ac9))
* support SPA mode ([1f9150e](https://github.com/alibaba/lowcode-engine/commit/1f9150e4b260d522bd7cb31497069b700a1e8576))
* sync utils/constants ([#506](https://github.com/alibaba/lowcode-engine/issues/506)) ([2871b5b](https://github.com/alibaba/lowcode-engine/commit/2871b5ba4c3dbf1ed76bf4d6359fb457190a9b22))
* the tips when dragging a component from the component panel same with the moving component ([dbe0764](https://github.com/alibaba/lowcode-engine/commit/dbe0764ff4901450f03ca56b62167fbc87d2524a))


### Bug Fixes

* 🐛 解决 react 中 jsx 出码的时候对于循环数据漏包 __$evalArray 的问题 ([3b9b177](https://github.com/alibaba/lowcode-engine/commit/3b9b177b052169cd0c1078cf8b488f04cb374dac))
* 🐛 解决出码缺乏对于 i18n 数据的 params 的处理的问题 ([2cf788c](https://github.com/alibaba/lowcode-engine/commit/2cf788c1716ae63fef20004348c59a5a65c6b3d2)), closes [#288](https://github.com/alibaba/lowcode-engine/issues/288)
* 🐛 解决小程序环境没有 window, 而 rax 出码中却默认在 __$eval 中用到 window 的问题 ([ce531ae](https://github.com/alibaba/lowcode-engine/commit/ce531aeb457711fac92d828b431cfc3d643b3682))
* 🐛 修复数据源引擎请求处理器映射严格模式下被过滤的问题 ([75626d8](https://github.com/alibaba/lowcode-engine/commit/75626d877db017b8862b1d5e64d75f3af7ff667a))
* 🐛 修正 i18n 里面的一个参数命名问题 ([20c6fca](https://github.com/alibaba/lowcode-engine/commit/20c6fca03e99b11fa5c257cbbda0d4d23f410090))
* 新元素无法在大纲树拖拽 ([3d41fd5](https://github.com/alibaba/lowcode-engine/commit/3d41fd5d0783048a7cfb54c6f80d058856153d25))
* 修复React17选中组件bug ([750d282](https://github.com/alibaba/lowcode-engine/commit/750d282c03a880204fefdef01e180510465b82f8))
* 修正 react 框架出码中在严格模式对 methods 和 context 的处理 ([b1a6100](https://github.com/alibaba/lowcode-engine/commit/b1a61006bba4292790899c7c49c9c611a9384472))
* 左侧抽屉固定模式层级不足 ([c657cee](https://github.com/alibaba/lowcode-engine/commit/c657cee0694e3126dee89588a2aa17c4e118f786))
* add  lowcode-designer, lowcode-utils dependencies ([d250242](https://github.com/alibaba/lowcode-engine/commit/d2502427ca988881747a35bd8da49f024939b833))
* add support for jsx expression ([1043ef8](https://github.com/alibaba/lowcode-engine/commit/1043ef82b1e9ceefc3b74fd21eb28e9a740bd1db))
* addon-combine affect metadata unexpectedly ([fc5fbc6](https://github.com/alibaba/lowcode-engine/commit/fc5fbc63a04a32bc887754f32e74c76149d74b05))
* adjust synchronize-order of packages ([81a7304](https://github.com/alibaba/lowcode-engine/commit/81a73049bd848524e1156761ded08ddf325863ba))
* change typescript type export to export type ([50e4a03](https://github.com/alibaba/lowcode-engine/commit/50e4a03b7d810131ce413cc057b43d4a726f1ebe))
* change typescript type export to export type ([573504b](https://github.com/alibaba/lowcode-engine/commit/573504b0e3537ca60d234ce2b2f3feedb323405e))
* declare parameter appHelper for valid engine options ([058a842](https://github.com/alibaba/lowcode-engine/commit/058a84226af8ca19d8c7d63599d80d0cdf70281c))
* defaultValue should be evaluated inspite of condition result is falsy, fixes [#1045](https://github.com/alibaba/lowcode-engine/issues/1045) ([fcfce3c](https://github.com/alibaba/lowcode-engine/commit/fcfce3cbeb5a53600c40aea07ffef19c9c9591c4))
* delete the defaultValue configuration outside the loop ([acf7449](https://github.com/alibaba/lowcode-engine/commit/acf7449ca231d45e8ed7e1d9416817ea11b1266f))
* delete unused typescript types ([63f5d2c](https://github.com/alibaba/lowcode-engine/commit/63f5d2ca3e0bda92898fd0df28c9500707812082))
* delete unused typescript types ([2432aed](https://github.com/alibaba/lowcode-engine/commit/2432aed83d55407d2f8b5f94910ada7ea78bb59e))
* designer/loadIncrementalAssets await Sequential ([#841](https://github.com/alibaba/lowcode-engine/issues/841)) ([8232424](https://github.com/alibaba/lowcode-engine/commit/823242469743d235923b3b946ec7d2db70887ead))
* error thrown when triggering undo after save schema on SchemaPane ([9be46e7](https://github.com/alibaba/lowcode-engine/commit/9be46e7b34e3a40cbc489dbae4bfd0915c2090e3))
* fallback focusNode to root if empty ([a9a118f](https://github.com/alibaba/lowcode-engine/commit/a9a118fe6e79080245c6eea42ed26772b7c784ca))
* **filter:**  unique key prop warning ([3fe6e41](https://github.com/alibaba/lowcode-engine/commit/3fe6e41536cd3a9b9c7eaca5b353de4bd1f91b11))
* **filter:**  unique key prop warning ([06e6920](https://github.com/alibaba/lowcode-engine/commit/06e6920602bdf21b6e1ffe5cfa3dfe4856e7c57e))
* fix css resources with parameters not loading correctly ([f859752](https://github.com/alibaba/lowcode-engine/commit/f85975211814147d40ae5330a76cb21cb6c66916))
* fix css resources with parameters not loading correctly ([9a5a04a](https://github.com/alibaba/lowcode-engine/commit/9a5a04ac9560fb6a51bf4e0ed8ea446381d39c35))
* fix dataSource needs to be compatible due to empty schema ([98bc477](https://github.com/alibaba/lowcode-engine/commit/98bc477d80dbf7993f89befdb42762d78a55fb1b))
* fix displayName spell mistake ([2b2bcbd](https://github.com/alibaba/lowcode-engine/commit/2b2bcbdaebde6a3ce974072f586386ef7ef3497c))
* fix internal project.getSchema default stage is error ([0d40db2](https://github.com/alibaba/lowcode-engine/commit/0d40db2581f4fe5a9e22f763f21aec641e366c34))
* fix lint issues for renderer-core/renderer/base ([d85437d](https://github.com/alibaba/lowcode-engine/commit/d85437d4af1043371e27dfde98cecf914b93a126))
* fix lint issues for renderer-core/renderer/base ([4b59190](https://github.com/alibaba/lowcode-engine/commit/4b59190c7f9d518bc7efac44b7eeee73f1b5d177))
* fix low-code component rendering problems: 1. thisRequiredInJSE does not take effect 2. jsx components cannot obtain source components ([5dd4625](https://github.com/alibaba/lowcode-engine/commit/5dd462544fbbbccfa97165f2bcfeed8629fab2a3))
* fix material-spec demo ([438cccd](https://github.com/alibaba/lowcode-engine/commit/438cccd58e4341638070c1d8b2d4e78e4e20e3fb))
* fix misused doc urls ([16a8857](https://github.com/alibaba/lowcode-engine/commit/16a88578634b9da2f04698df5ca5a5e69151bb97))
* fix monitor utils incorrect assignment method ([bf280c6](https://github.com/alibaba/lowcode-engine/commit/bf280c6fa1e46d084fc8f20323164816fad4076f))
* fix outline-pane invisible occasionally when dragging tree node ([031c7f2](https://github.com/alibaba/lowcode-engine/commit/031c7f25f10a6cfebfc7929c9226f4e4167a359f))
* fix outline-tree initialization failed ([a2d5c6f](https://github.com/alibaba/lowcode-engine/commit/a2d5c6fd90ca0226bbbfea01a4b28c8b8d307a78))
* fix render module state expression initialization exception ([5bd68ee](https://github.com/alibaba/lowcode-engine/commit/5bd68ee6b448fa58b022870b3f8175d8b77febde))
* fix render module state expression initialization exception ([9c545cc](https://github.com/alibaba/lowcode-engine/commit/9c545cca6004f65e2f206ea001cefa3fa3cfa807))
* fix setter hooks error ([8a3a0b8](https://github.com/alibaba/lowcode-engine/commit/8a3a0b824162e25a930711c6fef511b4b369e897))
* fix test case failures of designer ([4b0521a](https://github.com/alibaba/lowcode-engine/commit/4b0521a47494f78e120f75021e0a076fb00ce53e))
* Fix the conversion failure of some props expressions under Slot props of low-code components ([7db5461](https://github.com/alibaba/lowcode-engine/commit/7db5461706c739fac673b2466bc2fda7661242e4))
* fix the leaf hoc component fails to monitor Node changes, and modify the logic for get node ([6ee6b07](https://github.com/alibaba/lowcode-engine/commit/6ee6b07a10ba4aac583def52d8ff1fa78d111d0b))
* fix the leaf hoc component fails to monitor Node changes, and modify the logic for get node ([f400172](https://github.com/alibaba/lowcode-engine/commit/f4001728259047b09db75d76a8c3ef1e1bcb4e0a))
* fix the problem that material.getComponentMetasMap returns the wrong result ([e02933c](https://github.com/alibaba/lowcode-engine/commit/e02933c18bc15519b2eba8ad946282502a509611))
* Fix the rendering error caused by incorrect key value when configuring the loop ([1026763](https://github.com/alibaba/lowcode-engine/commit/1026763dc5a77d4395a1e86e5a0084ab4fb4230c))
* fix the unit test failure problem caused by thisRequiredInJSE modification ([c2c59b7](https://github.com/alibaba/lowcode-engine/commit/c2c59b7ff72ba06156bbcdb952262739d6188209))
* fix unnecessary props calculation ([f1fed75](https://github.com/alibaba/lowcode-engine/commit/f1fed75f39be8289ede1ec558b04428a69e25b5f))
* fixed an issue where materials would be rendered multiple times ([9d187cc](https://github.com/alibaba/lowcode-engine/commit/9d187ccb7de55857e861d3fc881c610506872d03))
* fixed an issue where materials would be rendered multiple times ([64cc328](https://github.com/alibaba/lowcode-engine/commit/64cc3283c15342151a8f93c46a276681f3575153))
* fixed focusNodeSelector configuration not taking effect ([9beae9c](https://github.com/alibaba/lowcode-engine/commit/9beae9c3269901bf03a29033121c7d480571bce5))
* fixed the issue that thisRequiredInJSE did not take effect in some scenarios ([7e5a919](https://github.com/alibaba/lowcode-engine/commit/7e5a919f9352397f11741fd911495996469c0256))
* in ES require changed to import ([b4d7d6d](https://github.com/alibaba/lowcode-engine/commit/b4d7d6d8c290a335a2c1f60731d4417b23444941))
* in ES require changed to import ([7c8cd36](https://github.com/alibaba/lowcode-engine/commit/7c8cd36a10a7caa61de31a15abd93ab8a97fbe08))
* leaf should be type of ShellNode other than InnerNode ([5bb8cf5](https://github.com/alibaba/lowcode-engine/commit/5bb8cf5d12d38d70b69fa28deb2f8aa0afa9b9b9))
* lowcode component exec lifecycle has error ([f99a47e](https://github.com/alibaba/lowcode-engine/commit/f99a47e502080134454795f5e361cfa4fba3f03b))
* lowcode component leaf dont have export prop, exec leaf.export make error ([9d51dcd](https://github.com/alibaba/lowcode-engine/commit/9d51dcdae38850be0206861f2cae74ca68805c25))
* missing engine options config info ([a79875c](https://github.com/alibaba/lowcode-engine/commit/a79875cf8698d3912b50526d97f6ac72e9a21fc9))
* missing engine options config info ([9ccded0](https://github.com/alibaba/lowcode-engine/commit/9ccded006ef44cd538abaa140250e519243bf090))
* npm run clean error in windows ([a176e9d](https://github.com/alibaba/lowcode-engine/commit/a176e9d245981fb5718c8d144f477202b3796be6))
* project event listeners will not be invoked sometimes ([a0c772f](https://github.com/alibaba/lowcode-engine/commit/a0c772fb903cf5eb9e0b811b64bbe3846d4ba8ac))
* project.exportSchema api lack stage param & setAssets should be a async fn ([0ea76a7](https://github.com/alibaba/lowcode-engine/commit/0ea76a746fac8ea8e7b999d42434c468c85d6372))
* project.exportSchema should export componentsMap of all documents ([969a130](https://github.com/alibaba/lowcode-engine/commit/969a130b373fb028f8051e96cb9d79f1de0a2a1c))
* removed incorrectly calling childWhitelist hook logic during drag and drop ([#1141](https://github.com/alibaba/lowcode-engine/issues/1141)) ([6576346](https://github.com/alibaba/lowcode-engine/commit/6576346b9185bedb090be9c84129e077cf5389b3))
* renderer not rendering correct components when loading components with loadAsyncLibrary api ([9b3b4f9](https://github.com/alibaba/lowcode-engine/commit/9b3b4f9b0e35ef3ea2f0117f0cdb2254e15d5389))
* should pass index param when creating a Prop instance under a list type Prop instance, fix [#780](https://github.com/alibaba/lowcode-engine/issues/780) ([a8de3f2](https://github.com/alibaba/lowcode-engine/commit/a8de3f299c7b26fa939d2b2ea1428143e2b5fb01))
* simulator eclipses setting area [#773](https://github.com/alibaba/lowcode-engine/issues/773) ([b4b30a3](https://github.com/alibaba/lowcode-engine/commit/b4b30a359932f5c0e8fde1b28f54a883c87901d8))
* spec typo ([#1064](https://github.com/alibaba/lowcode-engine/issues/1064)) ([ecb9dca](https://github.com/alibaba/lowcode-engine/commit/ecb9dca2b9386ef6fadfd009d161a9203b9b9558))
* try catch calculation of dynamic setter ([f61e2a2](https://github.com/alibaba/lowcode-engine/commit/f61e2a2b8a3d8d6754474cd392bc259917c7eb10))
* type=legao dont make request ([98ececa](https://github.com/alibaba/lowcode-engine/commit/98ececa9c11f93e5f849b201b5b5e7ff453733d7))
* **types:** rrror declaration of the children prop ([951d1cb](https://github.com/alibaba/lowcode-engine/commit/951d1cb103fa46c0e7926d6138657c7d10cc4f88))
* use the original object if it is not a shell object ([5ea53f7](https://github.com/alibaba/lowcode-engine/commit/5ea53f706b6571946bcfa56b8655b55717381771))
* use the outer documentation url of unique key, fixes [#868](https://github.com/alibaba/lowcode-engine/issues/868) ([d770007](https://github.com/alibaba/lowcode-engine/commit/d770007ff8c39e6cf527e07a7d6468dbb88c776d))
* use the outer documentation url of unique key, fixes [#868](https://github.com/alibaba/lowcode-engine/issues/868) ([912ee22](https://github.com/alibaba/lowcode-engine/commit/912ee22180a424f63298c319c62fb481513af904))
* use uppercase resize trigger names based on material spec ([7fda0ef](https://github.com/alibaba/lowcode-engine/commit/7fda0efe131e0e2e3141849cf3f87307e7ce1b36))
* when designMode is not design, the hidden attribute does not take effect ([3dd0b6d](https://github.com/alibaba/lowcode-engine/commit/3dd0b6d0a86267e3029c176ff49aff793ce3e186))

### [1.0.4](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.4-beta.0...@alilc/lowcode-code-generator@1.0.4) (2022-04-12)


### Bug Fixes

* 🐛 解决 react 中 jsx 出码的时候对于循环数据漏包 __$evalArray 的问题 ([eb4cc69](https://github.com/alibaba/lowcode-engine/commit/eb4cc693f5dbcae54546c569eb8fa331d074e062))

### [1.0.4-beta.1](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.4-beta.0...@alilc/lowcode-code-generator@1.0.4-beta.1) (2022-04-11)


### Bug Fixes

* 🐛 解决 react 中 jsx 出码的时候对于循环数据漏包 __$evalArray 的问题 ([987f4ce](https://github.com/alibaba/lowcode-engine/commit/987f4cea54ef8a75d0b63a0268b5a20b2938b8a7))

### [1.0.4-beta.0](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.3...@alilc/lowcode-code-generator@1.0.4-beta.0) (2022-04-10)


### Features

* **material-parser:** check module before install it; fix default value issue in ts parser ([fc452f7](https://github.com/alibaba/lowcode-engine/commit/fc452f7166f02acfba6076c1a9425e6f5880b5f6))


### Bug Fixes

* 🐛 修正 i18n 里面的一个参数命名问题 ([1e9e388](https://github.com/alibaba/lowcode-engine/commit/1e9e388ce9104d76c4f6d9bc513c57e5059d7982))
* 🐛 解决出码缺乏对于 i18n 数据的 params 的处理的问题 ([1eb9add](https://github.com/alibaba/lowcode-engine/commit/1eb9addd8df2323f9aabac87af32ac2efcd6bf22)), closes [#288](https://github.com/alibaba/lowcode-engine/issues/288)
* 🐛 解决小程序环境没有 window, 而 rax 出码中却默认在 __$eval 中用到 window 的问题 ([67dabb0](https://github.com/alibaba/lowcode-engine/commit/67dabb04beb32b6e94eb1276222e53b416e47c9d))
* Fix the conversion failure of some props expressions under Slot props of low-code components ([7db5461](https://github.com/alibaba/lowcode-engine/commit/7db5461706c739fac673b2466bc2fda7661242e4))
* fix unnecessary props calculation ([f1fed75](https://github.com/alibaba/lowcode-engine/commit/f1fed75f39be8289ede1ec558b04428a69e25b5f))
* 修正 react 框架出码中在严格模式对 methods 和 context 的处理 ([79db4ac](https://github.com/alibaba/lowcode-engine/commit/79db4ac97f34f24b7f7460fb3fc67521967f8cc5))

### [1.0.3](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.2...@alilc/lowcode-code-generator@1.0.3) (2022-03-29)


### Features

* add getConvertedExtraKey / getOriginalExtraKey to utils ([8e7bb9d](https://github.com/alibaba/lowcode-engine/commit/8e7bb9d4b86454dd77c6928eb769cd764cad8630))


### Bug Fixes

* 🐛 出码: 解决 componentName 和 exportName 不一致时生成的 import 语句的问题 ([eefc091](https://github.com/alibaba/lowcode-engine/commit/eefc091ee7e86d6214d20d486212cb5aff237946))
* component cannot be redisplayed by configuration after rendering is closed ([c54f369](https://github.com/alibaba/lowcode-engine/commit/c54f369e1860d818479dda9d6429f851c0b08fa6))
* fix loop configuration auto fill empty array issue ([d087092](https://github.com/alibaba/lowcode-engine/commit/d087092fd712eff0556adacda692d3ff6f2f9f22))
* make important true by default ([c63b6e1](https://github.com/alibaba/lowcode-engine/commit/c63b6e1bfadc3fc87ed41840952e02ffbff24fab))
* make insertAfter & insertBefore work ([70fd372](https://github.com/alibaba/lowcode-engine/commit/70fd3720d098d6e227acb9281ee22feee66b9c0b))
* npm源 ([437adcc](https://github.com/alibaba/lowcode-engine/commit/437adccf5f2dbb400de6e2bef10cfc4b65286f2b))
* prop should return undefined when all items are undefined ([5bb9ec7](https://github.com/alibaba/lowcode-engine/commit/5bb9ec7a1dfaabfdb5369226b54d5f63a7999e59))
* should not create new prop while querying fileName ([19c207d](https://github.com/alibaba/lowcode-engine/commit/19c207d29de045f473ba73baaf34e7294d40261a))
* variable binding lost after modify the mock value ([ef95b56](https://github.com/alibaba/lowcode-engine/commit/ef95b5683273d8302bde1582de8afe3d87a808d8))
* Workbench should receive the original skeleton other than shell skeleton ([d5c3ca1](https://github.com/alibaba/lowcode-engine/commit/d5c3ca1068ce2c2140980bd059d0da333574dc34))

### [1.0.2](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.2-beta.1...@alilc/lowcode-code-generator@1.0.2) (2022-03-08)

### [1.0.2-beta.1](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.2-beta.0...@alilc/lowcode-code-generator@1.0.2-beta.1) (2022-03-08)


### Bug Fixes

* 🐛 补充 icejs 模板中缺失的依赖包 ([a94553e](https://github.com/alibaba/lowcode-engine/commit/a94553e503d439b67478df6a34950d9e3d15a063))

### [1.0.2-beta.0](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.0...@alilc/lowcode-code-generator@1.0.2-beta.0) (2022-03-08)


### Features

* 在 skeleton 增加几个方法和事件 ([a7d436a](https://github.com/alibaba/lowcode-engine/commit/a7d436a0525a0ce0c7229710077111f283b452f4))
* modify npm private control & version ([ee55d02](https://github.com/alibaba/lowcode-engine/commit/ee55d024a7f964ccf35a0efabec817364cea8041))
* modify yuque link in README ([d522034](https://github.com/alibaba/lowcode-engine/commit/d522034879d20a7b5ed12f8fe02a30662a2ea7c6))
* remove CHANGELOG.md ([b996414](https://github.com/alibaba/lowcode-engine/commit/b996414c436b5d2439c8368eb4e001cdbcd02892))
* remove module field in material-parser package.json ([6141c27](https://github.com/alibaba/lowcode-engine/commit/6141c273c9c32eea22b5374679fe625e6ea15394))
* rename build:umd ([23c7959](https://github.com/alibaba/lowcode-engine/commit/23c795931e1d5cf43e9c21cd902441c69c1ecc63))
* replace tnpm with npm ([36caf0f](https://github.com/alibaba/lowcode-engine/commit/36caf0f18980c16f7ebb82ac845ad6b33e033567))
* support UMD packageing for react-renderer ([982d0d6](https://github.com/alibaba/lowcode-engine/commit/982d0d676b3dfbfc10a2190c0040126d6925ed37))


### Bug Fixes

* 🐛 去掉 npm 上没有的依赖 ([#68](https://github.com/alibaba/lowcode-engine/issues/68)) ([e7ce779](https://github.com/alibaba/lowcode-engine/commit/e7ce77987eb05871dd1675d2a88367c5569bfbff))
* 兼容 setters 为空的情况 ([56b459a](https://github.com/alibaba/lowcode-engine/commit/56b459a017a8350a911ef20f0166d1e62b6390e4))
* 解决 package.json 中误添加了没有用到的数据源类型的 handler 的包的问题 ([#56](https://github.com/alibaba/lowcode-engine/issues/56)) ([76341c8](https://github.com/alibaba/lowcode-engine/commit/76341c8456b227192bb65537dc3d16033db0b3a1))
* 解决出码的一些问题 ([#87](https://github.com/alibaba/lowcode-engine/issues/87)) ([4a01c97](https://github.com/alibaba/lowcode-engine/commit/4a01c97ea6bf23eb677888ba1aba54e5c9f4f630))
* 修复 setup 的逻辑 ([1cfb15a](https://github.com/alibaba/lowcode-engine/commit/1cfb15aebea9796af23b2135f2aa4409d81283d7))
* 修正一些对内的地址 ([07cc1f2](https://github.com/alibaba/lowcode-engine/commit/07cc1f2954530c64a1a3d260e8d532c9e19892e8))
* 增加必要的方法 ([1b38a81](https://github.com/alibaba/lowcode-engine/commit/1b38a812653656aa02100a3b1b2a581188d1b3ef))
* fix tsconfig of material-parser ([46725cb](https://github.com/alibaba/lowcode-engine/commit/46725cb9f3166912c8f5b42f1e0b1177158c1ee3))
* lint&fix auto generated types.ts ([7dde970](https://github.com/alibaba/lowcode-engine/commit/7dde9701c7960b29523abddf32421cdbac47016d))
* The outline tree does not display the loop flag when the loop is an empty array ([191e284](https://github.com/alibaba/lowcode-engine/commit/191e284f2fa190c2b3aecb4df31849b2bdc99d38))

### [1.0.1](https://github.com/alibaba/lowcode-engine/compare/@alilc/lowcode-code-generator@1.0.0...@alilc/lowcode-code-generator@1.0.1) (2022-03-08)


### Features

* 在 skeleton 增加几个方法和事件 ([a7d436a](https://github.com/alibaba/lowcode-engine/commit/a7d436a0525a0ce0c7229710077111f283b452f4))
* modify npm private control & version ([ee55d02](https://github.com/alibaba/lowcode-engine/commit/ee55d024a7f964ccf35a0efabec817364cea8041))
* modify yuque link in README ([d522034](https://github.com/alibaba/lowcode-engine/commit/d522034879d20a7b5ed12f8fe02a30662a2ea7c6))
* remove CHANGELOG.md ([b996414](https://github.com/alibaba/lowcode-engine/commit/b996414c436b5d2439c8368eb4e001cdbcd02892))
* remove module field in material-parser package.json ([6141c27](https://github.com/alibaba/lowcode-engine/commit/6141c273c9c32eea22b5374679fe625e6ea15394))
* rename build:umd ([23c7959](https://github.com/alibaba/lowcode-engine/commit/23c795931e1d5cf43e9c21cd902441c69c1ecc63))
* replace tnpm with npm ([36caf0f](https://github.com/alibaba/lowcode-engine/commit/36caf0f18980c16f7ebb82ac845ad6b33e033567))
* support UMD packageing for react-renderer ([982d0d6](https://github.com/alibaba/lowcode-engine/commit/982d0d676b3dfbfc10a2190c0040126d6925ed37))


### Bug Fixes

* 🐛 修正一些示例地址 ([8d21283](https://github.com/alibaba/lowcode-engine/commit/8d212832e77a1ec763db668683917705774acd0d))
* 兼容 setters 为空的情况 ([56b459a](https://github.com/alibaba/lowcode-engine/commit/56b459a017a8350a911ef20f0166d1e62b6390e4))
* 修复 setup 的逻辑 ([1cfb15a](https://github.com/alibaba/lowcode-engine/commit/1cfb15aebea9796af23b2135f2aa4409d81283d7))
* 修正一些对内的地址 ([07cc1f2](https://github.com/alibaba/lowcode-engine/commit/07cc1f2954530c64a1a3d260e8d532c9e19892e8))
* 增加必要的方法 ([1b38a81](https://github.com/alibaba/lowcode-engine/commit/1b38a812653656aa02100a3b1b2a581188d1b3ef))
* fix tsconfig of material-parser ([46725cb](https://github.com/alibaba/lowcode-engine/commit/46725cb9f3166912c8f5b42f1e0b1177158c1ee3))
* lint&fix auto generated types.ts ([7dde970](https://github.com/alibaba/lowcode-engine/commit/7dde9701c7960b29523abddf32421cdbac47016d))
* The outline tree does not display the loop flag when the loop is an empty array ([191e284](https://github.com/alibaba/lowcode-engine/commit/191e284f2fa190c2b3aecb4df31849b2bdc99d38))

## 1.0.0 (2022-02-17)


### Features

* first commit - genesis ([4f4ac51](https://github.com/alibaba/lowcode-engine/commit/4f4ac5115d18357a7399632860808f6cffc33fad))
