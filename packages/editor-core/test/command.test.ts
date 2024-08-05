import { Command } from '../src/command';

describe('Command', () => {
  let commandInstance;
  let mockHandler;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
  });

  describe('registerCommand', () => {
    it('should register a command successfully', () => {
      const command = {
        name: 'testCommand',
        handler: mockHandler,
      };
      commandInstance.registerCommand(command, { commandScope: 'testScope' });

      const registeredCommand = commandInstance.listCommands().find(c => c.name === 'testScope:testCommand');
      expect(registeredCommand).toBeDefined();
      expect(registeredCommand.name).toBe('testScope:testCommand');
    });

    it('should throw an error if commandScope is not provided', () => {
      const command = {
        name: 'testCommand',
        handler: mockHandler,
      };

      expect(() => {
        commandInstance.registerCommand(command);
      }).toThrow('plugin meta.commandScope is required.');
    });

    it('should throw an error if command is already registered', () => {
      const command = {
        name: 'testCommand',
        handler: mockHandler,
      };
      commandInstance.registerCommand(command, { commandScope: 'testScope' });

      expect(() => {
        commandInstance.registerCommand(command, { commandScope: 'testScope' });
      }).toThrow(`Command 'testCommand' is already registered.`);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('unregisterCommand', () => {
  let commandInstance;
  let mockHandler;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
    // 先注册一个命令以便之后注销
    const command = {
      name: 'testCommand',
      handler: mockHandler,
    };
    commandInstance.registerCommand(command, { commandScope: 'testScope' });
  });

  it('should unregister a command successfully', () => {
    const commandName = 'testScope:testCommand';
    expect(commandInstance.listCommands().find(c => c.name === commandName)).toBeDefined();

    commandInstance.unregisterCommand(commandName);

    expect(commandInstance.listCommands().find(c => c.name === commandName)).toBeUndefined();
  });

  it('should throw an error if the command is not registered', () => {
    const nonExistingCommandName = 'testScope:nonExistingCommand';
    expect(() => {
      commandInstance.unregisterCommand(nonExistingCommandName);
    }).toThrow(`Command '${nonExistingCommandName}' is not registered.`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('executeCommand', () => {
  let commandInstance;
  let mockHandler;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
    // 注册一个带参数校验的命令
    const command = {
      name: 'testCommand',
      handler: mockHandler,
      parameters: [
        { name: 'param1', propType: 'string' },
        { name: 'param2', propType: 'number' }
      ],
    };
    commandInstance.registerCommand(command, { commandScope: 'testScope' });
  });

  it('should execute a command successfully', () => {
    const commandName = 'testScope:testCommand';
    const args = { param1: 'test', param2: 42 };

    commandInstance.executeCommand(commandName, args);

    expect(mockHandler).toHaveBeenCalledWith(args);
  });

  it('should throw an error if the command is not registered', () => {
    const nonExistingCommandName = 'testScope:nonExistingCommand';
    expect(() => {
      commandInstance.executeCommand(nonExistingCommandName, {});
    }).toThrow(`Command '${nonExistingCommandName}' is not registered.`);
  });

  it('should throw an error if arguments are invalid', () => {
    const commandName = 'testScope:testCommand';
    const invalidArgs = { param1: 'test', param2: 'not-a-number' }; // param2 should be a number

    expect(() => {
      commandInstance.executeCommand(commandName, invalidArgs);
    }).toThrow(`Command '${commandName}' arguments param2 is invalid.`);
  });

  it('should handle errors thrown by the command handler', () => {
    const commandName = 'testScope:testCommand';
    const args = { param1: 'test', param2: 42 };
    const errorMessage = 'Command handler error';
    mockHandler.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    expect(() => {
      commandInstance.executeCommand(commandName, args);
    }).toThrow(errorMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('batchExecuteCommand', () => {
  let commandInstance;
  let mockHandler;
  let mockExecuteTransaction;
  let mockPluginContext;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
    mockExecuteTransaction = jest.fn(callback => callback());
    mockPluginContext = {
      common: {
        utils: {
          executeTransaction: mockExecuteTransaction
        }
      }
    };

    // 注册几个命令
    const command1 = {
      name: 'testCommand1',
      handler: mockHandler,
    };
    const command2 = {
      name: 'testCommand2',
      handler: mockHandler,
    };
    commandInstance.registerCommand(command1, { commandScope: 'testScope' });
    commandInstance.registerCommand(command2, { commandScope: 'testScope' });
  });

  it('should execute a batch of commands', () => {
    const commands = [
      { name: 'testScope:testCommand1', args: { param: 'value1' } },
      { name: 'testScope:testCommand2', args: { param: 'value2' } },
    ];

    commandInstance.batchExecuteCommand(commands, mockPluginContext);

    expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith({ param: 'value1' });
    expect(mockHandler).toHaveBeenCalledWith({ param: 'value2' });
  });

  it('should not execute anything if commands array is empty', () => {
    commandInstance.batchExecuteCommand([], mockPluginContext);

    expect(mockExecuteTransaction).not.toHaveBeenCalled();
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle errors thrown during command execution', () => {
    const errorMessage = 'Command handler error';
    mockHandler.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const commands = [
      { name: 'testScope:testCommand1', args: { param: 'value1' } },
      { name: 'testScope:testCommand2', args: { param: 'value2' } },
    ];

    expect(() => {
      commandInstance.batchExecuteCommand(commands, mockPluginContext);
    }).toThrow(errorMessage);

    expect(mockExecuteTransaction).toHaveBeenCalledTimes(1); // Still called once
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('listCommands', () => {
  let commandInstance;
  let mockHandler;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
  });

  it('should list all registered commands', () => {
    // 注册几个命令
    const command1 = {
      name: 'testCommand1',
      handler: mockHandler,
      description: 'Test Command 1',
      parameters: [{ name: 'param1', propType: 'string' }]
    };
    const command2 = {
      name: 'testCommand2',
      handler: mockHandler,
      description: 'Test Command 2',
      parameters: [{ name: 'param2', propType: 'number' }]
    };
    commandInstance.registerCommand(command1, { commandScope: 'testScope' });
    commandInstance.registerCommand(command2, { commandScope: 'testScope' });

    const listedCommands = commandInstance.listCommands();

    expect(listedCommands.length).toBe(2);
    expect(listedCommands).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'testScope:testCommand1',
        description: 'Test Command 1',
        parameters: [{ name: 'param1', propType: 'string' }]
      }),
      expect.objectContaining({
        name: 'testScope:testCommand2',
        description: 'Test Command 2',
        parameters: [{ name: 'param2', propType: 'number' }]
      })
    ]));
  });

  it('should return an empty array if no commands are registered', () => {
    const listedCommands = commandInstance.listCommands();
    expect(listedCommands).toEqual([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('onCommandError', () => {
  let commandInstance;
  let mockHandler;
  let mockErrorHandler1;
  let mockErrorHandler2;

  beforeEach(() => {
    commandInstance = new Command();
    mockHandler = jest.fn();
    mockErrorHandler1 = jest.fn();
    mockErrorHandler2 = jest.fn();

    // 注册一个命令，该命令会抛出错误
    const command = {
      name: 'testCommand',
      handler: () => {
        throw new Error('Command execution failed');
      },
    };
    commandInstance.registerCommand(command, { commandScope: 'testScope' });
  });

  it('should call all registered error handlers when a command throws an error', () => {
    const commandName = 'testScope:testCommand';
    commandInstance.onCommandError(mockErrorHandler1);
    commandInstance.onCommandError(mockErrorHandler2);

    expect(() => {
      commandInstance.executeCommand(commandName, {});
    }).not.toThrow();

    // 确保所有错误处理函数都被调用，并且传递了正确的参数
    expect(mockErrorHandler1).toHaveBeenCalledWith(commandName, expect.any(Error));
    expect(mockErrorHandler2).toHaveBeenCalledWith(commandName, expect.any(Error));
  });

  it('should throw the error if no error handlers are registered', () => {
    const commandName = 'testScope:testCommand';

    expect(() => {
      commandInstance.executeCommand(commandName, {});
    }).toThrow('Command execution failed');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
