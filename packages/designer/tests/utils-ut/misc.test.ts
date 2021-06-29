// @ts-nocheck
import { isElementNode, isDOMNodeVisible } from '../../src/utils/misc';

it('isElementNode', () => {
  expect(isElementNode(document.createElement('div'))).toBeTruthy();
  expect(isElementNode(1)).toBeFalsy();
});

/**
 * const domNodeRect = domNode.getBoundingClientRect();
  const { width, height } = viewport.contentBounds;
  const { left, right, top, bottom, width: nodeWidth, height: nodeHeight } = domNodeRect;
  return (
    left >= -nodeWidth &&
    top >= -nodeHeight &&
    bottom <= height + nodeHeight &&
    right <= width + nodeWidth
  );
 */

const genMockNode = ({ left, right, top, bottom, width, height }) => {
  return { getBoundingClientRect: () => {
    if (width === undefined || height === undefined) throw new Error('width and height is required.');
    const base = { width, height };
    let coordinate = {};
    if (left !== undefined) {
      coordinate = top !== undefined ? {
        left,
        right: left + width,
        top,
        bottom: top + height,
      } : {
        left,
        right: left + width,
        bottom,
        top: bottom - height,
      }
    } else if (right !== undefined) {
      coordinate = top !== undefined ? {
        left: right - width,
        right,
        top,
        bottom: top + height,
      } : {
        left: right - width,
        right,
        bottom,
        top: bottom - height,
      }
    }
    return { ...base, ...coordinate };
  } };
};
const mockViewport = {
  contentBounds: {
    width: 300,
    height: 300,
  },
};
describe('isDOMNodeVisible', () => {
  it('isDOMNodeVisible', () => {
    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: 0,
          top: 0,
        }),
        mockViewport,
      ),
    ).toBeTruthy();

    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: -100,
          top: 0,
        }),
        mockViewport,
      ),
    ).toBeTruthy();

    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: 50,
          top: 50,
        }),
        mockViewport,
      ),
    ).toBeTruthy();

    // 左侧出界了
    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: -101,
          top: 0,
        }),
        mockViewport,
      ),
    ).toBeFalsy();

    // 右侧出界了
    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          right: 401,
          top: 0,
        }),
        mockViewport,
      ),
    ).toBeFalsy();

    // 上侧出界了
    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: 50,
          top: -101,
        }),
        mockViewport,
      ),
    ).toBeFalsy();

    // 下侧出界了
    expect(
      isDOMNodeVisible(
        genMockNode({
          width: 100,
          height: 100,
          left: 50,
          bottom: 401,
        }),
        mockViewport,
      ),
    ).toBeFalsy();
  });
});
