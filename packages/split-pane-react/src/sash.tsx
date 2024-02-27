import React, { useRef, useState } from 'react';
import { classNames, sashClassName } from './base';
import { ISashProps } from './types';

export default function Sash({
    className,
    render,
    onDragStart,
    onDragging,
    onDragEnd,
    ...others
}: ISashProps) {
    const timeout = useRef<any | null>(null);
    const [active, setActive] = useState(false);
    const [draging, setDrag] = useState(false);

    const handleMouseMove = function (e) {
        onDragging(e);
    };

    const handleMouseUp = function (e) {
        setDrag(false);
        onDragEnd(e);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            role="Resizer"
            className={classNames(
                sashClassName,
                className
            )}
            onMouseEnter={() => {
                timeout.current = setTimeout(() => {
                    setActive(true);
                }, 150);
            }}
            onMouseLeave={() => {
                if (timeout.current) {
                    setActive(false);
                    clearTimeout(timeout.current);
                }
            }}
            onMouseDown={e => {
                setDrag(true);
                onDragStart(e);

                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            }}
            {...others}
        >
            {render(draging || active)}
        </div>
    );
}
