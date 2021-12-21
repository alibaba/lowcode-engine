import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserPostCss from 'prettier/parser-postcss';
import parserHtml from 'prettier/parser-html';

import { PostProcessor, PostProcessorFactory } from '../../types';

const PARSERS = ['css', 'scss', 'less', 'json', 'html', 'vue'];

export interface ProcessorConfig {
  customFileTypeParser: Record<string, string>;
  plugins?: Array<prettier.Plugin>;
}

const factory: PostProcessorFactory<ProcessorConfig> = (config?: ProcessorConfig) => {
  const cfg: ProcessorConfig = {
    customFileTypeParser: {},
    ...config,
  };

  const codePrettier: PostProcessor = (content: string, fileType: string) => {
    let parser: prettier.BuiltInParserName | any;
    if (fileType === 'js' || fileType === 'jsx') {
      parser = 'babel';
    } else if (PARSERS.indexOf(fileType) >= 0) {
      parser = fileType;
    } else if (cfg.customFileTypeParser[fileType]) {
      parser = cfg.customFileTypeParser[fileType];
    } else {
      return content;
    }

    return prettier.format(content, {
      parser,
      plugins: [parserBabel, parserPostCss, parserHtml, ...(cfg.plugins || [])],
    });
  };

  return codePrettier;
};

export default factory;
