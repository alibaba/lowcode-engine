import { globalContext } from '@alilc/lowcode-editor-core';
import { ReactElement } from 'react';

const TREE_TITLE_EXTRA_KEY = 'TREE_TITLE_EXTRA_KEY';

export const registerTreeTitleExtra = (extra: ReactElement) => {
  if (extra && !globalContext.has(TREE_TITLE_EXTRA_KEY)) {
    globalContext.register(extra, TREE_TITLE_EXTRA_KEY);
  }
};

export const getTreeTitleExtra = () => {
  try {
    return globalContext.get(TREE_TITLE_EXTRA_KEY);
  } catch (e) {
    // console.error('getTreeTitleExtra Error', e);
  }

  return null;
};
