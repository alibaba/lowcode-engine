
import React from 'react';
import styles from './index.module.scss';

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>Alibaba Fusion</span>
      <br />
      <span className={styles.copyright}>© 2019-现在 Alibaba Fusion & ICE</span>
    </p>
  );
}
    