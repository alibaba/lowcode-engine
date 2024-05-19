import React from 'react';
import { render } from '@testing-library/react';
import { SVGIcon, IconProps } from '../../src/svg-icon';

describe('SVGIcon', () => {
  it('should render SVG element with correct size', () => {
    const iconProps: IconProps = {
      size: 'small',
      viewBox: '0 0 24 24',
    };

    const { container } = render(<SVGIcon {...iconProps} />);

    const svgElement = container.querySelector('svg');

    expect(svgElement).toHaveAttribute('width', '12');
    expect(svgElement).toHaveAttribute('height', '12');
  });

  it('should render SVG element with custom size', () => {
    const iconProps: IconProps = {
      size: 24,
      viewBox: '0 0 24 24',
    };

    const { container } = render(<SVGIcon {...iconProps} />);

    const svgElement = container.querySelector('svg');

    expect(svgElement).toHaveAttribute('width', '24');
    expect(svgElement).toHaveAttribute('height', '24');
  });

  // Add more tests for other scenarios if needed
});
