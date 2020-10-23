
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Flex(props) {
    return (
      <IconBase viewBox="0 0 23 14" {...props}>
        <g fillRule="evenodd"><path d="M21 2v10H2V2h19zm1-1H1v12h21V1z" opacity=".15"/><path d="M1.2 0A1.2 1.2 0 0 0 0 1.2v11.6A1.2 1.2 0 0 0 1.2 14h20.6a1.2 1.2 0 0 0 1.2-1.2V1.2A1.2 1.2 0 0 0 21.8 0H1.2zM22 13H1V1h21v12z"/><path opacity=".4" d="M3 3h5v8H3z"/><path d="M4 4v6h3V4H4zm4-1v8H3V3h5z"/><path opacity=".4" d="M9 3h5v8H9z"/><path d="M10 4v6h3V4h-3zm4-1v8H9V3h5z"/><path opacity=".4" d="M15 3h5v8h-5z"/><path d="M16 4v6h3V4h-3zm4-1v8h-5V3h5z"/></g>
      </IconBase>
    );
  }
  Flex.displayName = 'Flex';

  module.exports = Flex;
