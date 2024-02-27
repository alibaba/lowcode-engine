import React, { useState } from 'react';
import SplitPane from '../src';
import '../src/themes/default.scss';

export default {
    title: 'Basic',
};

export const ComplexLayout = () => {
    const [sizes, setSizes] = useState<(number | string)[]>([250, 'auto']);
    const [sizes1, setSizes1] = useState<(number | string)[]>([400, 'auto']);
    const [sizes2, setSizes2] = useState<(number | string)[]>([500, 'auto']);

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={{ height: 500 }}>
            <p>Split supports complex layouts</p>
            <SplitPane
                split="horizontal"
                sizes={sizes}
                onChange={setSizes}
            >
                <SplitPane sizes={sizes1} onChange={setSizes1}>
                    <div style={{ ...layoutCSS, background: '#ddd' }}>
                        Top Pane1
                    </div>
                    <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                        Top Pane2
                    </div>
                </SplitPane>
                <SplitPane sizes={sizes2} onChange={setSizes2}>
                    <div style={{ ...layoutCSS, background: '#c0c3c6' }}>
                        Bottom Pane1
                    </div>
                    <div style={{ ...layoutCSS, background: '#a1a5a9' }}>
                        Bottom Pane2
                    </div>
                </SplitPane>
            </SplitPane>
        </div>
    );
};
