module.exports = {
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
  ],
};