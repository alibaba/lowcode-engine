
import { buildComponents } from "../../../src/build-components";

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
})

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