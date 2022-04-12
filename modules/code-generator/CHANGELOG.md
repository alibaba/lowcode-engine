# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
