import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

var Track = function Track(_ref) {
    var _classNames;

    var prefix = _ref.prefix;

    var classes = classNames((_classNames = {}, _classNames[prefix + 'range-track'] = true, _classNames));
    return React.createElement('div', { className: classes });
};

Track.propTypes = {
    prefix: PropTypes.string
};

Track.defaultProps = {
    prefix: 'next-'
};

export default Track;