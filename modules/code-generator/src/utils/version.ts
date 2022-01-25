import semver from 'semver';

export function calcCompatibleVersion(v1: string | undefined | null, v2: string | undefined | null): string {
  if (!v1 && !v2) {
    return '*';
  }

  if (!v1 || v1 === '*') {
    return v2 || '*';
  }

  if (!v2 || v2 === '*') {
    return v1;
  }

  if (v1 === v2) {
    return v1;
  }

  if (!semver.intersects(v1, v2, { loose: true })) {
    throw new Error(`no compatible versions for "${v1}" and "${v2}"`);
  }

  if (semver.subset(v1, v2, { loose: true })) {
    return v1;
  }

  return v2;
}
