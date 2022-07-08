import {
  DropLocation,
  isLocationData,
  isLocationChildrenDetail,
  isRowContainer,
  isChildInline,
  getRectTarget,
  isVerticalContainer,
  isVertical,
  getWindow,
} from '../../src/designer/location';
import { getMockElement } from '../utils';

describe('DropLocation 测试', () => {
  it('constructor', () => {
    const mockTarget = { document };
    const mockDetail = {};
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };
    const loc = new DropLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(loc.getContainer()).toBe(mockTarget);
    expect(loc.document).toBe(document);
    expect(loc.target).toBe(mockTarget);
    expect(loc.detail).toBe(mockDetail);
    expect(loc.source).toBe(mockSource);
    expect(loc.event).toBe(mockEvent);

    const mockEvent2 = { type: 'LocateEvent', data: [] };
    const loc2 = loc.clone(mockEvent2);
    expect(loc2.target).toBe(mockTarget);
    expect(loc2.detail).toBe(mockDetail);
    expect(loc2.source).toBe(mockSource);
    expect(loc2.event).toBe(mockEvent2);
  });

  it('constructor, detail: undefined', () => {
    const mockTarget = { document };
    const mockDetail = undefined;
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };
    const loc = new DropLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(loc.getInsertion()).toBeNull();
  });

  it('constructor, detail.type: Children, detail.index <= 0', () => {
    const mockTarget = { document };
    const mockDetail = { type: 'Children', index: -1 };
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };
    const loc = new DropLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(loc.getInsertion()).toBeNull();
  });

  it('constructor, detail.type: Children, detail.index > 0', () => {
    const mockTarget = {
      document,
      children: {
        get(x) {
          return x;
        },
      },
    };
    const mockDetail = { type: 'Children', index: 1 };
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };
    const loc = new DropLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(loc.getInsertion()).toBe(0);
  });

  it('constructor, detail.type: Prop', () => {
    const mockTarget = {
      document,
      children: {
        get(x) {
          return x;
        },
      },
    };
    const mockDetail = { type: 'Prop', index: 1, near: { node: { x: 1 } } };
    const mockSource = {};
    const mockEvent = { type: 'LocateEvent', nodes: [] };
    const loc = new DropLocation({
      target: mockTarget,
      detail: mockDetail,
      source: mockSource,
      event: mockEvent,
    });

    expect(loc.getInsertion()).toEqual({ x: 1 });
  });
});

it('isLocationData', () => {
  expect(isLocationData({ target: {}, detail: {} })).toBeTruthy();
});

it('isLocationChildrenDetail', () => {
  expect(isLocationChildrenDetail({ type: 'Children' })).toBeTruthy();
});

it('isRowContainer', () => {
  expect(isRowContainer({ nodeType: Node.TEXT_NODE })).toBeTruthy();
  window.getComputedStyle = jest
    .fn(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'flex' : '';
        },
      };
    })
    .mockImplementationOnce(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'flex' : 'column';
        },
      };
    })
    .mockImplementationOnce(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'grid' : 'column';
        },
      };
    });
  expect(isRowContainer(getMockElement('div'))).toBeFalsy();
  expect(isRowContainer(getMockElement('div'))).toBeTruthy();
  expect(isRowContainer(getMockElement('div'))).toBeTruthy();
});

it('isChildInline', () => {
  window.getComputedStyle = jest
    .fn(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'inline' : 'float';
        },
      };
    });

  expect(isChildInline({ nodeType: Node.TEXT_NODE })).toBeTruthy();
  expect(isChildInline(getMockElement('div'))).toBeTruthy();
});

it('getRectTarget', () => {
  expect(getRectTarget()).toBeNull();
  expect(getRectTarget({ computed: false })).toBeNull();
  expect(getRectTarget({ elements: [{}] })).toEqual({});
});

it('isVerticalContainer', () => {
  window.getComputedStyle = jest
    .fn(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'flex' : 'row';
        },
      };
    });
  expect(isVerticalContainer()).toBeFalsy();
  expect(isVerticalContainer({ elements: [getMockElement('div')] })).toBeTruthy();
});

it('isVertical', () => {
  expect(isVertical({ elements: [] })).toBeFalsy();
  expect(isVertical({ elements: [getMockElement('div')] })).toBeFalsy();
  const e1 = getMockElement('div');
  const e2 = getMockElement('div');
  e2.appendChild(e1);
  expect(isVertical({ elements: [e1] })).toBeTruthy();
  window.getComputedStyle = jest
    .fn(() => {
      return {
        getPropertyValue: (pName) => {
          return pName === 'display' ? 'inline' : 'float';
        },
      };
    });
  expect(isVertical({ elements: [getMockElement('div')] })).toBeTruthy();
});

it('getWindow', () => {
  const mockElem = getMockElement('div');
  expect(getWindow(mockElem)).toBe(window);
  expect(getWindow(document)).toBe(window);
});
