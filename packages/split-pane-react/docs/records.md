
# 项目完善记录

## package.json中dependencies和peerDependencies问题

需要将react和react-dom作为peerDependencies
如果作为dependencies，用户安装的时候，可能会遇到React版本冲突的问题
从而导致重复下载React，在codesandbox下，导致页面崩溃

## 

