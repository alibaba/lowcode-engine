import renderer from 'react-test-renderer';
import React from 'react';
import { createElement } from 'react';
import '../utils/react-env-init';
import { leafWrapper } from '../../src/hoc/leaf';
import components from '../utils/components';
import Node from '../utils/node';

const baseRenderer: any = {
  __debug () {},
  __getComponentProps (schema: any) {
    return schema.props;
  },
  __getSchemaChildrenVirtualDom () {},
  context: {
    engine: {
      createElement,
    }
  },
  props: {
    __host: {},
    getNode: () => {},
    __container: () => {},
  }
}

describe('leafWrapper', () => {
  const Div = leafWrapper(components.Div as any, {
    schema: {
      id: 'div',
    },
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  const DivNode = new Node({});
  const TextNode = new Node({});

  const Text = leafWrapper(components.Text as any, {
    schema: {
      id: 'div',
      props: {
        content: 'content'
      }
    },
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  const component = renderer.create(
    // @ts-ignore
    <Div _leaf={DivNode}>
      <Text _leaf={TextNode} content="content"></Text>
    </Div>
  );

  it('base', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('change props', () => {
    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('change ___condition___ props', () => {
    TextNode.schema.condition = false;
    TextNode.emitPropChange({
      key: '___condition___',
      newValue: false,
    } as any);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('change ___condition___ props, but not hidden component', () => {
    TextNode.schema.condition = true;
    TextNode.emitPropChange({
      key: '___condition___',
      newValue: false,
    } as any);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});

describe('loop', () => {
  const Div = leafWrapper(components.Div as any, {
    schema: {
      id: 'div',
    },
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  const DivNode = new Node({});
  const TextNode = new Node({});

  const Text = leafWrapper(components.Text as any, {
    schema: {
      id: 'div',
      props: {
        content: 'content'
      }
    },
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  const component = renderer.create(
    // @ts-ignore
    <Div _leaf={DivNode}>
      <Text _leaf={TextNode} content="content"></Text>
    </Div>
  );
});
