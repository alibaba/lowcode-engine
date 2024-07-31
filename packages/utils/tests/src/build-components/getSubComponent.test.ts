import { getSubComponent } from '../../../src/build-components';

function Button() {}

function ButtonGroup() {}

ButtonGroup.Button = Button;

function OnlyButtonGroup() {}

describe('getSubComponent library is object', () => {
  it('get Button from Button', () => {
    expect(getSubComponent({
      Button,
    }, ['Button'])).toBe(Button);
  });

  it('get ButtonGroup.Button from ButtonGroup', () => {
    expect(getSubComponent({
      ButtonGroup,
    }, ['ButtonGroup', 'Button'])).toBe(Button);
  });

  it('get ButtonGroup from ButtonGroup', () => {
    expect(getSubComponent({
      ButtonGroup,
    }, ['ButtonGroup'])).toBe(ButtonGroup);
  });

  it('get ButtonGroup.Button from OnlyButtonGroup', () => {
    expect(getSubComponent({
      ButtonGroup: OnlyButtonGroup,
    }, ['ButtonGroup', 'Button'])).toBe(OnlyButtonGroup);
  });
});

describe('getSubComponent library is null', () => {
  it('getSubComponent library is null', () => {
    expect(getSubComponent(null, ['ButtonGroup', 'Button'])).toBeNull();
  });
})

describe('getSubComponent paths is []', () => {
  it('getSubComponent paths is []', () => {
    expect(getSubComponent(Button, [])).toBe(Button);
  });
});

describe('getSubComponent make error', () => {
  it('library is string', () => {
    expect(getSubComponent(true, ['Button'])).toBe(null);
  });

  it('library is boolean', () => {
    expect(getSubComponent('I am a string', ['Button'])).toBe(null);
  });

  it('library is number', () => {
    expect(getSubComponent(123, ['Button'])).toBe(null);
  });

  it('library ButtonGroup is null', () => {
    expect(getSubComponent({
      ButtonGroup: null,
    }, ['ButtonGroup', 'Button'])).toBe(null);
  });

  it('library ButtonGroup.Button is null', () => {
    expect(getSubComponent({
      ButtonGroup: null,
    }, ['ButtonGroup', 'Button', 'SubButton'])).toBe(null);
  });

  it('path  s is [[]]', () => {
    expect(getSubComponent({
      ButtonGroup: null,
    }, [['ButtonGroup'] as any, 'Button'])).toBe(null);
  });

  it('ButtonGroup is undefined', () => {
    expect(getSubComponent({
      ButtonGroup: undefined,
    }, ['ButtonGroup', 'Button'])).toBe(null);
  });
})