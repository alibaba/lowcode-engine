import React from 'react';

export default function BasicLayout({ children }) {
  return (
    <div style={{ paddingTop: '100px' }}>
      {children}
    </div>
  );
}
