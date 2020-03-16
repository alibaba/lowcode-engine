import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../context/appContext';
export default function localeConfig(componentName, Component) {
  class LNLocaleConfigView extends PureComponent {
    static dislayName = 'luna-locale-config';
    static contextType = AppContext;
    static propTypes = {
      forwardedRef: PropTypes.func
    };
    render() {
      const { forwardedRef, ...otherProps } = this.props;
      const { locale, messages } = this.context;
      const localeProps = {};
      if (locale && messages && messages[componentName]) {
        localeProps.locale = locale;
        localeProps.messages = messages[componentName];
      }
      const props = {
        ...localeProps,
        ...otherProps,
        ref: forwardedRef
      };
      return <Component {...props} />;
    }
  }

  return React.forwardRef((props, ref) => <LNLocaleConfigView {...props} forwardedRef={ref} />);
}
