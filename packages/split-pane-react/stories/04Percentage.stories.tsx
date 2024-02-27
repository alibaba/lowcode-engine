import React, { useState } from 'react';
import { Button } from '@storybook/react/demo';
import SplitPane, { Pane } from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Basic',
};

export const PercentageSize = () => {
    const [sizes, setSizes] = useState<(number | string)[]>([
        '20%',
        '30%',
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
            <p>Size value support percentage</p>
            <SplitPane
                sizes={sizes}
                onChange={(sizes) => setSizes(sizes)}
            >
                <div style={{ ...layoutCSS, background: '#ddd' }}>
                    Pane1
                </div>
                <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                    Pane2
                </div>
                <div style={{ ...layoutCSS, background: '#a1a5a9' }}>
                    Pane3
                </div>
            </SplitPane>
        </div>
    );
};
