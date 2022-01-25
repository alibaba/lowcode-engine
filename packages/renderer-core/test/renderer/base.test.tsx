import renderer from 'react-test-renderer';
import React from 'react';
import '../utils/react-env-init';
import pageRendererFactory from '../../src/renderer/renderer';
import { sampleSchema } from '../mock/sample';

describe('notFountComponent', () => {
  const Render = pageRendererFactory();

  const component = renderer.create(
    // @ts-ignore
    <Render
      schema={sampleSchema as any}
      components={{}}
      appHelper={{}}
    />,
  );

  it('not found snapshot', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})