import * as React from 'react';
import Base, { BlockProps } from './Base';

export type ParagraphProps = BlockProps;

const Paragraph: React.FC<ParagraphProps> = props => <Base {...props} component="div" />;

export default Paragraph;
