import React from 'react';
import renderer from 'react-test-renderer';
import schema from '../fixtures/schema/basic';
import '../utils/mock-react-render';
import rendererFactory from '../../src/renderer/renderer';
import components from '../utils/components';

const Renderer = rendererFactory();

function getComp(schema, comp = null): Promise<{
  component,
  inst,
}> {
  return new Promise((resolve, reject) => {
    const component = renderer.create(
      // @ts-ignore
      <Renderer
        schema={schema}
        components={components}
      />);

    const componentInstance = component.root;

    setTimeout(() => {
      resolve({
        inst: comp ? componentInstance.findAllByType(comp) : null,
        component,
      });
    }, 20);
  })
}

beforeEach(() => {

});

let componentSnapshot;

afterEach(() => {
  if (componentSnapshot) {
    let tree = componentSnapshot.toJSON();
    expect(tree).toMatchSnapshot();
    componentSnapshot = null;
  }
});

describe('Base Render', () => {
  it('renderComp', () => {
    const content = (
      // @ts-ignore
      <Renderer
        schema={schema}
        components={components}
      />);
    const tree = renderer.create(content).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('JSExpression', () => {
  it('base props', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      children: [
        {
          componentName: "Div",
          props: {
            className: 'div-ut',
            text: "123",
            visible: true,
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      expect(inst[0].props.text).toBe('123');
      expect(inst[0].props.visible).toBeTruthy();

      componentSnapshot = component;
      done();
    });
  });

  it('JSExpression props', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      state: {
        isShowDialog: true,
      },
      children: [
        {
          componentName: "Div",
          props: {
            className: "div-ut",
            visible: {
              type: 'JSExpression',
              value: 'this.state.isShowDialog',
            },
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      expect(inst[0].props.visible).toBeTruthy();
      componentSnapshot = component;
      done();
    });
  });

  it('JSExpression props with loop', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      state: {
        isShowDialog: true,
      },
      children: [
        {
          componentName: "Div",
          loop: [
            {
              name: '1',
            },
            {
              name: '2'
            }
          ],
          props: {
            className: "div-ut",
            name1: {
              type: 'JSExpression',
              value: 'this.item.name',
            },
            name2: {
              type: 'JSExpression',
              value: 'item.name',
            },
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      // expect(inst[0].props.visible).toBeTruthy();
      expect(inst.length).toEqual(2);
      [1, 2].forEach((i) => {
        expect(inst[0].props[`name${i}`]).toBe('1');
        expect(inst[1].props[`name${i}`]).toBe('2');
      })
      componentSnapshot = component;
      done();
    });
  });

  it('JSFunction props with loop', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      state: {
        isShowDialog: true,
      },
      children: [
        {
          componentName: "Div",
          loop: [
            {
              name: '1',
            },
            {
              name: '2'
            }
          ],
          props: {
            className: "div-ut",
            onClick1: {
              type: 'JSFunction',
              value: '() => this.item.name',
            },
            onClick2: {
              type: 'JSFunction',
              value: 'function(){ return this.item.name }',
            },
            onClick3: {
              type: 'JSFunction',
              value: 'function(){ return item.name }',
            },
            onClick4: {
              type: 'JSFunction',
              value: '() => item.name',
            }
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      // expect(inst[0].props.visible).toBeTruthy();
      expect(inst.length).toEqual(2);
      [1, 2, 3, 4].forEach((i) => {
        expect(inst[0].props[`onClick${i}`]()).toBe('1');
        expect(inst[1].props[`onClick${i}`]()).toBe('2');
      })
      componentSnapshot = component;
      done();
    });
  });

  it('JSFunction props', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      state: {
        isShowDialog: true,
      },
      children: [
        {
          componentName: "Div",
          props: {
            className: "div-ut",
            onClick: {
              type: 'JSExpression',
              value: '() => this.state.isShowDialog',
            },
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      expect(!!inst[0].props.onClick).toBeTruthy();
      expect(inst[0].props.onClick()).toBeTruthy();

      componentSnapshot = component;
      done();
    });;
  });
})