import test from 'ava';
import type { ExecutionContext, Macro } from 'ava';
import { calcCompatibleVersion } from '../../src/utils/version';

const NO_COMPATIBLE_VERSIONS = /no compatible versions/;

const testCalcCompatibleVersion: Macro<any[]> = (
  t: ExecutionContext<Record<string, unknown>>,
  input: [string | null | undefined, string | null | undefined],
  expected: string,
  error?: { message: RegExp },
) => {
  if (!error) {
    t.is(calcCompatibleVersion(input[0], input[1]), expected);
    t.is(calcCompatibleVersion(input[1], input[0]), expected); // 应该满足交换律
  } else {
    t.throws(() => {
      calcCompatibleVersion(input[0], input[1]);
    }, error.message);
    t.throws(() => {
      calcCompatibleVersion(input[1], input[0]); // 应该满足交换律
    }, error.message);
  }
};

testCalcCompatibleVersion.title = (providedTitle: string | undefined, ...args: any[]): string => {
  const [input, expected] = args;
  return `calc compatible versions "${input[0]}" & "${input[1]}" should be "${expected}"`;
};

test(testCalcCompatibleVersion, ['*', '*'], '*');
test(testCalcCompatibleVersion, ['1.0.0', '1.0.0'], '1.0.0');
test(testCalcCompatibleVersion, ['^1.0.0', '^1.0.0'], '^1.0.0');

test(testCalcCompatibleVersion, ['*', undefined], '*');

test(testCalcCompatibleVersion, [undefined, undefined], '*');

test(testCalcCompatibleVersion, ['^1.0.0', undefined], '^1.0.0');

test(testCalcCompatibleVersion, ['*', '^1.0.0'], '^1.0.0');
test(testCalcCompatibleVersion, ['^1.0.0', '^1.0.2'], '^1.0.2');
test(testCalcCompatibleVersion, ['^1.2.0', '^1.1.2'], '^1.2.0');
test(testCalcCompatibleVersion, ['^1.0.0', '1.0.2'], '1.0.2');

test(testCalcCompatibleVersion, ['^0.2.0', '^0.1.2'], 'error', { message: NO_COMPATIBLE_VERSIONS });

test(testCalcCompatibleVersion, ['>0.2.0', '^0.1.2'], 'error', { message: NO_COMPATIBLE_VERSIONS });

test(testCalcCompatibleVersion, ['1.0.1', '1.0.2'], 'error', { message: NO_COMPATIBLE_VERSIONS });
