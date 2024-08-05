import renderer from 'react-test-renderer';
import React from 'react';
import { createElement } from 'react';
import '../utils/react-env-init';
import { leafWrapper } from '../../src/hoc/leaf';
import components from '../utils/components';
import Node from '../utils/node';
import { parseData } from '../../src/utils';

let rerenderCount = 0;

const nodeMap = new Map();

const makeSnapshot = (component) => {
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
}

const baseRenderer: any = {
  __debug () {},
  __getComponentProps (schema: any) {
    return schema.props;
  },
  __getSchemaChildrenVirtualDom (schema: any) {
    return schema.children;
  },
  context: {
    engine: {
      createElement,
    }
  },
  props: {
    __host: {},
    getNode: (id) => nodeMap.get(id),
    __container: {
      rerender: () => {
        rerenderCount = 1 + rerenderCount;
      },
      autoRepaintNode: true,
    },
    documentId: '01'
  },
  __parseData (data, scope) {
    return parseData(data, scope, {});
  }
}

let Div, DivNode, Text, TextNode, component, textSchema, divSchema;
let id = 0;

beforeEach(() => {
  textSchema = {
    id: 'text' + id,
    props: {
      content: 'content'
    },
  };

  divSchema = {
    id: 'div' + id,
  };

  id++;

  Div = leafWrapper(components.Div as any, {
    schema: divSchema,
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  DivNode = new Node(divSchema);
  TextNode = new Node(textSchema);

  nodeMap.set(divSchema.id, DivNode);
  nodeMap.set(textSchema.id, TextNode);

  Text = leafWrapper(components.Text as any, {
    schema: textSchema,
    baseRenderer,
    componentInfo: {},
    scope: {},
  });

  component = renderer.create(
    <Div _leaf={DivNode}>
      <Text _leaf={TextNode} content="content"></Text>
    </Div>
  );
});

afterEach(() => {
  component.unmount(component);
});

describe('onPropChange', () => {
  it('change textNode [key:content] props', () => {
    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    const root = component.root;
    expect(root.findByType(components.Text).props.content).toEqual('new content')
  });

  it('change textNode [key:___condition___] props, hide textNode component', () => {
    // mock leaf?.export result
    TextNode.schema.condition = false;
    TextNode.emitPropChange({
      key: '___condition___',
      newValue: false,
    } as any);

    makeSnapshot(component);
  });

  it('change textNode [key:___condition___] props, but not hidden component', () => {
    TextNode.schema.condition = true;
    TextNode.emitPropChange({
      key: '___condition___',
      newValue: false,
    } as any);

    makeSnapshot(component);
  });

  it('change textNode [key:content], content in this.props but not in leaf.export result', () => {
    makeSnapshot(component);

    delete TextNode.schema.props.content;
    TextNode.emitPropChange({
      key: 'content',
      newValue: null,
    } as any, true);

    makeSnapshot(component);

    const root = component.root;

    const TextInst = root.findByType(components.Text);

    expect(TextInst.props.content).toBeNull();
  });

  it('change textNode [key:___loop___], make rerender', () => {
    expect(leafWrapper(components.Text as any, {
      schema: textSchema,
      baseRenderer,
      componentInfo: {},
      scope: {},
    })).toEqual(Text);

    const nextRerenderCount = rerenderCount + 1;

    TextNode.emitPropChange({
      key: '___loop___',
      newValue: 'new content',
    } as any);

    expect(rerenderCount).toBe(nextRerenderCount);
    expect(leafWrapper(components.Text as any, {
      schema: textSchema,
      baseRenderer,
      componentInfo: {},
      scope: {},
    })).not.toEqual(Text);
  });
});

describe('lifecycle', () => {
  it('props change and make componentWillReceiveProps', () => {
    makeSnapshot(component);

    // 没有 __tag 标识
    component.update((
      <Div _leaf={DivNode}>
        <Text _leaf={TextNode} content="content 123"></Text>
      </Div>
    ));

    makeSnapshot(component);

    // 有 __tag 标识
    component.update((
      <Div _leaf={DivNode}>
        <Text _leaf={TextNode} __tag="111" content="content 123"></Text>
      </Div>
    ));

    makeSnapshot(component);
  });

  it('leaf change and make componentWillReceiveProps', () => {
    const newTextNodeLeaf = new Node(textSchema);
    nodeMap.set(textSchema.id, newTextNodeLeaf);
    component.update((
      <Div _leaf={DivNode}>
        <Text componentId={textSchema.id} __tag="222" content="content 123"></Text>
      </Div>
    ));

    newTextNodeLeaf.emitPropChange({
      key: 'content',
      newValue: 'content new leaf',
    });

    makeSnapshot(component);
  });
});

describe('mini unit render', () => {
  let miniRenderSchema, MiniRenderDiv, MiniRenderDivNode;
  beforeEach(() => {
    miniRenderSchema = {
      id: 'miniDiv' + id,
    };

    MiniRenderDiv = leafWrapper(components.MiniRenderDiv as any, {
      schema: miniRenderSchema,
      baseRenderer,
      componentInfo: {},
      scope: {},
    });

    MiniRenderDivNode = new Node(miniRenderSchema, {
      componentMeta: {
        isMinimalRenderUnit: true,
      },
    });

    TextNode = new Node(textSchema, {
      parent: MiniRenderDivNode,
    });

    nodeMap.set(miniRenderSchema.id, MiniRenderDivNode);
    nodeMap.set(textSchema.id, TextNode);

    component = renderer.create(
      <MiniRenderDiv _leaf={MiniRenderDivNode}>
        <Text _leaf={TextNode} content="content"></Text>
      </MiniRenderDiv>
    );
  })

  it('make text props change', () => {
    if (!MiniRenderDivNode.schema.props) {
      MiniRenderDivNode.schema.props = {};
    }
    MiniRenderDivNode.schema.props['newPropKey'] = 'newPropValue';

    makeSnapshot(component);

    const inst = component.root;

    const TextInst = inst.findByType(Text).children[0];

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    expect((TextInst as any)?._fiber.stateNode.renderUnitInfo).toEqual({
      singleRender: false,
      minimalUnitId: 'miniDiv' + id,
      minimalUnitName: undefined,
    });

    makeSnapshot(component);
  });

  it('dont render mini render component', () => {
    const TextNode = new Node(textSchema, {
      parent: new Node({
        id: 'random',
      }, {
        componentMeta: {
          isMinimalRenderUnit: true,
        },
      }),
    });

    nodeMap.set(textSchema.id, TextNode);

    renderer.create(
      <div>
        <Text _leaf={TextNode} content="content"></Text>
      </div>
    );

    const nextCount = rerenderCount + 1;

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    expect(rerenderCount).toBe(nextCount);
  });

  it('leaf is a mock function', () => {
    const TextNode = new Node(textSchema, {
      parent: {
        isEmpty: () => false,
      }
    });

    renderer.create(
      <div>
        <Text _leaf={TextNode} content="content"></Text>
      </div>
    );

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);
  });

  it('change component leaf isRoot is true', () => {
    const TextNode = new Node(textSchema, {
      isRoot: true,
      isRootNode: true,
    });

    nodeMap.set(textSchema.id, TextNode);

    const component = renderer.create(
      <Text _leaf={TextNode} content="content"></Text>
    );

    const inst = component.root;

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    expect((inst.children[0] as any)?._fiber.stateNode.renderUnitInfo).toEqual({
      singleRender: true,
    });
  });

  it('change component leaf parent isRoot is true', () => {
    const TextNode = new Node(textSchema, {
      parent: new Node({
        id: 'first-parent',
      }, {
        componentMeta: {
          isMinimalRenderUnit: true,
        },
        parent: new Node({
          id: 'rootId',
        }, {
          isRoot: true,
          isRootNode: true
        }),
      })
    });

    nodeMap.set(textSchema.id, TextNode);

    const component = renderer.create(
      <Text _leaf={TextNode} content="content"></Text>
    );

    const inst = component.root;

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content',
    } as any);

    expect((inst.children[0] as any)?._fiber.stateNode.renderUnitInfo).toEqual({
      singleRender: false,
      minimalUnitId: 'first-parent',
      minimalUnitName: undefined,
    });
  });

  it('parent is a mock leaf', () => {
    const MiniRenderDivNode = {
      isMock: true,
    };

    const component = renderer.create(
      <MiniRenderDiv _leaf={MiniRenderDivNode}>
        <Text _leaf={TextNode} content="content"></Text>
      </MiniRenderDiv>
    );

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'new content to mock',
    } as any);

    makeSnapshot(component);
  });

  it('props has new children', () => {
    MiniRenderDivNode.schema.props.children = [
      'children 01',
      'children 02',
    ];

    TextNode.emitPropChange({
      key: 'content',
      newValue: 'props'
    });

    makeSnapshot(component);
  });

  it('leaf has a loop, render from parent', () => {
    MiniRenderDivNode = new Node(miniRenderSchema, {});

    TextNode = new Node(textSchema, {
      parent: MiniRenderDivNode,
      hasLoop: true,
    });

    nodeMap.set(textSchema.id, TextNode);
    nodeMap.set(miniRenderSchema.id, MiniRenderDivNode);

    component = renderer.create(
      <MiniRenderDiv _leaf={MiniRenderDivNode}>
        <Text _leaf={TextNode} content="content"></Text>
      </MiniRenderDiv>
    );

    MiniRenderDivNode.schema.children = ['this is a new children'];

    TextNode.emitPropChange({
      key: 'content',
      newValue: '1',
    });

    makeSnapshot(component);
  });
});

describe('component cache', () => {
  it('get different component with same is and different doc id', () => {
    const baseRenderer02 = {
      ...baseRenderer,
      props: {
        ...baseRenderer.props,
        documentId: '02',
      }
    }
    const Div3 = leafWrapper(components.Div as any, {
      schema: divSchema,
      baseRenderer: baseRenderer02,
      componentInfo: {},
      scope: {},
    });

    expect(Div).not.toEqual(Div3);
  });

  it('get component again and get ths cache component', () => {
    const Div2 = leafWrapper(components.Div as any, {
      schema: divSchema,
      baseRenderer,
      componentInfo: {},
      scope: {},
    });

    expect(Div).toEqual(Div2);
  });
});

describe('onVisibleChange', () => {
  it('visible is false', () => {
    TextNode.emitVisibleChange(false);
    makeSnapshot(component);
  });

  it('visible is true', () => {
    TextNode.emitVisibleChange(true);
    makeSnapshot(component);
  });
});

describe('children', () => {
  it('this.props.children is array', () => {
    const component = renderer.create(
      <Div _leaf={DivNode}>
        <Text _leaf={TextNode} content="content"></Text>
        <Text _leaf={TextNode} content="content"></Text>
      </Div>
    );

    makeSnapshot(component);
  });
});

describe('onChildrenChange', () => {
  it('children is array string', () => {
    DivNode.schema.children = [
      'onChildrenChange content 01',
      'onChildrenChange content 02'
    ]
    DivNode.emitChildrenChange();
    makeSnapshot(component);
  });

  it('children is 0', () => {
    DivNode.schema.children = 0
    DivNode.emitChildrenChange();
    const componentInstance = component.root;
    expect(componentInstance.findByType(components.Div).props.children).toEqual(0);
  });

  it('children is false', () => {
    DivNode.schema.children = false
    DivNode.emitChildrenChange();
    const componentInstance = component.root;
    expect(componentInstance.findByType(components.Div).props.children).toEqual(false);
  });

  it('children is []', () => {
    DivNode.schema.children = []
    DivNode.emitChildrenChange();
    const componentInstance = component.root;
    expect(componentInstance.findByType(components.Div).props.children).toEqual([]);
  });

  it('children is null', () => {
    DivNode.schema.children = null
    DivNode.emitChildrenChange();
    const componentInstance = component.root;
    expect(componentInstance.findByType(components.Div).props.children).toEqual(null);
  });

  it('children is undefined', () => {
    DivNode.schema.children = undefined;
    DivNode.emitChildrenChange();
    const componentInstance = component.root;
    expect(componentInstance.findByType(components.Div).props.children).toEqual(undefined);
  });
});

describe('not render leaf', () => {
  let miniRenderSchema, MiniRenderDiv, MiniRenderDivNode;
  beforeEach(() => {
    miniRenderSchema = {
      id: 'miniDiv' + id,
    };

    MiniRenderDivNode = new Node(miniRenderSchema, {
      componentMeta: {
        isMinimalRenderUnit: true,
      },
    });

    nodeMap.set(miniRenderSchema.id, MiniRenderDivNode);

    MiniRenderDiv = leafWrapper(components.MiniRenderDiv as any, {
      schema: miniRenderSchema,
      baseRenderer,
      componentInfo: {},
      scope: {},
    });

    TextNode = new Node(textSchema, {
      parent: MiniRenderDivNode,
    });

    component = renderer.create(
      <Text _leaf={TextNode} content="content"></Text>
    );
  });

  it('onPropsChange', () => {
    const nextCount = rerenderCount + 1;

    MiniRenderDivNode.emitPropChange({
      key: 'any',
      newValue: 'any',
    });

    expect(rerenderCount).toBe(nextCount);
  });

  it('onChildrenChange', () => {
    const nextCount = rerenderCount + 1;

    MiniRenderDivNode.emitChildrenChange({
      key: 'any',
      newValue: 'any',
    });

    expect(rerenderCount).toBe(nextCount);
  });

  it('onVisibleChange', () => {
    const nextCount = rerenderCount + 1;

    MiniRenderDivNode.emitVisibleChange(true);

    expect(rerenderCount).toBe(nextCount);
  });
});
