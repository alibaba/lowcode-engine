import sequencify, { sequence } from '../../src/plugin/sequencify';

describe('sequence', () => {
  it('handles tasks with no dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] },
      task2: { name: 'Task 2', dep: [] }
    };
    const results = [];
    const missing = [];
    const recursive = [];
    sequence({ tasks, names: ['task1', 'task2'], results, missing, recursive, nest: [] });

    expect(results).toEqual(['task1', 'task2']);
    expect(missing).toEqual([]);
    expect(recursive).toEqual([]);
  });

  it('correctly orders tasks based on dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] },
      task2: { name: 'Task 2', dep: ['task1'] }
    };
    const results = [];
    const missing = [];
    const recursive = [];
    sequence({ tasks, names: ['task2', 'task1'], results, missing, recursive, nest: [] });

    expect(results).toEqual(['task1', 'task2']);
    expect(missing).toEqual([]);
    expect(recursive).toEqual([]);
  });

  it('identifies missing tasks', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] }
    };
    const results = [];
    const missing = [];
    const recursive = [];
    const nest = []
    sequence({ tasks, names: ['task2'], results, missing, recursive, nest });

    expect(results).toEqual(['task2']);
    expect(missing).toEqual(['task2']);
    expect(recursive).toEqual([]);
    expect(nest).toEqual([]);
  });

  it('detects recursive dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: ['task2'] },
      task2: { name: 'Task 2', dep: ['task1'] }
    };
    const results = [];
    const missing = [];
    const recursive = [];
    const nest = []
    sequence({ tasks, names: ['task1', 'task2'], results, missing, recursive, nest });

    expect(results).toEqual(['task1', 'task2', 'task1']);
    expect(missing).toEqual([]);
    expect(recursive).toEqual([['task1', 'task2', 'task1']]);
    expect(nest).toEqual([]);
  });
});

describe('sequence', () => {

  it('should return tasks in sequence without dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] },
      task2: { name: 'Task 2', dep: [] },
      task3: { name: 'Task 3', dep: [] }
    };
    const names = ['task1', 'task2', 'task3'];
    const expected = {
      sequence: ['task1', 'task2', 'task3'],
      missingTasks: [],
      recursiveDependencies: []
    };
    expect(sequencify(tasks, names)).toEqual(expected);
  });

  it('should handle tasks with dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] },
      task2: { name: 'Task 2', dep: ['task1'] },
      task3: { name: 'Task 3', dep: ['task2'] }
    };
    const names = ['task3', 'task2', 'task1'];
    const expected = {
      sequence: ['task1', 'task2', 'task3'],
      missingTasks: [],
      recursiveDependencies: []
    };
    expect(sequencify(tasks, names)).toEqual(expected);
  });

  it('should identify missing tasks', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: [] },
      task2: { name: 'Task 2', dep: ['task3'] } // task3 is missing
    };
    const names = ['task1', 'task2'];
    const expected = {
      sequence: [],
      missingTasks: ['task2.task3'],
      recursiveDependencies: []
    };
    expect(sequencify(tasks, names)).toEqual(expected);
  });

  it('should detect recursive dependencies', () => {
    const tasks = {
      task1: { name: 'Task 1', dep: ['task2'] },
      task2: { name: 'Task 2', dep: ['task1'] } // Recursive dependency
    };
    const names = ['task1', 'task2'];
    const expected = {
      sequence: [],
      missingTasks: [],
      recursiveDependencies: [['task1', 'task2', 'task1']]
    };
    expect(sequencify(tasks, names)).toEqual(expected);
  });

});