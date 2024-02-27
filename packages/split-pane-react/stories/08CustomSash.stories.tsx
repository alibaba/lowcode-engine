import React, { useState } from 'react';
import { Button } from '@storybook/react/demo';
import SplitPane, { Pane, SashContent } from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Advanced',
};

export const CustomSash = () => {
    const [sizes, setSizes] = useState<(number | string)[]>([200, 200, 'auto']);

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={{ height: 500 }}>
            <p>Here are three different theme styles</p>
            <SplitPane 
                sizes={sizes}
                onChange={setSizes}
                resizerSize={6}
                sashRender={(index, active) => (
                    <SashContent style={{ backgroundColor: 'gray' }} />
                )}
            >
                <Pane>
                    <div style={{ ...layoutCSS, backgroundColor: '#ddd' }} >
                        pane1
                    </div>
                </Pane>
                <Pane>
                    <div style={{ ...layoutCSS, backgroundColor: '#ccc' }} >
                        pane2
                    </div>
                </Pane>
                <Pane>
                    <div style={{ ...layoutCSS, backgroundColor: '#bbb' }} >
                        pane3
                    </div>
                </Pane>
            </SplitPane>
        </div>
    );
};
