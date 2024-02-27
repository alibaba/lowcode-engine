import React, { useState } from 'react';
import { Button } from '@storybook/react/demo';
import SplitPane, { Pane } from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Basic',
};

export const BasicVertical = () => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        100,
        200,
        'auto',
    ]);

    const layoutCSS = {
	    height: '100%',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	};

    return (
        <div style={{ height: 500 }}>
            <p>Split used to drag and drop to modify panel size</p>
            <SplitPane
                sizes={sizes}
                onChange={(sizes) => setSizes(sizes)}
            >
                <div style={{ ...layoutCSS, background: '#ddd' }}>
                    pane1
                </div>
                <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                    pane2
                </div>
                <div style={{ ...layoutCSS, background: '#a1a5a9' }}>
                    pane2
                </div>
            </SplitPane>
        </div>
    );
};
