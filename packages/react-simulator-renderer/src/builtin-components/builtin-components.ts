import { ReactElement, createElement, ReactType } from 'react';
import classNames from 'classnames';

const supportedEvents = [
  // MouseEvents
  {
    name: 'onClick',
    description: '点击时',
  },
  {
    name: 'onDoubleClick',
    description: '双击时',
  },
  {
    name: 'onMouseDown',
    description: '鼠标按下',
  },
  {
    name: 'onMouseEnter',
    description: '鼠标进入',
  },
  {
    name: 'onMouseMove',
    description: '鼠标移动',
  },
  {
    name: 'onMouseOut',
    description: '鼠标移出',
  },
  {
    name: 'onMouseOver',
    description: '鼠标悬停',
  },
  {
    name: 'onMouseUp',
    description: '鼠标松开',
  },
  // Focus Events
  {
    name: 'onFocus',
    description: '获得焦点',
    snippet: '',
  },
  {
    name: 'onBlur',
    description: '失去焦点',
    snippet: '',
  },
  // Form Events
  {
    name: 'onChange',
    description: '值改变时',
    snippet: '',
  },
  {
    name: 'onSelect',
    description: '选择',
  },
  {
    name: 'onInput',
    description: '输入',
    snippet: '',
  },
  {
    name: 'onReset',
    description: '重置',
    snippet: '',
  },
  {
    name: 'onSubmit',
    description: '提交',
    snippet: '',
  },
  // Clipboard Events
  {
    name: 'onCopy',
    description: '复制',
    snippet: '',
  },
  {
    name: 'onCut',
    description: '剪切',
    snippet: '',
  },
  {
    name: 'onPaste',
    description: '粘贴',
    snippet: '',
  },

  // Keyboard Events
  {
    name: 'onKeyDown',
    description: '键盘按下',
    snippet: '',
  },
  {
    name: 'onKeyPress',
    description: '键盘按下并释放',
    snippet: '',
  },
  {
    name: 'onKeyUp',
    description: '键盘松开',
    snippet: '',
  },
  // Touch Events
  {
    name: 'onTouchCancel',
    description: '触摸退出',
    snippet: '',
  },
  {
    name: 'onTouchEnd',
    description: '触摸结束',
    snippet: '',
  },
  {
    name: 'onTouchMove',
    description: '触摸移动',
    snippet: '',
  },
  {
    name: 'onTouchStart',
    description: '触摸开始',
    snippet: '',
  },
  // UI Events
  {
    name: 'onScroll',
    description: '滚动',
    snippet: '',
  },
  {
    name: 'onLoad',
    description: '加载完毕',
    snippet: '',
  },
  {
    name: 'onWheel',
    description: '滚轮事件',
    snippet: '',
  },
  // Animation Events
  {
    name: 'onAnimationStart',
    description: '动画开始',
  },
  {
    name: 'onAnimationEnd',
    description: '动画结束',
  },
];

// eslint-disable-next-line func-call-spacing
const builtinComponents = new Map<string, (props: any) => ReactElement>();
function getBlockElement(tag: string): (props: any) => ReactElement {
  if (builtinComponents.has(tag)) {
    return builtinComponents.get(tag)!;
  }
  const mock = ({ className, children, ...rest }: any = {}) => {
    const props = {
      ...rest,
      className: classNames('lc-block-container', className),
    };
    return createElement(tag, props, children);
  };

  mock.metadata = {
    componentName: tag,
    // selfControlled: true,
    configure: {
      props: [],
      events: {
        supportedEvents,
      },
      styles: {
        supportClassName: true,
        supportInlineStyle: true,
      },
      component: {
        ...metasMap[tag],
      },
    },
  };

  builtinComponents.set(tag, mock);
  return mock;
}

const HTMLBlock = [
  'div',
  'p',
  'article',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'aside',
  'blockquote',
  'footer',
  'form',
  'header',
  'table',
  'tbody',
  'section',
  'ul',
  'li',
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HTMLInlineBlock = ['a', 'b', 'span', 'em'];
export function getIntrinsicMock(tag: string): ReactType {
  if (HTMLBlock.indexOf(tag) > -1) {
    return getBlockElement(tag);
  }

  return tag as any;
}

const metasMap: any = {
  div: {
    isContainer: true,
    nesting: {
      ancestorBlacklist: 'p',
    },
  },
  ul: {
    isContainer: true,
    nesting: {
      childWhitelist: 'li',
    },
  },
  p: {
    isContainer: true,
    nesting: {
      ancestorBlacklist: 'button,p',
    },
  },
  li: {
    isContainer: true,
    nesting: {
      parentWhitelist: 'ui,ol',
    },
  },
  span: {
    isContainer: true,
    selfControlled: true,
  },
  a: {
    isContainer: true,
    nesting: {
      ancestorBlacklist: 'a',
    },
  },
  b: {
    isContainer: true,
  },
  strong: {
    isContainer: true,
  },
  em: {
    isContainer: true,
  },
  i: {
    isContainer: true,
  },
  form: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'form,button',
    },
  },
  table: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  caption: {
    isContainer: true,
    selfControlled: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  select: {
    isContainer: true,
    selfControlled: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  button: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  input: {
    isContainer: false,
    nestingRule: {
      ancestorBlacklist: 'button,h1,h2,h3,h4,h5,h6',
    },
  },
  textarea: {
    isContainer: false,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  image: {
    isContainer: false,
  },
  canvas: {
    isContainer: false,
  },
  br: {
    isContainer: false,
  },
  h1: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  h2: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  h3: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  h4: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  h5: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  h6: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  article: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  aside: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  footer: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  header: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  blockquote: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  address: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  section: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'p,h1,h2,h3,h4,h5,h6,button',
    },
  },
  summary: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
  nav: {
    isContainer: true,
    nestingRule: {
      ancestorBlacklist: 'button',
    },
  },
};
