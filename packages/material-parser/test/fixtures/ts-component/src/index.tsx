import App from './main-module';
import SubModule from './sub-module';

App.SubModule = SubModule;
App.defaultProps = {
  str: 'str2',
};

export default App;
