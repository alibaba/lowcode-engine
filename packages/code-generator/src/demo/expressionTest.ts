import traverse from '@babel/traverse';
import * as parser from '@babel/parser';

function test(functionBody: string) {
  console.log(functionBody);
  console.log('---->');
  try {
    const parseResult = parser.parse(functionBody);
    console.log(JSON.stringify(parseResult));
    traverse(parseResult, {
      enter(path) {
        console.log('path: ', path.type, path);
      }
    });
  } catch (error) {
    console.log('Error');
    console.log(error.message);
  }
  console.log('=====================');
}

test('function main() { state.fff = 1; }');
