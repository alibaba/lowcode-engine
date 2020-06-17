import prettier from 'prettier';

import { PostProcessor } from '../../types';

const PARSERS = ['css', 'scss', 'less', 'json', 'html', 'vue'];

const codePrettier: PostProcessor = (content: string, fileType: string) => {
  let parser: prettier.BuiltInParserName;
  if (fileType === 'js' || fileType === 'jsx') {
    parser = 'babel';
  } else if (PARSERS.indexOf(fileType) >= 0) {
    parser = fileType as prettier.BuiltInParserName;
  } else {
    return content;
  }

  return prettier.format(content, {
    parser,
  });
};

export default codePrettier;
