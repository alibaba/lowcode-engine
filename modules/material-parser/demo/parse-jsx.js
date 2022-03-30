const parse = require('../lib').default;

(async () => {
  const options = {
    entry: './component.jsx',
    accesser: 'local',
  };

  const actual = await parse(options);
  console.log(JSON.stringify(actual, null, 2));
})();
