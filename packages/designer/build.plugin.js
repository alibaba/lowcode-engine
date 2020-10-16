module.exports = ({ onGetJestConfig }) => {
  // console.log('== test ==');
  onGetJestConfig((jestConfig) => {
    // console.log(jestConfig);
    return jestConfig;
  });
};
