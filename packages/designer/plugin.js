module.exports = ({ onGetJestConfig, onGetWebpackConfig }) => {
  console.log('111111111111xxxxxxxxxxxx')
  onGetWebpackConfig((config) => {
    console.log('111111111111')
    config.browserslist('last 2 versions, Firefox ESR, > 1%, ie >= 9, iOS >= 8, Android >= 4');
  });

  onGetJestConfig((jestConfig) => {
    console.log('11111111111122222222')
    return jestConfig;
  });
};
