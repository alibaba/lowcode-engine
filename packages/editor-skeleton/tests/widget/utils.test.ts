import { composeTitle } from '../../src/widget/utils';
import * as React from 'react';

const label = React.createElement('div');

describe('composeTitle 测试', () => {
  it('基础能力测试', () => {
    expect(composeTitle(undefined)).toEqual({
      label: undefined,
    });

    expect(composeTitle(undefined, undefined, 'tips', true, true)).toEqual({
      icon: undefined,
      label: 'tips',
    });

    expect(composeTitle(undefined, undefined, label, true, true)).toEqual({
      icon: undefined,
      label,
    });

    expect(composeTitle({
      icon: undefined,
      label,
    }, undefined, '')).toEqual({
      icon: undefined,
      label,
    });

    expect(composeTitle('settingsPane')).toEqual('settingsPane');

    expect(composeTitle(label, undefined, '物料面板', true, true)).toEqual({
      icon: undefined,
      label,
      tip: '物料面板',
    });

    expect(composeTitle(label, undefined, label, true, true)).toEqual({
      icon: undefined,
      label,
      tip: label,
    });

    expect(composeTitle({
      label: "物料面板",
      icon: undefined,
      tip: null,
    })).toEqual({
      label: "物料面板",
      icon: undefined,
      tip: null,
    })
  });
})