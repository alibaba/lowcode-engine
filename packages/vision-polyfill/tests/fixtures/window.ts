import React from 'react';
import PropTypes from 'prop-types';

React.PropTypes = PropTypes;
window.React = React;

document.documentElement.requestFullscreen = () => {};
document.exitFullscreen = () => {};