import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'index',
    'jsx',
    `
import React from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';

export default function Logo({ image, text, url }) {
  return (
    <div className="logo">
      <Link to={url || '/'} className={styles.logo}>
        {image && <img src={image} alt="logo" />}
        <span>{text}</span>
      </Link>
    </div>
  );
}
    `,
  );

  return [['src', 'layouts', 'BasicLayout', 'components', 'Logo'], file];
}
