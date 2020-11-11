import test from 'ava';
import { generateCompositeType } from '../../src/utils/compositeType';
import Scope from '../../src/utils/Scope';

test('single line string', (t) => {
  t.is(generateCompositeType('ab c', Scope.createRootScope()), '"ab c"');
});

test('multi line string', (t) => {
  t.is(generateCompositeType('a\nb\nc', Scope.createRootScope()), '"a\\nb\\nc"');
});


test('string with single quote', (t) => {
  t.is(generateCompositeType('a\'bc', Scope.createRootScope()), '"a\'bc"');
});

test('string with double quote', (t) => {
  t.is(generateCompositeType('a"bc', Scope.createRootScope()), '"a\\"bc"');
});
