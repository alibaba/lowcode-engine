import React from 'react';
import { classNames } from './base';
import { ISashContentProps } from './types';

function SashContent ({
	className,
	children,
	active,
	type,
	...others
}: ISashContentProps) {
	return (
		<div
			className={classNames(
				'split-sash-content',
				active && 'split-sash-content-active',
				type && `split-sash-content-${type}`,
				className
			)}
			{...others}
		>
			{children}
		</div>
	);
}

export default SashContent;
