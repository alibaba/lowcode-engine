## Ali Lowcode Engine（阿里低代码引擎）

## 开发

#### 创建新包

- `./scripts/create.sh <package-name>`

#### 运行示例

- `npm run setup`
- `npm start`

#### 开发提交

- `git add <your-files>`
- `git commit -a "feat: xxx"`

## 发布

- `npm run pub`

## 注意

- `packages` 工程里一些开发时公共依赖（比如：`typescript`、`ava` 等）会放到工程顶层
- 工程里的 `.md`、`test/` 等文件修改不会产生新的发布
- 当工程里存在多个 ts 文件的目录时，最终产生的文件会按文件夹形式放到 `lib` 下

## 包权限管理

- `npm owner ls @ali/<pkg> --registry http://registry.npm.alibaba-inc.com`
- `npm owner add <user> @ali/<pkg> --registry http://registry.npm.alibaba-inc.com`
- `npm owner rm <user> @ali/<pkg> --registry http://registry.npm.alibaba-inc.com`
