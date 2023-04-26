import React from 'react';
import renderer from 'react-test-renderer';
import schema from '../fixtures/schema/basic';
import '../utils/react-env-init';
import rendererFactory from '../../src/renderer/renderer';
import components from '../utils/components';

const Renderer = rendererFactory();

function getComp(schema, comp = null, others = {}): Promise<{
  component,
  inst,
}> {
  return new Promise((resolve, reject) => {
    const component = renderer.create(
      <Renderer
        schema={schema}
        components={components as any}
        {...others}
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
      <Renderer
        schema={schema as any}
        components={components as any}
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

    getComp(schema, components.Div, {
      thisRequiredInJSE: false,
    }).then(({ component, inst }) => {
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

  it('JSExpression props with loop, and thisRequiredInJSE is true', (done) => {
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
      expect(inst.length).toEqual(2);
      [0, 1].forEach((i) => {
        expect(inst[i].props[`name1`]).toBe(i + 1 + '');
        expect(inst[i].props[`name2`]).toBe(undefined);
      })
      componentSnapshot = component;
      done();
    });
  });

  // it('JSFunction props with loop', (done) => {
  //   const schema = {
  //     componentName: 'Page',
  //     props: {},
  //     state: {
  //       isShowDialog: true,
  //     },
  //     children: [
  //       {
  //         componentName: "Div",
  //         loop: [
  //           {
  //             name: '1',
  //           },
  //           {
  //             name: '2'
  //           }
  //         ],
  //         props: {
  //           className: "div-ut",
  //           onClick1: {
  //             type: 'JSFunction',
  //             value: '() => this.item.name',
  //           },
  //           onClick2: {
  //             type: 'JSFunction',
  //             value: 'function(){ return this.item.name }',
  //           },
  //           onClick3: {
  //             type: 'JSFunction',
  //             value: 'function(){ return item.name }',
  //           },
  //           onClick4: {
  //             type: 'JSFunction',
  //             value: '() => item.name',
  //           }
  //         }
  //       }
  //     ]
  //   };

  //   getComp(schema, components.Div).then(({ component, inst }) => {
  //     // expect(inst[0].props.visible).toBeTruthy();
  //     expect(inst.length).toEqual(2);
  //     [1, 2, 3, 4].forEach((i) => {
  //       expect(inst[0].props[`onClick${i}`]()).toBe('1');
  //       expect(inst[1].props[`onClick${i}`]()).toBe('2');
  //     })
  //     componentSnapshot = component;
  //     done();
  //   });
  // });

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
              type: 'JSFunction',
              value: 'function() {return this.state.isShowDialog}',
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
    });
  });

  it('JSSlot has loop', (done) => {
    const schema = {
      componentName: "Page",
      props: {},
      children: [
        {
          componentName: "SlotComponent",
          id: "node_k8bnubvz",
          props: {
            mobileSlot: {
              type: "JSSlot",
              title: "mobile容器",
              name: "mobileSlot",
              value: [
                {
                  condition: true,
                  hidden: false,
                  children: [
                    {
                      condition: true,
                      hidden: false,
                      loopArgs: [
                        "item",
                        "index"
                        ],
                        isLocked: false,
                        conditionGroup: "",
                        componentName: "Text",
                        id: "node_ocl1ao1o7w4",
                        title: "",
                        props: {
                          maxLine: 0,
                          showTitle: false,
                          className: "text_l1ao7pfb",
                          behavior: "NORMAL",
                          content: "这是一个低代码业务组件~",
                          __style__: ":root {\n font-size: 14px;\n color: #666;\n}",
                          fieldId: "text_l1ao7lvp"
                        }
                    }
                  ],
                  loop: {
                    type: "JSExpression",
                    value: "this.state.content"
                  },
                  loopArgs: [
                      "item",
                      "index"
                  ],
                  isLocked: false,
                  conditionGroup: "",
                  componentName: "Div",
                  id: "node_ocl1ao1o7w3",
                  title: "",
                  props: {
                    useFieldIdAsDomId: false,
                    customClassName: "",
                    className: "div_l1ao7pfc",
                    behavior: "NORMAL",
                    __style__: ":root {\n padding: 12px;\n background: #f2f2f2;\n border: 1px solid #ddd;\n}",
                    fieldId: "div_l1ao7lvq"
                  }
                }
              ]
            },
          },
        }
      ],
      state: {
        content: {
          type: "JSExpression",
          value: "[{}, {}, {}]",
        },
      },
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      expect(inst.length).toBe(3);
      componentSnapshot = component;
      done();
    });
  })
});

describe("designMode", () => {
  it('designMode:default', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      children: [
        {
          componentName: "Div",
          props: {
            className: 'div-ut',
            children: [
              {
                componentName: "Div",
                visible: true,
                props: {
                  className: 'div-ut-children',
                }
              }
            ]
          }
        }
      ]
    };

    getComp(schema, components.Div).then(({ component, inst }) => {
      expect(inst.length).toBe(2);
      expect(inst[0].props.className).toBe('div-ut');
      expect(inst[1].props.className).toBe('div-ut-children');
      componentSnapshot = component;
      done();
    });
  });
  it('designMode:design', (done) => {
    const schema = {
      componentName: 'Page',
      props: {},
      children: [
        {
          componentName: "Div",
          id: '0',
          props: {
            className: 'div-ut',
            children: [
              {
                componentName: "Div",
                id: 'hiddenId',
                hidden: true,
                props: {
                  className: 'div-ut-children',
                }
              }
            ]
          }
        }
      ]
    };

    getComp(schema, components.Div, {
      designMode: 'design',
      getNode: (id) => {
        if (id === 'hiddenId') {
          return {
            export() {
              return {
                hidden: true,
              };
            }
          }
        }
      }
    }).then(({ component, inst }) => {
      expect(inst.length).toBe(1);
      expect(inst[0].props.className).toBe('div-ut');
      done();
    });
  });
})