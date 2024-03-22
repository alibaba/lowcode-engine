# Low-Code Engine 文档中心（site）

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### 本地开发

```
$ pnpm start
```

### 构建

```
$ pnpm build
```

### 部署

```bash
1. npm run build
2. npm publish # 记得改下版本号，比如 1.0.1

# 发布完后执行 tnpm syncOss 同步到 uipaas CDN
3. tnpm syncOss

4. 更新 diamond 版本 1.0.1
5. lowcode-engine.cn 站点生效
```

## 功能

- [x] 支持本地离线搜索
- [x] 版本化文档管理
- [x] 离线静态部署
- [x] 主题（fork 宜搭开发者中心）

## 使用文档

https://docusaurus.io/zh-CN/docs/docs-introduction
