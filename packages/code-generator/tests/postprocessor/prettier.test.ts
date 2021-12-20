import { prettier } from '../../src/postprocessor';

describe('postprocessor/prettier', () => {
  it('should works for js file', () => {
    const fileType = 'js';
    const content = `import { Button } from '@alifd/next'; export function App(){return <Button />}`;
    expect(prettier()(content, fileType)).toMatchSnapshot();
  });

  it('should works for jsx file', () => {
    const fileType = 'jsx';
    const content = `import { Button } from '@alifd/next'; export function App(){return <Button />}`;
    expect(prettier()(content, fileType)).toMatchSnapshot();
  });

  it('should works for json file', () => {
    const fileType = 'json';
    const content = `{"components": ["Button","Block"]}`;
    expect(prettier()(content, fileType)).toMatchSnapshot();
  });

  it('should works for custom files', () => {
    const fileType = 'vue';
    const content = `<template><div>Hello</div><script>export default {  }</script>`;
    expect(
      prettier({
        customFileTypeParser: {
          vue: 'html',
        },
      })(content, fileType),
    ).toMatchSnapshot();
  });

  it('should works for other files', () => {
    const fileType = 'less';
    const content = `.foo{font-size: 12px;}`;
    expect(prettier()(content, fileType)).toMatchSnapshot();
  });
});
