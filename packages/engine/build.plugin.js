const { execSync } = require('child_process');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

function getReleaseVersion() {
  const gitBranchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
  const reBranchVersion = /^(?:[\w-]+\/)(\d+\.\d+\.\d+)$/im;
  const match = reBranchVersion.exec(gitBranchName);
  if (!match) {
    throw new Error(`[engine] gitBranchName: ${gitBranchName} is not valid`);
  }

  return match[1];
}

const version = getReleaseVersion();

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve
      .plugin('tsconfigpaths')
      .use(TsconfigPathsPlugin, [{
        configFile: './tsconfig.json',
      }]);
    config
      .plugin('define')
      .use(context.webpack.DefinePlugin, [{
        VERSION_PLACEHOLDER: version,
      }]);
    config.plugins.delete('hot');
    config.devServer.hot(false);
  });
};
