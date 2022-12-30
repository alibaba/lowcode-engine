module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.performance.hints(false);
  });
};
