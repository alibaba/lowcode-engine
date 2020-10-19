import { readFileSync } from 'fs-extra';
import { NodeVM } from 'vm2';
// import PropTypes from 'prop-types';

const cssPattern = /\.(css|scss|sass|less)$/;
function requireInSandbox(filePath: string, PropTypes: any) {
  const vm = new NodeVM({
    sandbox: {},
    sourceExtensions: ['js', 'css', 'scss', 'sass', 'less'],
    compiler: (code, filename) => {
      if (filename.match(cssPattern)) {
        return `
              const handler = {
                get() {
                  return new Proxy({}, handler);
                },
              };
              const proxiedObject = new Proxy({}, handler);
              module.exports = proxiedObject;
            `;
      } else {
        return code;
      }
    },
    require: {
      external: true,
      context: 'sandbox',
      mock: {
        'prop-types': PropTypes,
      },
    },
  });
  const fileContent = readFileSync(filePath, { encoding: 'utf8' });
  return vm.run(fileContent, filePath);
}

export default requireInSandbox;
