---
title: command - 指令 API
sidebar_position: 10
---



## 模块概览

该模块使得与命令系统的交互成为可能，提供了一种全面的方式来处理、执行和管理应用程序中的命令。



## 接口

### IPublicApiCommand

与命令交互的接口。它提供了注册、注销、执行和管理命令的方法。



## 方法

### registerCommand

注册一个新命令及其处理函数。

```
typescriptCopy code
/**
 * 注册一个新的命令及其处理程序。
 * @param command {IPublicTypeCommand} - 要注册的命令。
 */
registerCommand(command: IPublicTypeCommand): void;
```

### unregisterCommand

注销一个已存在的命令。

```
typescriptCopy code
/**
 * 注销一个已存在的命令。
 * @param name {string} - 要注销的命令的名称。
 */
unregisterCommand(name: string): void;
```

### executeCommand

根据名称和提供的参数执行命令，确保参数符合命令的定义。

```
typescriptCopy code
/**
 * 根据名称和提供的参数执行命令。
 * @param name {string} - 要执行的命令的名称。
 * @param args {IPublicTypeCommandHandlerArgs} - 命令的参数。
 */
executeCommand(name: string, args?: IPublicTypeCommandHandlerArgs): void;
```

### batchExecuteCommand

批量执行命令，在所有命令执行后进行重绘，历史记录中只记录一次。

```
typescriptCopy code
/**
 * 批量执行命令，随后进行重绘，历史记录中只记录一次。
 * @param commands {Array} - 命令对象的数组，包含名称和可选参数。
 */
batchExecuteCommand(commands: { name: string; args?: IPublicTypeCommandHandlerArgs }[]): void;
```

### listCommands

列出所有已注册的命令。

```
typescriptCopy code
/**
 * 列出所有已注册的命令。
 * @returns {IPublicTypeListCommand[]} - 已注册命令的数组。
 */
listCommands(): IPublicTypeListCommand[];
```

### onCommandError

为命令执行过程中的错误注册错误处理回调函数。

```
typescriptCopy code
/**
 * 为命令执行过程中的错误注册一个回调函数。
 * @param callback {(name: string, error: Error) => void} - 错误处理的回调函数。
 */
onCommandError(callback: (name: string, error: Error) => void): void;
```
