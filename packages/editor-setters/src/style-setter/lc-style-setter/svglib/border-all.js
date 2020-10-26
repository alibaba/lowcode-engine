
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function BorderAll(props) {
    return (
      <IconBase viewBox="0 0 20 20" {...props}>
        <g id="Page-1" stroke="none" stroke-width="1" fillRule="evenodd">
        <g transform="translate(-40.000000, -40.000000)">
            <g transform="translate(40.000000, 40.000000)">
                <g transform="translate(10.000000, 10.000000) rotate(270.000000) translate(-10.000000, -10.000000) ">
                    <rect x="4" y="4" width="12" height="12"/>
                    <path d="M0,-1.77635684e-15 L20,-1.77635684e-15 L20,20 L0,20 L0,-1.77635684e-15 Z M4,4 L16,4 L16,16 L4,16 L4,4 Z"/>
                </g>
            </g>
        </g>
    </g>
      </IconBase>
    );
  }
  BorderAll.displayName = 'BorderAll';

  module.exports = BorderAll;
