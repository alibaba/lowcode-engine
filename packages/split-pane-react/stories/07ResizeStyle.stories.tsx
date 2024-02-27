import React, { useState } from 'react';
import { Button } from '@storybook/react/demo';
import SplitPane, { Pane } from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Advanced',
};

export const FluidPanes = () => {
    const [sizes, setSizes] = useState<(number | string)[]>(['20%', 'auto']);
    const [sizes1, setSizes1] = useState<(number | string)[]>(['50%', 'auto']);

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={{ height: 500 }}>
            <p>Support fluid pane</p>
            <SplitPane sizes={sizes} onChange={setSizes}>
                <Pane minSize={100} maxSize='40%'>
                    <div style={{ ...layoutCSS, background: '#ddd' }}>
                        Pane1
                        <p>
                            Try sliding the right axis
                        </p>
                    </div>
                </Pane>
                <SplitPane sizes={sizes1}  onChange={setSizes1}>
                    <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                        Pane2
                    </div>
                    <div style={{ ...layoutCSS, background: '#a1a5a9' }}>
                        Pane3
                    </div>                  
                </SplitPane>
            </SplitPane>
        </div>
    );
};
