import React from 'react';
import {
  accessLibrary,
  generateHtmlComp,
  getSubComponent,
  buildComponents,
  getProjectUtils,
} from "../../../src/build-components";

function Button() {};

function WrapButton() {};

function ButtonGroup() {};

function WrapButtonGroup() {};

ButtonGroup.Button = Button;

Button.displayName = "Button";
ButtonGroup.displayName = "ButtonGroup";
ButtonGroup.prototype.isReactComponent = true;
Button.prototype.isReactComponent = true;

jest.mock('../../../src/is-react', () => {
  const original = jest.requireActual('../../../src/is-react');
  return {
    ...original,
    wrapReactClass(view) {
      return view;
    }
  }
});

describe('accessLibrary', () => {
  it('should return a library object when given a library object', () => {
    const libraryObject = { key: 'value' };
    const result = accessLibrary(libraryObject);
    expect(result).toEqual(libraryObject);
  });

  it('should generate an HTML component when given a string library name', () => {
    const libraryName = 'div';
    const result = accessLibrary(libraryName);

    // You can write more specific assertions to validate the generated component
    expect(result).toBeDefined();
  });

  // Add more test cases to cover other scenarios
});

describe('generateHtmlComp', () => {
  it('should generate an HTML component for valid HTML tags', () => {
    const htmlTags = ['a', 'img', 'div', 'span', 'svg'];
    htmlTags.forEach((tag) => {
      const result = generateHtmlComp(tag);

      // You can write more specific assertions to validate the generated component
      expect(result).toBeDefined();
    });
  });

  it('should return undefined for an invalid HTML tag', () => {
    const invalidTag = 'invalidtag';
    const result = generateHtmlComp(invalidTag);
    expect(result).toBeUndefined();
  });

  // Add more test cases to cover other scenarios
});

describe('getSubComponent', () => {
  it('should return the root library if paths are empty', () => {
    const library = { component: 'RootComponent' };
    const paths = [];
    const result = getSubComponent(library, paths);
    expect(result).toEqual(library);
  });

  it('should return the specified sub-component', () => {
    const library = {
      components: {
        Button: 'ButtonComponent',
        Text: 'TextComponent',
      },
    };
    const paths = ['components', 'Button'];
    const result = getSubComponent(library, paths);
    expect(result).toEqual('ButtonComponent');
  });

  it('should handle missing keys in the path', () => {
    const library = {
      components: {
        Button: 'ButtonComponent',
      },
    };
    const paths = ['components', 'Text'];
    const result = getSubComponent(library, paths);
    expect(result).toEqual({
      Button: 'ButtonComponent',
    });
  });

  it('should handle exceptions and return null', () => {
    const library = 'ButtonComponent';
    const paths = ['components', 'Button'];
    // Simulate an exception by providing a non-object in place of 'ButtonComponent'
    const result = getSubComponent(library, paths);
    expect(result).toBeNull();
  });

  it('should handle the "default" key as the first path element', () => {
    const library = {
      default: 'DefaultComponent',
    };
    const paths = ['default'];
    const result = getSubComponent(library, paths);
    expect(result).toEqual('DefaultComponent');
  });
});

describe('getProjectUtils', () => {
  it('should return an empty object when given empty metadata and library map', () => {
    const libraryMap = {};
    const utilsMetadata = [];
    const result = getProjectUtils(libraryMap, utilsMetadata);
    expect(result).toEqual({});
  });

  it('should return project utilities based on metadata and library map', () => {
    const libraryMap = {
      'package1': 'library1',
      'package2': 'library2',
    };

    const utilsMetadata = [
      {
        name: 'util1',
        npm: {
          package: 'package1',
        },
      },
      {
        name: 'util2',
        npm: {
          package: 'package2',
        },
      },
    ];

    global['library1'] = { name: 'library1' };
    global['library2'] = { name: 'library2' };

    const result = getProjectUtils(libraryMap, utilsMetadata);

    // Define the expected output based on the mocked accessLibrary
    const expectedOutput = {
      'util1': { name: 'library1' },
      'util2': { name: 'library2' },
    };

    expect(result).toEqual(expectedOutput);

    global['library1'] = null;
    global['library1'] = null;
  });

  it('should handle metadata with destructuring', () => {
    const libraryMap = {
      'package1': { destructuring: true, util1: 'library1', util2: 'library2' },
    };

    const utilsMetadata = [
      {
        name: 'util1',
        npm: {
          package: 'package1',
          destructuring: true,
        },
      },
    ];

    const result = getProjectUtils(libraryMap, utilsMetadata);

    // Define the expected output based on the mocked accessLibrary
    const expectedOutput = {
      'util1': 'library1',
      'util2': 'library2',
    };

    expect(result).toEqual(expectedOutput);
  });
});

describe('buildComponents', () => {
  it('should create components from component map with React components', () => {
    const libraryMap = {};
    const componentsMap = {
      Button: () => <button>Button</button>,
      Text: () => <p>Text</p>,
    };

    const createComponent = (schema) => {
      // Mock createComponent function
      return schema.componentsTree.map((component) => component.component);
    };

    const result = buildComponents(libraryMap, componentsMap, createComponent);

    expect(result.Button).toBeDefined();
    expect(result.Text).toBeDefined();
  });

  it('should create components from component map with component schemas', () => {
    const libraryMap = {};
    const componentsMap = {
      Button: {
        componentsTree: [
          {
            componentName: 'Component'
          }
        ]
      },
      Text: {
        componentsTree: [
          {
            componentName: 'Component'
          }
        ]
      },
    };

    const createComponent = (schema) => {
      // Mock createComponent function
      return schema.componentsTree.map((component) => component.component);
    };

    const result = buildComponents(libraryMap, componentsMap, createComponent);

    expect(result.Button).toBeDefined();
    expect(result.Text).toBeDefined();
  });

  it('should create components from component map with React components and schemas', () => {
    const libraryMap = {};
    const componentsMap = {
      Button: () => <button>Button</button>,
      Text: {
        type: 'ComponentSchema',
        // Add component schema properties here
      },
    };

    const createComponent = (schema) => {
      // Mock createComponent function
      return schema.componentsTree.map((component) => component.component);
    };

    const result = buildComponents(libraryMap, componentsMap, createComponent);

    expect(result.Button).toBeDefined();
    expect(result.Text).toBeDefined();
  });

  it('should create components from component map with library mappings', () => {
    const libraryMap = {
      'libraryName1': 'library1',
      'libraryName2': 'library2',
    };
    const componentsMap = {
      Button: {
        package: 'libraryName1',
        version: '1.0',
        exportName: 'ButtonComponent',
      },
      Text: {
        package: 'libraryName2',
        version: '2.0',
        exportName: 'TextComponent',
      },
    };

    const createComponent = (schema) => {
      // Mock createComponent function
      return schema.componentsTree.map((component) => component.component);
    };

    global['library1'] = () => <button>ButtonComponent</button>;
    global['library2'] = () => () => <p>TextComponent</p>;

    const result = buildComponents(libraryMap, componentsMap, createComponent);

    expect(result.Button).toBeDefined();
    expect(result.Text).toBeDefined();

    global['library1'] = null;
    global['library2'] = null;
  });
});

describe('build-component', () => {
  it('basic button', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': {
            Button,
          }
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'Button',
            subName: 'Button',
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
    });
  });

  it('component is a  __esModule', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': {
            __esModule: true,
            default: Button,
          }
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
    });
  })

  it('basic warp button', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': {
            WrapButton,
          }
        },
        {
          WrapButton: {
            componentName: 'WrapButton',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'WrapButton',
            subName: 'WrapButton',
          }
        },
        () => {},
      ))
    .toEqual({
      WrapButton,
    });
  });

  it('destructuring is false button', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': Button
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
            destructuring: false,
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
    });
  });

  it('Button and ButtonGroup', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': {
            Button,
            ButtonGroup,
          }
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'Button',
            subName: 'Button',
          },
          ButtonGroup: {
            componentName: 'ButtonGroup',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'ButtonGroup',
            subName: 'ButtonGroup',
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
      ButtonGroup,
    });
  });

  it('ButtonGroup and ButtonGroup.Button', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': {
            ButtonGroup,
          }
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'ButtonGroup',
            subName: 'ButtonGroup.Button',
          },
          ButtonGroup: {
            componentName: 'ButtonGroup',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'ButtonGroup',
            subName: 'ButtonGroup',
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
      ButtonGroup,
    });
  });

  it('ButtonGroup.default and ButtonGroup.Button', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': ButtonGroup,
        },
        {
          Button: {
            componentName: 'Button',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'Button',
            subName: 'Button',
          },
          ButtonGroup: {
            componentName: 'ButtonGroup',
            package: '@alilc/button',
            destructuring: true,
            exportName: 'default',
            subName: 'default',
          }
        },
        () => {},
      ))
    .toEqual({
      Button,
      ButtonGroup,
    });
  });

  it('no npm component', () => {
    expect(
      buildComponents(
        {
          '@alilc/button': Button,
        },
        {
          Button: null,
        },
        () => {},
      ))
    .toEqual({});
  });

  it('no npm component and global button', () => {
    window.Button = Button;
    expect(
      buildComponents(
        {},
        {
          Button: null,
        },
        () => {},
      ))
    .toEqual({
      Button,
    });
    window.Button = null;
  });

  it('componentsMap value is component funtion', () => {
    expect(
      buildComponents(
        {},
        {
          Button,
        },
        () => {},
      ))
    .toEqual({
      Button,
    });
  });


  it('componentsMap value is component', () => {
    expect(
      buildComponents(
        {},
        {
          Button: WrapButton,
        },
        () => {},
      ))
    .toEqual({
      Button: WrapButton,
    });
  });

  it('componentsMap value is mix component', () => {
    expect(
      buildComponents(
        {},
        {
          Button: {
            WrapButton,
            Button,
            ButtonGroup,
          },
        },
        () => {},
      ))
    .toEqual({
      Button: {
        WrapButton,
        Button,
        ButtonGroup,
      },
    });
  });

  it('componentsMap value is Lowcode Component', () => {
    expect(
      buildComponents(
        {},
        {
          Button: {
            componentName: 'Component',
            schema: {},
          },
        },
        (component) => {
          return component as any;
        },
      ))
    .toEqual({
      Button: {
        componentsMap: [],
        componentsTree: [
          {
            componentName: 'Component',
            schema: {},
          }
        ],
        version: "",
      },
    });
  })
});

describe('build div component', () => {
  it('build div component', () => {
    const components = buildComponents(
      {
        '@alilc/div': 'div'
      },
      {
        div: {
          componentName: 'div',
          package: '@alilc/div'
        }
      },
      () => {},
    );

    expect(components['div']).not.toBeNull();
  })
})