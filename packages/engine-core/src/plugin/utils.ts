interface TaskMap {
  [key: string]: {
    name: string;
    dep: string[];
  };
}

interface Options {
  tasks: TaskMap;
  names: string[];
  results: string[];
  missing: string[];
  recursive: string[][];
  nest: string[];
  parentName: string;
}

export function sequence({ tasks, names, results, missing, recursive, nest, parentName }: Options) {
  names.forEach((name) => {
    if (results.indexOf(name) !== -1) {
      return; // de-dup results
    }
    const node = tasks[name];
    if (!node) {
      missing.push([parentName, name].filter((d) => !!d).join('.'));
    } else if (nest.indexOf(name) > -1) {
      nest.push(name);
      recursive.push(nest.slice(0));
      nest.pop();
    } else if (node.dep.length) {
      nest.push(name);
      sequence({
        tasks,
        parentName: name,
        names: node.dep,
        results,
        missing,
        recursive,
        nest,
      }); // recurse
      nest.pop();
    }
    results.push(name);
  });
}

// tasks: object with keys as task names
// names: array of task names
export function sequencify(tasks: TaskMap, names: string[]) {
  let results: string[] = []; // the final sequence
  const missing: string[] = []; // missing tasks
  const recursive: string[][] = []; // recursive task dependencies

  sequence({
    tasks,
    names,
    results,
    missing,
    recursive,
    nest: [],
  } as any);

  if (missing.length || recursive.length) {
    results = []; // results are incomplete at best, completely wrong at worst, remove them to avoid confusion
  }

  return {
    sequence: results,
    missingTasks: missing,
    recursiveDependencies: recursive,
  };
}
