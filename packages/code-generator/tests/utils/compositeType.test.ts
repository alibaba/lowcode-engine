import { generateCompositeType } from '../../src/utils/compositeType';
import Scope from '../../src/utils/Scope';

test('single line string', () => {
  expect(generateCompositeType('ab c', Scope.createRootScope())).toEqual('"ab c"');
});

test('multi line string', () => {
  expect(generateCompositeType('a\nb\nc', Scope.createRootScope())).toEqual('"a\\nb\\nc"');
});

test('string with single quote', () => {
  expect(generateCompositeType('a\'bc', Scope.createRootScope())).toEqual('"a\'bc"');
});

test('string with double quote', () => {
  expect(generateCompositeType('a"bc', Scope.createRootScope())).toEqual('"a\\"bc"');
});
