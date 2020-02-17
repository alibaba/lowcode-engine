import { ReactElement, createElement, ReactType } from 'react';
import classNames from 'classnames';

const mocksCache = new Map<string, (props: any) => ReactElement>();
// endpoint element: input,select,video,audio,canvas,textarea
//
function getBlockElement(tag: string): (props: any) => ReactElement {
  if (mocksCache.has(tag)) {
    return mocksCache.get(tag)!;
  }
  const mock = ({ className, children, ...rest }: any = {}) => {
    const props = {
      ...rest,
      className: classNames('my-intrinsic-container', className),
    };
    return createElement(tag, props, children);
  };

  mock.prototypeConfig = {
    uri: `@html:${tag}`,
    selfControlled: true,
    ...(prototypeMap as any)[tag],
  };

  mocksCache.set(tag, mock);
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
  'span',
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HTMLInlineBlock = ['a', 'b', 'span', 'em'];
export function getIntrinsicMock(tag: string): ReactType {
  if (HTMLBlock.indexOf(tag) > -1) {
    return getBlockElement(tag);
  }

  return tag as any;
}

const prototypeMap = {
  div: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: 'p',
    },
  },
  ul: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      childWhitelist: 'li',
    },
  },
  p: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: 'button,p',
    },
  },
  li: {
    isContainer: true,
    selfControlled: true,
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
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!a',
    },
  },
  b: {
    isContainer: true,
    selfControlled: true,
  },
  strong: {
    isContainer: true,
    selfControlled: true,
  },
  em: {
    isContainer: true,
    selfControlled: true,
  },
  i: {
    isContainer: true,
    selfControlled: true,
  },
  form: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!form,!button',
    },
  },
  table: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  caption: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  select: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  button: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  input: {
    isContainer: false,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button,!h1,!h2,!h3,!h4,!h5',
    },
  },
  textarea: {
    isContainer: false,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  image: {
    isContainer: false,
    selfControlled: true,
  },
  canvas: {
    isContainer: false,
    selfControlled: true,
  },
  br: {
    isContainer: false,
    selfControlled: true,
  },
  h1: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  h2: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  h3: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  h4: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  h5: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  h6: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  article: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  aside: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  footer: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  header: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  blockquote: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  address: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  section: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!p,!h1,!h2,!h3,!h4,!h5,!h6,!button',
    },
  },
  summary: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
  nav: {
    isContainer: true,
    selfControlled: true,
    nesting: {
      ancestorBlacklist: '!button',
    },
  },
};
