function sequence(tasks, names, results, missing, recursive, nest) {
  names.forEach((name) => {
    if (results.indexOf(name) !== -1) {
      return; // de-dup results
    }
    const node = tasks[name];
    if (!node) {
      missing.push(name);
    } else if (nest.indexOf(name) > -1) {
      nest.push(name);
      recursive.push(nest.slice(0));
      nest.pop(name);
    } else if (node.dep.length) {
      nest.push(name);
      sequence(tasks, node.dep, results, missing, recursive, nest); // recurse
      nest.pop(name);
    }
    results.push(name);
  });
}

// tasks: object with keys as task names
// names: array of task names
export default function (tasks, names) {
  let results = []; // the final sequence
  const missing = []; // missing tasks
  const recursive = []; // recursive task dependencies

  sequence(tasks, names, results, missing, recursive, []);

  if (missing.length || recursive.length) {
    results = []; // results are incomplete at best, completely wrong at worst, remove them to avoid confusion
  }

  return {
    sequence: results,
    missingTasks: missing,
    recursiveDependencies: recursive,
  };
}
