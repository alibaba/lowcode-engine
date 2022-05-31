const { execSync } = require('child_process');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fse = require('fs-extra');

// get version from git branch name,
//  e.g. release/1.0.7 => 1.0.7
//       release/1.0.7-beta => 1.0.7 (beta)
function getVersion() {
  const gitBranchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' });
  const reBranchVersion = /^(?:[\w-]+\/)(\d+\.\d+\.\d+)(-?beta)?$/im;

  const match = reBranchVersion.exec(gitBranchName);
  if (!match) {
    console.warn(`[engine] gitBranchName: ${gitBranchName}`);
    return 'N/A';
  }

  const [_, version, beta] = match;

  return beta && beta.endsWith('beta') ? `${version}-beta` : version;
}

const releaseVersion = getVersion();

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
        VERSION_PLACEHOLDER: JSON.stringify(releaseVersion),
      }]);
    config.plugins.delete('hot');
    config.devServer.hot(false);
  });
};
