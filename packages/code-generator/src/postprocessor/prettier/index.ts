import prettier from 'prettier';

import { PostProcessor, PostProcessorFactory } from '../../types';

const PARSERS = ['css', 'scss', 'less', 'json', 'html', 'vue'];

const factory: PostProcessorFactory<unknown> = () => {
  const codePrettier: PostProcessor = (content: string, fileType: string) => {
    let parser: prettier.BuiltInParserName;
    if (fileType === 'js' || fileType === 'jsx' || fileType === 'ts' || fileType === 'tsx') {
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

  return codePrettier;
};

export default factory;
