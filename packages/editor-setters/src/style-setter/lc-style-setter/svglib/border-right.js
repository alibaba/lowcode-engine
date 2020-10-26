
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function BorderRight(props) {
    return (
      <IconBase viewBox="0 0 20 20" {...props}>
        <g stroke="none" stroke-width="1" fillRule="evenodd">
        <g transform="translate(-40.000000, -40.000000)">
            <rect x="30" y="30" width="40" height="40"/>
            <g transform="translate(40.000000, 40.000000)">
                <g transform="translate(10.000000, 10.000000) rotate(90.000000) translate(-10.000000, -10.000000) ">
                    <rect x="0" y="0" width="20" height="4"/>
                    <rect x="0" y="4" width="20" height="16"/>
                </g>
            </g>
        </g>
    </g>
      </IconBase>
    );
  }
  BorderRight.displayName = 'BorderRight';

  module.exports = BorderRight;
