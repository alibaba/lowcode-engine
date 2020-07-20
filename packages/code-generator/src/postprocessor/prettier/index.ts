import prettier from 'prettier';
import mypretter from '@ali/my-prettier';

import { PostProcessor, PostProcessorFactory } from '../../types';

const PARSERS = ['css', 'scss', 'less', 'json', 'html', 'vue'];

type ProcessorConfig = {
  customFileTypeParser: Record<string, string>;
}

const factory: PostProcessorFactory<ProcessorConfig> = (config?: ProcessorConfig) => {
  const cfg: ProcessorConfig = {
    customFileTypeParser: {},
    ...config,
  };

  const codePrettier: PostProcessor = (content: string, fileType: string) => {
    let parser: prettier.BuiltInParserName;
    if (fileType === 'js' || fileType === 'jsx') {
      parser = 'babel';
    } else if (fileType === 'ts' || fileType === 'tsx') {
      parser = 'typescript';
    } else if (PARSERS.indexOf(fileType) >= 0) {
      parser = fileType as prettier.BuiltInParserName;
    } else if (cfg.customFileTypeParser[fileType]){
      parser = cfg.customFileTypeParser[fileType] as prettier.BuiltInParserName;
    } else if (fileType === 'vx') {
      return mypretter(content, fileType);
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
