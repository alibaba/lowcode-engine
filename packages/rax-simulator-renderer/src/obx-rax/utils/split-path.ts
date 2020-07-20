const RE_PATH = /^([^/]*)(?:\/(.*))?$/;
const RE_PATH_REVERSE = /^(?:(.*)\/)?([^/]+)$/;
export function splitPath(path: string, reverse = false) {
  return reverse ? RE_PATH_REVERSE.exec(path) : RE_PATH.exec(path);
}
