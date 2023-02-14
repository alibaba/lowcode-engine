/**
 * Check whether a component is external package, e.g. @ali/uxcore
 * @param path Component path
 */
export function isPackagePath(path: string): boolean {
  return !path.startsWith('.') && !path.startsWith('/');
}

/**
 * Title cased string
 * @param s original string
 */
export function toTitleCase(s: string): string {
  return s
    .split(/[-_ .]+/)
    .map((token) => token[0].toUpperCase() + token.substring(1))
    .join('');
}

/**
 * Make up an import name/tag for components
 * @param path Original path name
 */
export function generateComponentName(path: string): string {
  const parts = path.split('/');
  let name = parts.pop();
  if (name && /^index\./.test(name)) {
    name = parts.pop();
  }
  return name ? toTitleCase(name) : 'Component';
}

/**
 * normalizing import path for easier comparison
 */
export function getNormalizedImportPath(path: string): string {
  const segments = path.split('/');
  let basename = segments.pop();
  if (!basename) {
    return path;
  }
  const ignoredExtensions = ['.ts', '.js', '.tsx', '.jsx'];
  const extIndex = basename.lastIndexOf('.');
  if (extIndex > -1) {
    const ext = basename.slice(extIndex);
    if (ignoredExtensions.includes(ext)) {
      basename = basename.slice(0, extIndex);
    }
  }
  if (basename !== 'index') {
    segments.push(basename);
  }
  return segments.join('/');
}

/**
 * make a relative path
 *
 * @param toPath abolute path
 * @param fromPath absolute path
 */
export function makeRelativePath(toPath: string, fromPath: string) {
  // not a absolute path, eg. @ali/uxcore
  if (!toPath.startsWith('/')) {
    return toPath;
  }
  const toParts = toPath.split('/');
  const fromParts = fromPath.split('/');

  // find shared path header
  const length = Math.min(fromParts.length, toParts.length);
  let sharedUpTo = length;
  for (let i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      sharedUpTo = i;
      break;
    }
  }

  // find how many levels to go up from
  // minus another 1 since we do not include the final
  const numGoUp = fromParts.length - sharedUpTo - 1;

  // generate final path
  let outputParts = [];
  if (numGoUp === 0) {
    // in the same dir
    outputParts.push('.');
  } else {
    // needs to go up
    for (let i = 0; i < numGoUp; ++i) {
      outputParts.push('..');
    }
  }

  outputParts = outputParts.concat(toParts.slice(sharedUpTo));

  return outputParts.join('/');
}

function normalizeArray(parts: string[], allowAboveRoot: boolean) {
  const res = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    // ignore empty parts
    if (!p || p === '.') {
      continue;
    }

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

function normalize(path: string): string {
  const isAbsolute = path[0] === '/';

  const segments = normalizeArray(path.split('/'), !isAbsolute);
  if (isAbsolute) {
    segments.unshift('');
  } else if (segments.length < 1 || segments[0] !== '..') {
    segments.unshift('.');
  }

  return segments.join('/');
}

/**
 * Resolve component with absolute path to relative path
 * @param path absolute path of component from project
 */
export function resolveAbsoluatePath(path: string, base: string): string {
  if (!path.startsWith('.')) {
    // eg.  /usr/path/to, @ali/button
    return path;
  }
  path = path.replace(/\\/g, '/');
  if (base.slice(-1) !== '/') {
    base += '/';
  }
  return normalize(base + path);
}

export function joinPath(...segments: string[]) {
  let path = '';
  for (const seg of segments) {
    if (seg) {
      if (path === '') {
        path += seg;
      } else {
        path += `/${ seg}`;
      }
    }
  }
  return normalize(path);
}

export function removeVersion(path: string): string {
  if (path.lastIndexOf('@') > 0) {
    path = path.replace(/(@?[^@]+)(@[\w.-]+)(.+)/, '$1$3');
  }
  return path;
}
