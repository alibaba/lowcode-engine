import React, { useState } from 'react';
import { Button } from '@storybook/react/demo';
import SplitPane, { Pane } from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Advanced',
};

export const PerformacnceMode = () => {
    const [sizes, setSizes] = useState<(number | string)[]>(['30%', 'auto']);

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={{ height: 500 }}>
            <p>High performance mode can be enabled through performanceMode</p>
            <SplitPane 
                sizes={sizes}
                performanceMode
                onChange={setSizes}
            >
                <Pane minSize={100} maxSize='50%'>
                    <div style={{ ...layoutCSS, background: '#ddd' }}>
                        <p>Pane1</p>
                        <p>minSize: 100px</p>
                        <p>maxSize: 50%</p>
                    </div>
                </Pane>
                <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                    Pane2
                </div>
            </SplitPane>
        </div>
    );
};
